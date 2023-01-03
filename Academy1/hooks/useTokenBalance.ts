import { useWallet } from '@cosmos-kit/react';
import { useState, useEffect } from 'react';
import { Cw20QueryClient } from '../codegen/Cw20.client';

export function useTokenBalance(contractAddress: string) {
  // -- offline signer -- //
  const { getCosmWasmClient, address } = useWallet();
  // getting the signer's address and the CosmWasmClient from @cosmos-kit/react
  const [cw20Client, setCw20Client] = useState<Cw20QueryClient | null>(null);
  // setting the Cw20QueryClient from imported Cw20.client.ts
  const [balance, setBalance] = useState<string | null>(null);
  // setting the balance of the token from cw20Client.balance()
  
  // -- cw20Client -- //
  useEffect(() => {
    // getCosmWasmClient comes from the above const useWallet()
    getCosmWasmClient().then((cosmWasmClient) => {
      if (!cosmWasmClient) {
        console.error("No CosmWasmClient found");
        return;
      }
      const newClient = new Cw20QueryClient(cosmWasmClient, contractAddress);
      // Cw20QueryClient comes from imported Cw20.client.ts, contractAddress is the address of the token
      // newClient is the Cw20QueryClient, which allows us to query the token balance
      setCw20Client(newClient);
      // setting the Cw20QueryClient to the newClient we just created using the UseState<Cw20QueryClient | null>(null)
    })
  }, [contractAddress, address, getCosmWasmClient]);
  // contractAddress is the address of the token, address is the signer's address, getCosmWasmClient comes from the above const useWallet()
  // contractAddress, address, and getCosmWasmClient are all dependencies for the useEffect, so if any of them change, the useEffect will run again

  // -- query and return token balance -- //
  useEffect(() => {
    // cw20Client comes from the above const useState
    if (cw20Client && address) {
      cw20Client.balance({ address }).then((res) => setBalance(res.balance));
      // address signer is being used here, showing other balances will be different
      // if there is a cw20Client and an address, then we can query the balance of the token, and set the balance to the balance of the token
}
});

  return balance ?? undefined;
  // if there is a balance, return the balance, otherwise return undefined
}

