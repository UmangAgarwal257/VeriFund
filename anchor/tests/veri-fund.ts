import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { VeriFund } from "../target/types/veri_fund";
import { expect } from "chai";
import { Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram } from "@solana/web3.js";

// Helper: Airdrop using localnet connection
async function airdropLocalnet(connection: anchor.web3.Connection, pubkey: PublicKey, amount: number) {
  const sig = await connection.requestAirdrop(pubkey, amount);
  await connection.confirmTransaction(sig, "confirmed");
  // Optionally, poll for balance
  let retries = 30;
  while (retries > 0) {
    const balance = await connection.getBalance(pubkey);
    if (balance >= amount) return;
    await new Promise(res => setTimeout(res, 200));
    retries--;
  }
  throw new Error(`Airdrop to ${pubkey.toBase58()} failed`);
}

describe("veri-fund", () => {
  // Use localnet endpoint
  const connection = new anchor.web3.Connection("https://api.devnet.solana.com");
  const wallet = anchor.Wallet.local();
  const provider = new anchor.AnchorProvider(
    connection,
    wallet,
    { commitment: "confirmed" }
  );
  anchor.setProvider(provider);
  const program = anchor.workspace.VeriFund as Program<VeriFund>;

  let platformAuthority: anchor.Wallet;
  let creator: Keypair;
  let voucher: Keypair;
  let donor: Keypair;

  let programStatePda: PublicKey;
  let campaignPda: PublicKey;
  let vouchPda: PublicKey;
  let donationTransactionPda: PublicKey;
  let withdrawTransactionPda: PublicKey;

  const firstCampaignPdaDerivationKey = new anchor.BN(1);
  const firstCampaignStoredCid = new anchor.BN(1);

  before(async () => {
    platformAuthority = provider.wallet as anchor.Wallet;
    creator = Keypair.generate();
    voucher = Keypair.generate();
    donor = Keypair.generate();

    // Airdrop using localnet
    await airdropLocalnet(provider.connection, creator.publicKey, 2 * LAMPORTS_PER_SOL);
    await airdropLocalnet(provider.connection, voucher.publicKey, 2 * LAMPORTS_PER_SOL);
    await airdropLocalnet(provider.connection, donor.publicKey, 2 * LAMPORTS_PER_SOL);

    // Derive PDAs
    [programStatePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("program_state")],
      program.programId
    );
    [campaignPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("campaign"), firstCampaignPdaDerivationKey.toArrayLike(Buffer, "le", 8)],
      program.programId
    );
  });

  it("Initializes the program state", async () => {
    const tx = await program.methods
      .initializeProgram()
      .accountsStrict({
        programState: programStatePda,
        authority: platformAuthority.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
    console.log("Initialize program transaction signature:", tx);

    const state = await program.account.programState.fetch(programStatePda);
    expect(state.initialized).to.be.true;
    expect(state.campaignCount.toNumber()).to.equal(0);
    expect(state.platformFee.toNumber()).to.equal(5);
    expect(state.platformAddress.toString()).to.equal(platformAuthority.publicKey.toString());
  });

  it("Creates a new campaign", async () => {
    const title = "Test Campaign Title";
    const description = "A great description for our test campaign.";
    const imageUrl = "https://example.com/image.png";
    const goal = new anchor.BN(10 * LAMPORTS_PER_SOL);

    const tx = await program.methods
      .createCampaign(title, description, imageUrl, goal)
      .accountsStrict({
        programState: programStatePda,
        campaign: campaignPda,
        creator: creator.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([creator])
      .rpc();
    console.log("Create campaign transaction signature:", tx);

    const campaignAccount = await program.account.campaign.fetch(campaignPda);
    expect(campaignAccount.creator.toString()).to.equal(creator.publicKey.toString());
    expect(campaignAccount.title).to.equal(title);
    expect(campaignAccount.description).to.equal(description);
    expect(campaignAccount.imageUrl).to.equal(imageUrl);
    expect(campaignAccount.goal.eq(goal)).to.be.true;
    expect(campaignAccount.amountRaised.toNumber()).to.equal(0);
    expect(campaignAccount.balance.toNumber()).to.equal(0);
    expect(campaignAccount.donors.toNumber()).to.equal(0);
    expect(campaignAccount.isActive).to.be.true;
    expect(campaignAccount.cid.eq(firstCampaignStoredCid)).to.be.true;

    const state = await program.account.programState.fetch(programStatePda);
    expect(state.campaignCount.toNumber()).to.equal(1);
  });

  it("Vouches for a campaign", async () => {
    const stakeAmount = new anchor.BN(1 * LAMPORTS_PER_SOL);

    [vouchPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("vouch"), campaignPda.toBuffer(), voucher.publicKey.toBuffer()],
      program.programId
    );

    const tx = await program.methods
      .vouchForCampaign(firstCampaignPdaDerivationKey, stakeAmount)
      .accountsStrict({
        campaign: campaignPda,
        vouch: vouchPda,
        voucher: voucher.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([voucher])
      .rpc();
    console.log("Vouch for campaign transaction signature:", tx);

    const vouchAccount = await program.account.vouch.fetch(vouchPda);
    expect(vouchAccount.campaign.toString()).to.equal(campaignPda.toString());
    expect(vouchAccount.voucher.toString()).to.equal(voucher.publicKey.toString());
    expect(vouchAccount.stakeAmount.eq(stakeAmount)).to.be.true;
    expect(vouchAccount.timestamp.toNumber()).to.be.greaterThan(0);
  });

  it("Donates to a campaign", async () => {
    const donationAmount = new anchor.BN(2 * LAMPORTS_PER_SOL);
    const campaignStateBefore = await program.account.campaign.fetch(campaignPda);

    const donorCountSeed = new anchor.BN(campaignStateBefore.donors.toNumber() + 1);

    [donationTransactionPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("transaction"),
        donor.publicKey.toBuffer(),
        firstCampaignPdaDerivationKey.toArrayLike(Buffer, "le", 8),
        donorCountSeed.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );

    const campaignBalanceBefore = await provider.connection.getBalance(campaignPda);

    const tx = await program.methods
      .donateToCampaign(firstCampaignPdaDerivationKey, donationAmount)
      .accountsStrict({
        campaign: campaignPda,
        transaction: donationTransactionPda,
        donor: donor.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([donor])
      .rpc();
    console.log("Donate to campaign transaction signature:", tx);

    const transactionAccount = await program.account.transaction.fetch(donationTransactionPda);
    expect(transactionAccount.owner.toString()).to.equal(donor.publicKey.toString());
    expect(transactionAccount.cid.eq(firstCampaignPdaDerivationKey)).to.be.true;
    expect(transactionAccount.amount.eq(donationAmount)).to.be.true;
    expect(transactionAccount.credited).to.be.true;

    const campaignAccount = await program.account.campaign.fetch(campaignPda);
    expect(campaignAccount.amountRaised.eq(donationAmount)).to.be.true;
    expect(campaignAccount.donors.toNumber()).to.equal(campaignStateBefore.donors.toNumber() + 1);

    const campaignBalanceAfter = await provider.connection.getBalance(campaignPda);
    expect(campaignBalanceAfter).to.equal(campaignBalanceBefore + donationAmount.toNumber());

    const rawCampaignAccountInfo = await provider.connection.getAccountInfo(campaignPda);
    if (!rawCampaignAccountInfo) {
      throw new Error("Failed to fetch raw campaign account info after donation");
    }
    const rentExemptLamports = await provider.connection.getMinimumBalanceForRentExemption(rawCampaignAccountInfo.data.length);
    expect(campaignAccount.balance.eq(new anchor.BN(campaignBalanceAfter - rentExemptLamports)));
  });

  it("Withdraws funds from a campaign", async () => {
    const campaignStateBefore = await program.account.campaign.fetch(campaignPda);
    const programState = await program.account.programState.fetch(programStatePda);
    const withdrawalAmount = new anchor.BN(1 * LAMPORTS_PER_SOL);

    const withdrawalCountSeed = new anchor.BN(campaignStateBefore.withdrawalsTotal.toNumber());

    [withdrawTransactionPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("withdraw"),
        creator.publicKey.toBuffer(),
        firstCampaignPdaDerivationKey.toArrayLike(Buffer, "le", 8),
        withdrawalCountSeed.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );

    const creatorBalanceBefore = await provider.connection.getBalance(creator.publicKey);
    const campaignPdaBalanceBefore = await provider.connection.getBalance(campaignPda);

    const tx = await program.methods
      .withdrawFunds(firstCampaignPdaDerivationKey, withdrawalAmount)
      .accountsStrict({
        campaign: campaignPda,
        transaction: withdrawTransactionPda,
        programState: programStatePda,
        platformAddress: programState.platformAddress,
        creator: creator.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([creator])
      .rpc();
    console.log("Withdraw funds transaction signature:", tx);

    const latestBlockHash = await provider.connection.getLatestBlockhash();
    await provider.connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: tx,
    });

    const transactionAccount = await program.account.transaction.fetch(withdrawTransactionPda);
    expect(transactionAccount.owner.toString()).to.equal(creator.publicKey.toString());
    expect(transactionAccount.cid.eq(firstCampaignPdaDerivationKey)).to.be.true;
    expect(transactionAccount.amount.eq(withdrawalAmount)).to.be.true;
    expect(transactionAccount.credited).to.be.false;

    const campaignAccount = await program.account.campaign.fetch(campaignPda);
    expect(campaignAccount.withdrawalsTotal.eq(campaignStateBefore.withdrawalsTotal.add(withdrawalAmount))).to.be.true;

    const campaignPdaBalanceAfter = await provider.connection.getBalance(campaignPda);
    expect(campaignPdaBalanceAfter).to.equal(campaignPdaBalanceBefore - withdrawalAmount.toNumber());

    const creatorBalanceAfter = await provider.connection.getBalance(creator.publicKey);
    const expectedCreatorIncrease = withdrawalAmount.toNumber() * (100 - programState.platformFee.toNumber()) / 100;
    expect(creatorBalanceAfter).to.be.closeTo(creatorBalanceBefore - 5000 + expectedCreatorIncrease, 100000);

    const rawCampaignAccountInfo = await provider.connection.getAccountInfo(campaignPda);
    if (!rawCampaignAccountInfo) {
      throw new Error("Failed to fetch raw campaign account info after withdrawal");
    }
    const rentExemptLamports = await provider.connection.getMinimumBalanceForRentExemption(rawCampaignAccountInfo.data.length);
    expect(campaignAccount.balance.eq(new anchor.BN(campaignPdaBalanceAfter - rentExemptLamports)));
  });
});