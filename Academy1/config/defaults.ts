import { assets } from 'chain-registry';
import { AssetList, Asset } from '@chain-registry/types';

export const chainName = 'cosmwasmtestnet';
export const stakingDenom = 'umlg';
export const feeDenom = 'uand';

export const cw20ContractAddress =
  'wasm1ea72ykc8wlnpqjtt5d4ldd8jsqvhcs6y8rrdfwzvm5eru0wncnxs5ytzxm';

export const chainassets: AssetList = assets.find(
  (chain) => chain.chain_name === chainName
) as AssetList;

export const coin: Asset = chainassets.assets.find(
  (asset) => asset.base === stakingDenom
) as Asset;
