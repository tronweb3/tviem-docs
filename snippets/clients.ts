// Both clients in one module, for samples that read and write in the same
// snippet — including `publicClient.ts` and `walletClient.ts` side by side
// would import `http` and `mainnet` twice.
import {
  createPublicClient,
  createWalletClient,
  http,
  privateKeyToAccount,
} from '@tronweb3/tviem'
import { mainnet } from '@tronweb3/tviem/chains'

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
})

export const account = privateKeyToAccount(
  '0x0000000000000000000000000000000000000000000000000000000000000001',
)

export const walletClient = createWalletClient({
  account,
  chain: mainnet,
  transport: http(),
})
