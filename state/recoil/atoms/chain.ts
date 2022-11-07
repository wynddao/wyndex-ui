import { SigningCosmWasmClient } from 'cosmwasm'
import { atom } from 'recoil'

export const signingCosmWasmClientAtom = atom<
  SigningCosmWasmClient | undefined
>({
  key: 'signingCosmWasmClient',
  dangerouslyAllowMutability: true,
})

export const myAddressAtom = atom<number | null>({
    key: "myAddress",
    default: null,
  });
  