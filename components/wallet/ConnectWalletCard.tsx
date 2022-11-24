import {
  Box,
  Center,
  Icon,
  Image,
  Stack,
  Text,
  useColorMode
} from '@chakra-ui/react';
import React from 'react';
import { IoMdWallet } from 'react-icons/io';

import { handleChangeColorModeValue } from '../../default-component';
import { ConnectedUserCardType } from '../../types';

export const SimpleAvatarWithName = ({
  walletIcon,
  username,
  icon
}: ConnectedUserCardType) => {
  const { colorMode } = useColorMode();
  return (
    <Stack spacing={1} alignItems="center">
      <Box
        display={icon ? 'block' : 'none'}
        minW={24}
        maxW={24}
        w={24}
        minH={24}
        maxH={24}
        h={24}
        borderRadius="full"
        overflow="hidden"
      >
        {icon}
      </Box>
      {username && (
        <Stack isInline={true} alignItems="center">
          {walletIcon ? (
            <Box minW={5} maxW={5} w={5} minH={5} maxH={5} h={5}>
              <Image src={walletIcon} />
            </Box>
          ) : (
            <Center
              borderRadius="full"
              p={1.5}
              bg={handleChangeColorModeValue(
                colorMode,
                'purple.50',
                'purple.700'
              )}
              color={handleChangeColorModeValue(
                colorMode,
                'purple.700',
                'purple.100'
              )}
            >
              <Icon as={IoMdWallet} />
            </Center>
          )}
          <Text fontSize={{ md: 'xl' }} fontWeight="semibold">
            {username}
          </Text>
        </Stack>
      )}
    </Stack>
  );
};

export const ConnectWalletCard = ({
  userInfo,
  addressBtn,
  connectWalletButton
}: {
  userInfo?: React.ReactNode;
  addressBtn?: React.ReactNode;
  connectWalletButton?: React.ReactNode;
}) => {
  const { colorMode } = useColorMode();
  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      borderRadius="lg"
      bg={handleChangeColorModeValue(colorMode, 'white', 'blackAlpha.400')}
      boxShadow={handleChangeColorModeValue(
        colorMode,
        '0 0 2px #dfdfdf, 0 0 6px -2px #d3d3d3',
        '0 0 2px #363636, 0 0 8px -2px #4f4f4f'
      )}
      spacing={4}
      px={8}
      py={{ base: 6, md: 12 }}
    >
      {userInfo}
      {addressBtn}
      {connectWalletButton}
    </Stack>
  );
};
