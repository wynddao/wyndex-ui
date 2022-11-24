import { Box, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import { ConnectedUserCardType } from '../../types';

export const ConnectedUserCard = ({
  username,
  icon
}: ConnectedUserCardType) => {
  return (
    <Stack
      isInline={true}
      spacing={2}
      justifyContent="center"
      alignItems="center"
      borderRadius="lg"
      bg={useColorModeValue('whiteAlpha.100', 'blackAlpha.100')}
      boxShadow={useColorModeValue(
        'inset 0 0 12px -5px #d3d3d3',
        'inset 0 0 14px -7px #828282'
      )}
      w="full"
      minW="fit-content"
      p={2}
    >
      <Box
        display={icon ? 'block' : 'none'}
        minW={12}
        maxW={12}
        w={12}
        minH={12}
        maxH={12}
        h={12}
        borderRadius="full"
        overflow="hidden"
      >
        {icon}
      </Box>
      <Text fontSize={{ lg: 'lg' }} fontWeight="semibold">
        {username}
      </Text>
    </Stack>
  );
};
