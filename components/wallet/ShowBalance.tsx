import {
  Badge,
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  Icon,
  Image,
  Link,
  Stack,
  Text,
  useColorMode
} from '@chakra-ui/react';
import React from 'react';
import { MdOutlineChevronRight } from 'react-icons/md';

import { handleChangeColorModeValue } from '../../default-component';
import {
  ShowBalanceAssetsDetailsType,
  ShowBalanceAssetsTotalType
} from '../../types';

export default function ShowBalance({
  assetsDetailsData,
  assetsTotalData
}: {
  assetsDetailsData: ShowBalanceAssetsDetailsType[];
  assetsTotalData: ShowBalanceAssetsTotalType;
}) {
  const { colorMode } = useColorMode();
  return (
    <Box>
      <Heading p={8} pb={0}>
        My Assets
      </Heading>
      <Grid
        templateColumns={{
          base: 'repeat(2, 1fr)',
          md: 'repeat(4, 1fr)'
        }}
        maxW="4xl"
        gap={6}
        px={8}
        py={4}
      >
        <Box py={{ md: 2 }}>
          <Text fontWeight="semibold" opacity={0.7}>
            Total Assets
          </Text>
          <Text fontSize={{ base: '3xl', md: '4xl' }} fontWeight="extrabold">
            {assetsTotalData.total}
          </Text>
        </Box>
        <Box py={{ md: 2 }}>
          <Text fontWeight="semibold" opacity={0.7}>
            Available Assets
          </Text>
          <Text fontSize={{ base: '3xl', md: '4xl' }} fontWeight="extrabold">
            {assetsTotalData.availableAsset}
          </Text>
        </Box>
        <Box py={{ md: 2 }}>
          <Text fontWeight="semibold" opacity={0.7}>
            Bonded Assets
          </Text>
          <Text fontSize={{ base: '3xl', md: '4xl' }} fontWeight="extrabold">
            {assetsTotalData.bondedAssets}
          </Text>
        </Box>
        <Box py={{ md: 2 }}>
          <Text fontWeight="semibold" opacity={0.7}>
            Staked Assets
          </Text>
          <Text fontSize={{ base: '3xl', md: '4xl' }} fontWeight="extrabold">
            {assetsTotalData.stakedAssets}
          </Text>
        </Box>
      </Grid>
      <Box
        bg={handleChangeColorModeValue(
          colorMode,
          'blackAlpha.50',
          'whiteAlpha.50'
        )}
        p={8}
      >
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          Assets
        </Text>
        <Grid
          position="sticky"
          top={0}
          zIndex={5}
          display={{ base: 'none', lg: 'grid' }}
          templateColumns="repeat(2, minmax(12rem, 1fr)) repeat(2, minmax(6rem, 12rem))"
          columnGap={{ lg: 16 }}
          fontSize="sm"
          fontWeight="semibold"
          bg={handleChangeColorModeValue(colorMode, 'gray.100', 'gray.700')}
          color={handleChangeColorModeValue(
            colorMode,
            'blackAlpha.700',
            'whiteAlpha.700'
          )}
          borderRadius="md"
          borderBottomLeftRadius={0}
          borderBottomRightRadius={0}
          boxShadow="base"
          py={2}
          px={4}
        >
          <GridItem>Asset / Chain</GridItem>
          <GridItem textAlign="end" pr={28}>
            Balance
          </GridItem>
          <GridItem textAlign="center">IBC Deposit</GridItem>
          <GridItem textAlign="center">IBC Withdraw</GridItem>
        </Grid>
        <Stack
          borderRadius="md"
          borderTopLeftRadius={0}
          borderTopRightRadius={0}
          boxShadow={{ lg: 'base' }}
          spacing={{ base: 4, lg: 0 }}
        >
          {assetsDetailsData.map(
            (
              {
                name,
                imgSrc,
                ibc,
                tag,
                amount,
                value,
                depositLink,
                withdrawLink
              },
              i
            ) => {
              return (
                <Grid
                  key={i}
                  templateColumns={{
                    base: '1fr 1fr',
                    lg: 'repeat(2, minmax(12rem, 1fr)) repeat(2, minmax(6rem, 12rem))'
                  }}
                  columnGap={{ lg: 16 }}
                  fontWeight="semibold"
                  alignItems="center"
                  bg={{
                    base: handleChangeColorModeValue(
                      colorMode,
                      'whiteAlpha.600',
                      'blackAlpha.300'
                    ),
                    lg: handleChangeColorModeValue(
                      colorMode,
                      'whiteAlpha.300',
                      'blackAlpha.500'
                    )
                  }}
                  border={{ base: '1px solid', lg: 'none' }}
                  borderColor={handleChangeColorModeValue(
                    colorMode,
                    'blackAlpha.200',
                    'whiteAlpha.200'
                  )}
                  borderRadius={{ base: 'lg', lg: 'none' }}
                  _odd={{
                    bg: {
                      lg: handleChangeColorModeValue(
                        colorMode,
                        'whiteAlpha.600',
                        'blackAlpha.300'
                      )
                    }
                  }}
                  _notLast={{
                    borderBottom: '1px solid',
                    borderBottomColor: handleChangeColorModeValue(
                      colorMode,
                      'blackAlpha.200',
                      'whiteAlpha.200'
                    )
                  }}
                  p={4}
                >
                  <GridItem colSpan={{ base: 2, md: 1 }}>
                    <Flex
                      justify={{ base: 'center', md: 'start' }}
                      align="center"
                    >
                      <Box
                        w={{ base: 14, lg: 16 }}
                        h={{ base: 14, lg: 16 }}
                        minW={{ base: 14, lg: 16 }}
                        minH={{ base: 14, lg: 16 }}
                        maxW={{ base: 14, lg: 16 }}
                        maxH={{ base: 14, lg: 16 }}
                        bg={handleChangeColorModeValue(
                          colorMode,
                          'whiteAlpha.500',
                          'whiteAlpha.50'
                        )}
                        border="1px solid"
                        borderColor={handleChangeColorModeValue(
                          colorMode,
                          'blackAlpha.100',
                          'whiteAlpha.100'
                        )}
                        borderRadius="full"
                        mr={4}
                      >
                        <Image src={imgSrc} />
                      </Box>
                      <Text fontSize="lg" mr={4}>
                        {name}
                      </Text>
                      <Badge
                        bg={handleChangeColorModeValue(
                          colorMode,
                          'primary.600',
                          'primary.400'
                        )}
                        color="white"
                        borderRadius="full"
                        px={2}
                      >
                        {tag}
                      </Badge>
                    </Flex>
                  </GridItem>
                  <GridItem
                    colSpan={{ base: 2, md: 1 }}
                    display="flex"
                    alignItems={{ base: 'center', md: 'end' }}
                    py={{ base: 2, md: 0 }}
                    pr={{ base: 4, lg: 28 }}
                    pl={{ base: 4, lg: 0 }}
                  >
                    <Text display={{ base: 'block', md: 'none' }}>Balance</Text>
                    <Box w="full" textAlign="end">
                      <Text fontSize="lg" mb={0.5}>
                        {amount}
                      </Text>
                      <Text fontSize="lg" opacity={0.7}>
                        {value}
                      </Text>
                    </Box>
                  </GridItem>
                  {ibc && Object.keys(ibc).length > 0 ? (
                    <Link
                      href={depositLink}
                      fontSize={{ base: 'sm', md: 'md' }}
                      color={handleChangeColorModeValue(
                        colorMode,
                        'primary.500',
                        'primary.300'
                      )}
                    >
                      <GridItem
                        borderTop={{ base: '1px solid', lg: 'none' }}
                        borderRight={{ base: '1px solid', lg: 'none' }}
                        borderColor={handleChangeColorModeValue(
                          colorMode,
                          'blackAlpha.100',
                          'whiteAlpha.300'
                        )}
                        ml={{ base: -4, lg: 'inherit' }}
                        mt={{ base: 4, lg: 0 }}
                        mb={{ base: -4, lg: 'inherit' }}
                        py={3}
                      >
                        <Flex justify="center" align="center">
                          <Text>Deposit</Text>
                          <Icon as={MdOutlineChevronRight} />
                        </Flex>
                      </GridItem>
                    </Link>
                  ) : (
                    <GridItem></GridItem>
                  )}
                  {ibc && Object.keys(ibc).length > 0 ? (
                    <Link
                      href={withdrawLink}
                      fontSize={{ base: 'sm', md: 'md' }}
                      color={handleChangeColorModeValue(
                        colorMode,
                        'primary.500',
                        'primary.300'
                      )}
                    >
                      <GridItem
                        borderTop={{ base: '1px solid', lg: 'none' }}
                        borderColor={handleChangeColorModeValue(
                          colorMode,
                          'blackAlpha.100',
                          'whiteAlpha.300'
                        )}
                        mr={{ base: -4, lg: 'inherit' }}
                        mt={{ base: 4, lg: 0 }}
                        mb={{ base: -4, lg: 'inherit' }}
                        py={{ base: 3, lg: 0 }}
                      >
                        <Flex justify="center" align="center">
                          <Text>Withdraw</Text>
                          <Icon as={MdOutlineChevronRight} />
                        </Flex>
                      </GridItem>
                    </Link>
                  ) : (
                    <GridItem></GridItem>
                  )}
                </Grid>
              );
            }
          )}
        </Stack>
      </Box>
    </Box>
  );
}
