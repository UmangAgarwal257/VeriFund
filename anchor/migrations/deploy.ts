// Migrations are an early feature. Currently, they're nothing more than this
// single deploy script that's invoked from the CLI, injecting a provider
// configured from the workspace's Anchor.toml.

const anchor = require("@coral-xyz/anchor");
const { SystemProgram, PublicKey } = anchor.web3;

module.exports = async function (provider) {
  // Configure client to use the provider.
  anchor.setProvider(provider);

  const program = anchor.workspace.VeriFund;
  const platformAuthority = provider.wallet.publicKey;

  // 1. Determine the ProgramState PDA
  const [programStatePda] = PublicKey.findProgramAddressSync(
    [Buffer.from("program_state")],
    program.programId
  );

  console.log("Program ID:", program.programId.toBase58());
  console.log("Platform Authority (Payer):", platformAuthority.toBase58());
  console.log("ProgramState PDA:", programStatePda.toBase58());

  // 2. Define the platform fee (e.g., 100 = 1%)
  // You should choose an appropriate value for your platform.
  const platformFee = new anchor.BN(100); // Example: 1% fee (100 basis points)

  try {
    // 3. Check if ProgramState is already initialized
    const existingProgramState = await program.account.programState.fetchNullable(programStatePda);
    if (existingProgramState) {
      console.log("ProgramState account already initialized at:", programStatePda.toBase58());
      console.log("Initialized data:", existingProgramState);
      // Optionally, you could update the fee here if your program supports it
      // or just skip if no update is needed.
      // For now, we'll just log and exit if already initialized.
      return;
    }

    console.log(`Initializing ProgramState with platform fee: ${platformFee.toString()} basis points...`);

    // 4. Call the initialize_program instruction
    const tx = await program.methods
      .initializeProgram(platformFee)
      .accounts({
        programState: programStatePda,
        authority: platformAuthority,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("Program initialized successfully!");
    console.log("Transaction signature:", tx);

    const newProgramState = await program.account.programState.fetch(programStatePda);
    console.log("Initialized ProgramState data:", newProgramState);

  } catch (error) {
    console.error("Error during migration (initializing program):", error);
    // If it's an "already initialized" type of error, we can often ignore it,
    // but the fetchNullable check above should prevent this.
    // For other errors, re-throw to make the migration fail.
    if (error.message.includes("already in use") || error.message.includes("custom program error: 0x0")) {
        console.warn("ProgramState might have been initialized in a previous attempt or by another process.");
        try {
            const state = await program.account.programState.fetch(programStatePda);
            console.log("Fetched ProgramState data after error:", state);
        } catch (fetchError) {
            console.error("Failed to fetch ProgramState even after presumed initialization error:", fetchError);
            throw error; // Re-throw original error if fetch fails
        }
    } else {
        throw error;
    }
  }
};
