import {
  Avatar,
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import { RiSecurePaymentFill } from "react-icons/ri";

import termsAndCondition from "../../assets/docs/termsAndCondition";

const Founder = () => (
  <Stack direction={["column", "row"]} spacing={["4", "16"]} padding="8">
    <VStack>
      <Avatar
        src="https://avatars.githubusercontent.com/u/25058652"
        boxSize={["40", "48"]}
      />
      <Text opacity={0.7}>Co-Founder</Text>
    </VStack>

    <VStack justifyContent="center" alignItems={["center", "flex-start"]}>
      <Heading size={["md", "xl"]}>Abhishek Singh</Heading>
      <Text textAlign={["center", "left"]}>
        Hi, I am a full-stack developer and a teacher. Our mission is to provide
        quality content at reasonable price.
      </Text>
    </VStack>
  </Stack>
);

const VideoPlayer = () => (
  <Box>
    <video
      autoPlay
      loop
      muted
      controls
      controlsList="nodownload nofullscreen noremoteplayback"
      disablePictureInPicture
      disableRemotePlayback
      src="/videos/intro.mp4"
    />
  </Box>
);

// eslint-disable-next-line @typescript-eslint/no-shadow
const TandC = ({ termsAndCondition }: { termsAndCondition: string }) => (
  <Box>
    <Heading size="md" textAlign={["center", "left"]} my="4">
      Terms & Condition
    </Heading>

    <Box h="sm" p="4" overflowY="scroll">
      <Text
        fontFamily="heading"
        letterSpacing="widest"
        textAlign={["center", "left"]}
      >
        {termsAndCondition}
      </Text>
      <Heading my="4" size="xs">
        Refund only applicable for cancellation within 7 days.
      </Heading>
    </Box>
  </Box>
);
const About = () => {
  return (
    <Container maxW="container.lg" padding="16" boxShadow="lg">
      <Heading textAlign={["center", "left"]}>About Us</Heading>
      <Founder />
      <Stack m="8" direction={["column", "row"]} alignItems="center">
        <Text fontFamily="cursive" m="8" textAlign={["center", "left"]}>
          We are a video streaming platform with some premium courses available
          only for premium users.
        </Text>

        <Link href="/subscribe">
          <Button variant="ghost" colorScheme="yellow">
            Checkout Our Plan
          </Button>
        </Link>
      </Stack>

      <VideoPlayer />

      <TandC termsAndCondition={termsAndCondition} />

      <HStack my="4" p="4">
        <RiSecurePaymentFill />
        <Heading size="xs" fontFamily="sans-serif" textTransform="uppercase">
          Payment is secured by Razorpay
        </Heading>
      </HStack>
    </Container>
  );
};

export default About;
