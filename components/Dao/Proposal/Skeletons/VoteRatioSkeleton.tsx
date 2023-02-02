import { Box, Flex, Progress, Skeleton, Text, Tooltip } from "@chakra-ui/react";

export const VoteRatioSkeleton = () => (
  <Box mt={5}>
    <Text fontSize={"2xl"}>Vote Status</Text>
    <Text fontSize={"sm"}>
      <Skeleton height={20} />
    </Text>
    <Text fontSize={"xl"} mt={8}>
      Ratio of Votes
    </Text>
    <Flex justifyContent={"space-around"} mt={4}>
      <Text color={"#9AE6B4"} fontSize={"small"}>
        <Skeleton height={20} />
      </Text>
      <Text color={"#90cdf4"} fontSize={"small"}>
        <Skeleton height={20} />
      </Text>
      <Text color={"#FEB2B2"} fontSize={"small"}>
        <Skeleton height={20} />
      </Text>
    </Flex>
    <Box mx={4} mt={3} position={"relative"}>
      <Skeleton>
        <Progress mx={4} mt={2} value={1} max={1} />
      </Skeleton>
      <Tooltip
        isOpen={true}
        p={2}
        hasArrow
        label="Passing threshold: 51%"
        bg="wynd.base.sidebar"
        color="white"
      >
        <Box
          height={5}
          top={-1}
          left={"calc(100% * 0.51)"}
          width={"3px"}
          bgColor={"white"}
          position={"absolute"}
        />
      </Tooltip>
    </Box>
    <Flex mt={16} justifyContent={"space-between"}>
      <Text fontSize={"xl"}>Turnout</Text>
      <Text fontSize={"xl"}>
        <Skeleton height={20} />%
      </Text>
    </Flex>
    <Box position={"relative"} mb={16}>
      <Skeleton>
        <Progress mx={4} mt={2} value={1} max={1} />
      </Skeleton>
      <Tooltip isOpen={true} p={2} hasArrow label="Quorum: 30%" bg="wynd.base.sidebar" color="white">
        <Box
          height={5}
          top={-1}
          left={"calc(100% * 0.3)"}
          width={"3px"}
          bgColor={"white"}
          position={"absolute"}
        />
      </Tooltip>
    </Box>
  </Box>
);
