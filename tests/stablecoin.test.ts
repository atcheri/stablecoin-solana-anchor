import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Stablecoin } from "../target/types/stablecoin";
import { PythSolanaReceiver } from "@pythnetwork/pyth-solana-receiver";

describe("stablecoin", () => {
  const provider = anchor.AnchorProvider.env();
  const connection = provider.connection;
  const wallet = provider.wallet as anchor.Wallet;
  anchor.setProvider(provider);

  const program = anchor.workspace.Stablecoin as Program<Stablecoin>;

  const pythSolanaReceiver = new PythSolanaReceiver({ connection, wallet });

  const SOL_PRICE_FEED =
    "0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d";
  const solUsdPriceFeedAccount = pythSolanaReceiver.getPriceFeedAccountAddress(
    0,
    SOL_PRICE_FEED
  );
  const [collateralAccount] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("collateral"), wallet.publicKey.toBuffer()],
    program.programId
  );

  it("is initialized", async () => {
    const tx = await program.methods
      .initializeConfig()
      .accounts({})
      .rpc({ skipPreflight: true, commitment: "confirmed" });
    console.log("initialized tx", tx);
  });

  it("deposits collateral and mints USDC", async () => {
    const amountCollateral = new anchor.BN(1_000_000_000);
    const amountToMint = new anchor.BN(1_000_000_000);

    const tx = await program.methods
      .depositCollateralAndMintTokens(amountCollateral, amountToMint)
      .accounts({ priceUpdate: solUsdPriceFeedAccount })
      .rpc({ skipPreflight: true, commitment: "confirmed" });
    console.log("transaction signature: ", tx);
  });

  it("redeems collateral and burns USDC", async () => {
    const amountCollateral = new anchor.BN(500_000_000);
    const amountToBurn = new anchor.BN(500_000_000);

    const tx = await program.methods
      .redeemCollateralAndBurnTokens(amountCollateral, amountToBurn)
      .accounts({ priceUpdate: solUsdPriceFeedAccount })
      .rpc({ skipPreflight: true, commitment: "confirmed" });
    console.log("transaction signature: ", tx);
  });

  describe("when the config updated", async () => {
    await program.methods
      .updateConfig(new anchor.BN(100))
      .accounts({})
      .rpc({ skipPreflight: true, commitment: "confirmed" });

    it("liquidates the account", async () => {
      const amountToBurn = new anchor.BN(500_000_000);
      const tx = await program.methods
        .liquidate(amountToBurn)
        .accounts({ priceUpdate: solUsdPriceFeedAccount })
        .rpc({ skipPreflight: true, commitment: "confirmed" });
      console.log("liquidation transaction signature: ", tx);
    });
  });
});
