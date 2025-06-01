# VeriFund - Decentralized Crowdfunding Platform

VeriFund is a decentralized crowdfunding platform built on Solana that facilitates transparent fundraising, community vouching for projects, and efficient management of campaign funds.

# Deployed Contract Devnet Address

`AeXnytP4SKPSeUm176KHoLSV54AAn11iF8AaMctWrDPw`

## Overview

VeriFund leverages blockchain technology to create a secure, transparent, and efficient system for campaign creators and backers. The platform allows creators to launch fundraising campaigns, and backers to support projects they believe in, with all interactions recorded on-chain. Community members can vouch for the legitimacy of campaigns, adding a layer of trust.

## Features

- **Campaign Creation**: Create on-chain fundraising campaigns with customizable attributes (goal, description, duration).
- **Community Vouching**: Allow users to stake tokens to vouch for campaigns, signaling trust.
- **Transparent Donations**: Facilitate direct SOL donations to campaigns, recorded on the blockchain.
- **Automated Withdrawals**: Enable campaign creators to withdraw raised funds, with automated platform fee deductions.
- **Platform Fee Management**: Configurable platform fees managed transparently.
- **On-Chain Governance**: (Future Scope) Potential for community governance over platform parameters.

## Technology Stack

- **Blockchain**: Solana
- **Development Framework**: Anchor
- **Testing**: Mocha & Chai

## Project Structure

```
veri-fund/
├── anchor/
│   ├── Anchor.toml
│   ├── Cargo.lock
│   ├── Cargo.toml
│   ├── package.json
│   ├── tsconfig.json
│   ├── migrations/
│   │   └── deploy.ts
│   ├── programs/
│   │   └── veri-fund/
│   │       ├── Cargo.toml
│   │       ├── Xargo.toml # (Typically not present in modern Anchor, but kept if in your Tickr example)
│   │       └── src/
│   │           ├── constants.rs
│   │           ├── error.rs
│   │           ├── lib.rs
│   │           ├── instructions/
│   │           └── state/
│   ├── target/
│   │   ├── debug/
│   │   ├── deploy/
│   │   ├── idl/
│   │   ├── release/
│   │   ├── sbf-solana-solana/
│   │   └── types/
│   └── tests/
│       └── veri_fund.ts # (Assuming your test file is named veri_fund.ts)
├── .gitignore
└── README.md
```

## Architecture

VeriFund is built around key components:

- **Program State**: Manages global platform configurations like fees and campaign counts.
- **Campaign**: Represents individual fundraising initiatives with details like goal, amount raised, creator, and deadline.
- **Vouch**: Stores information about community members vouching for specific campaigns.
- **Transaction**: Records all donation and withdrawal activities for transparency.

## Getting Started

### Prerequisites

- Rust and Cargo
- Solana CLI
- Node.js and npm/yarn
- Anchor CLI (version specified in `anchor/Anchor.toml` - `0.31.1`)

### Installation

1.  Clone the repository:
    ```bash
    git clone <your-verifund-repository-url>
    cd veri-fund
    ```
2.  Install dependencies:
    ```bash
    cd anchor
    yarn install
    ```
3.  Build the program:
    ```bash
    anchor build
    ```

## Testing

Run the test suite to validate functionality:

```bash
anchor test
```
