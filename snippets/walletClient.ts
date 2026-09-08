// #region imports
import { createWalletClient, http, privateKeyToAccount } from '@tronweb3/tviem'
import { mainnet } from '@tronweb3/tviem/chains'
// #endregion imports

export const account = privateKeyToAccount(
  '0x0000000000000000000000000000000000000000000000000000000000000001',
)

export const walletClient = createWalletClient({
  account,
  chain: mainnet,
  transport: http(),
})
