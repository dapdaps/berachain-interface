import { NULL_ADDRESS } from "@/sdk/constants";
import { Address } from "abitype";

export const ContractAddresses = {
  WrappedVault: "0xb0a3960b115e0999f33e8afd4a11f16e04e2bf33",
  WrappedVaultFactory: "0x75e502644284edf34421f9c355d75db79e343bca",
  PointsFactory: "0x19112adbdafb465ddf0b57ecc07e68110ad09c50",
  RecipeMarketHub: "0x783251f103555068c1e9d755f69458f39ed937c0",
  VaultMarketHub: "0xa97ecc6bfda40baf2fdd096dd33e88bd8e769280",
  WeirollWallet: "0x40a1c08084671e9a799b73853e82308225309dc0",
  WeirollWalletHelper: "0x07899ac8be7462151d6515fcd4773dd9267c9911", // TODO: Needs to be updated
} as Record<string, Address>;
