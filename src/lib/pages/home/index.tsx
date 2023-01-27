import {
  Box,
  Button,
  Heading,
  HStack,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { NextSeo } from "next-seo";
import Image from "next/legacy/image";
import Link from "next/link";
import { CgGoogle, CgYoutube } from "react-icons/cg";
import { DiAws } from "react-icons/di";
import { SiCoursera, SiUdemy } from "react-icons/si";

import styles from "./home.module.css";

const Home = () => {
  return (
    <section className="home">
      <NextSeo title="Home" />
      <div className={styles.container}>
        <Stack
          direction={["column", "row"]}
          height="100%"
          justifyContent={["center", "space-between"]}
          alignItems="center"
          spacing={["16", "56"]}
        >
          <VStack width="full" alignItems={["center", "flex-end"]} spacing="8">
            <Heading size="2xl">LEARN FROM THE EXPERTS</Heading>
            <Text
              fontSize="2xl"
              fontFamily="cursive"
              textAlign={["center", "left"]}
            >
              Find Valuable Content At Reasonable Price
            </Text>
            <Link href="/courses">
              <Button size="lg" colorScheme="yellow">
                Explore Now
              </Button>
            </Link>
          </VStack>

          <Box
            className={styles.vectorGraphics}
            boxSize="md"
            position="relative"
          >
            <Image
              alt="CoderPhoto"
              src="/images/bg.png"
              layout="fill"
              objectFit="contain"
            />
          </Box>
        </Stack>
      </div>

      <Box padding="8" bg="blackAlpha.800">
        <Heading textAlign="center" fontFamily="body" color="yellow.400">
          OUR BRANDS
        </Heading>
        <HStack
          className={styles.brandsBanner}
          justifyContent="space-evenly"
          marginTop="4"
        >
          <CgGoogle />
          <CgYoutube />
          <SiCoursera />
          <SiUdemy />
          <DiAws />
        </HStack>
      </Box>

      <div className={styles.container2}>
        <video
          controls
          controlsList="nodownload nofullscreen noremoteplayback"
          disablePictureInPicture
          disableRemotePlayback
          src="videos/intro.mp4"
        >
          <track kind="captions" />
        </video>
      </div>
    </section>
  );
};

export default Home;
