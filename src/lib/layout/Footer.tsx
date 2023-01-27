import { Box, Heading, HStack, Stack, VStack } from "@chakra-ui/react";
import { DiGithub } from "react-icons/di";
import {
  TiSocialYoutubeCircular,
  TiSocialInstagramCircular,
} from "react-icons/ti";

const Footer = () => {
  return (
    <Box padding="4" bg="blackAlpha.900" minH="10vh">
      <Stack direction={["column", "row"]}>
        <VStack alignItems={["center", "flex-start"]} width="full">
          <Heading color="white">All Rights Reserved</Heading>
          <Heading fontFamily="body" size="sm" color="yellow.400">
            @6 Pack Programmer
          </Heading>
        </VStack>

        <HStack
          spacing={["2", "10"]}
          justifyContent="center"
          color="white"
          fontSize="50"
        >
          <a href="https://youtube.com/6packprogrammer" target="blank">
            <TiSocialYoutubeCircular />
          </a>
          <a href="https://instagram.com/meabhisingh" target="blank">
            <TiSocialInstagramCircular />
          </a>
          <a href="https://github.com/meabhisingh" target="blank">
            <DiGithub />
          </a>
        </HStack>
      </Stack>
    </Box>
  );
};

export default Footer;
