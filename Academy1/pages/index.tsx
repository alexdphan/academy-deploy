import Head from 'next/head';
import {
  Box,
  Divider,
  Grid,
  Heading,
  Text,
  Stack,
  Container,
  Link,
  Button,
  Flex,
  Icon,
  useColorMode,
  useColorModeValue,
  Input,
} from '@chakra-ui/react';
import { BsFillMoonStarsFill, BsFillSunFill } from 'react-icons/bs';
import { Product, Dependency, WalletSection } from '../components';
import { cw20ContractAddress, dependencies, products } from '../config';
import { useTokenBalance } from '../hooks/useTokenBalance';
import { useState, useEffect } from 'react';
import { Cw20Client } from '../codegen/Cw20.client';
import { useWallet } from '@cosmos-kit/react';

export default function Home() {
  const { colorMode, toggleColorMode } = useColorMode();
  const balance = useTokenBalance(cw20ContractAddress);
  const [amount, setAmount] = useState<string | undefined>(undefined);
  const [recipient, setRecipient] = useState<string | undefined>(undefined);
  const [cw20Client, setCw20Client] = useState<Cw20Client | undefined>(
    undefined
  );
  const [txHash, setTxHash] = useState<string | undefined>(undefined);

  const handleAmount = (event: any) => {
    setAmount(event.target.value);
  };

  const handleRecipient = (event: any) => {
    setRecipient(event.target.value);
  };

const walletManager = useWallet();
const { getSigningStargateClient, getSigningCosmWasmClient, address } =
  walletManager;

useEffect(() => {
  getSigningCosmWasmClient().then((cosmWasmClient) => {
    if (!cosmWasmClient || !address) {
      console.error('No cosmwasm client or address');
      return;
    }
    const newClient = new Cw20Client(
      cosmWasmClient,
      address,
      cw20ContractAddress
    );
    setCw20Client(newClient);
  });
}, [address, getSigningCosmWasmClient]);

  const handleSend = async () => {
    if (!cw20Client) {
      console.error('No cw20Client was found, please connect your wallet');
      return;
    }

    if (!amount || !recipient) {
      console.error('Please enter an amount or recipient');
      return;
    }

    const result = await cw20Client.transfer({ amount, recipient });
    // the fee here would be 0.0025 umlga, which is the default gas price

    console.log('Result of transfer: ', result);

    setTxHash(result.transactionHash);
  };

  return (
    <Container maxW="5xl" py={10}>
      <Head>
        <title>Create Cosmos App</title>
        <meta name="description" content="Generated by create cosmos app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex justifyContent="end" mb={4}>
        <Button variant="outline" px={0} onClick={toggleColorMode}>
          <Icon
            as={colorMode === 'light' ? BsFillMoonStarsFill : BsFillSunFill}
          />
        </Button>
      </Flex>
      <Box textAlign="center">
        <Heading
          as="h1"
          fontSize={{ base: '3xl', sm: '4xl', md: '5xl' }}
          fontWeight="extrabold"
          mb={3}
        >
          Create Cosmos App
        </Heading>
        <Heading
          as="h1"
          fontWeight="bold"
          fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}
        >
          <Text as="span">Welcome to&nbsp;</Text>
          <Text
            as="span"
            color={useColorModeValue('primary.500', 'primary.200')}
          >
            CosmosKit + Next.js
          </Text>
        </Heading>
      </Box>
      <WalletSection />
      <p>Your token balance is: {balance} Tokens</p>
      <Input
        placeholder="Address"
        value={recipient}
        onChange={handleRecipient}
      />
      <Input placeholder="Amount" value={amount} onChange={handleAmount} />
      <p>{txHash}</p>
      <Button onClick={handleSend}>Send</Button>
      <Grid
        templateColumns={{
          md: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)',
        }}
        gap={8}
        mb={14}
      >
        {products.map((product) => (
          <Product key={product.title} {...product}></Product>
        ))}
      </Grid>
      <Grid templateColumns={{ md: '1fr 1fr' }} gap={8} mb={20}>
        {dependencies.map((dependency) => (
          <Dependency key={dependency.title} {...dependency}></Dependency>
        ))}
      </Grid>
      <Box mb={3}>
        <Divider />
      </Box>
      <Stack
        isInline={true}
        spacing={1}
        justifyContent="center"
        opacity={0.5}
        fontSize="sm"
      >
        <Text>Built with</Text>
        <Link
          href="https://cosmology.tech/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Cosmology
        </Link>
      </Stack>
    </Container>
  );
}

// Result of transfer // 
// "root":{ 5 items
// "@type":string"/cosmwasm.wasm.v1.MsgExecuteContract"
// "sender":string"wasm14emfn5eeqmumh5vq0yw7jt8556kz3r34j22u3r"
// "contract":string"wasm1ea72ykc8wlnpqjtt5d4ldd8jsqvhcs6y8rrdfwzvm5eru0wncnxs5ytzxm"
// "msg":{1 item
// "transfer":{2 items
// "amount":string"5"
// "recipient":string"wasm1lzgzypfwy5t94l2nlvh9h8njuwmy0fyhpufltw"
// }
// }
// "funds":[]0 items
// }

// Your token balance is: 123455999995 Tokens

// wasm1lzgzypfwy5t94l2nlvh9h8njuwmy0fyhpufltw
// 5
// 6C6509A7CA4A998F0BAC9536D53E26DF3C217CBF12D8275A9FFD8424F97072D
// https://block-explorer.malaga-420.cosmwasm.com/transactions/6C6509A7CA4A998F0BAC9536D53E26DF3C217CBF12D8275A9FFD8424F97072D8