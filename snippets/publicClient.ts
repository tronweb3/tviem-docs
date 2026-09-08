// #region imports
import { createPublicClient, http } from '@tronweb3/tviem'
import { mainnet } from '@tronweb3/tviem/chains'
// #endregion imports

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
})
