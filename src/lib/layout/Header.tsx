import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import { RiDashboardFill, RiLogoutBoxLine, RiMenu5Fill } from "react-icons/ri";

import { LinkButton } from "lib/components/LinkButton";

import ThemeToggle from "./ThemeToggle";

const Header = () => {
  const isAuthenticated = false;
  const user = {
    role: "admin",
  };
  const { isOpen, onClose, onOpen } = useDisclosure();

  const logoutHandler = () => {
    onClose();
  };
  return (
    <Box as="header">
      <ThemeToggle />
      <Button
        onClick={onOpen}
        colorScheme="yellow"
        width="12"
        height="12"
        rounded="full"
        position="fixed"
        top="6"
        left="6"
      >
        <RiMenu5Fill />
      </Button>
      <Drawer placement="left" isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay backdropFilter="blur(3px)" />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">COURSE BUILDER</DrawerHeader>
          <DrawerBody>
            <VStack spacing="4" alignItems="flex-start">
              <LinkButton onClose={onClose} url="/" title="Home" />
              <LinkButton
                onClose={onClose}
                url="/courses"
                title="Browse All Courses"
              />
              <LinkButton
                onClose={onClose}
                url="/request"
                title="Request a Course"
              />
              <LinkButton onClose={onClose} url="/contact" title="Contact Us" />
              <LinkButton onClose={onClose} url="/about" title="About" />

              <HStack
                justifyContent="space-evenly"
                position="absolute"
                bottom="2rem"
                width="80%"
              >
                {isAuthenticated ? (
                  <VStack>
                    <HStack>
                      <Link onClick={onClose} href="/profile">
                        <Button variant="ghost" colorScheme="yellow">
                          Profile
                        </Button>
                      </Link>
                      <Button variant="ghost" onClick={logoutHandler}>
                        <RiLogoutBoxLine />
                        Logout
                      </Button>
                    </HStack>

                    {user && user.role === "admin" && (
                      <Link onClick={onClose} href="/admin/dashboard">
                        <Button colorScheme="purple" variant="ghost">
                          <RiDashboardFill style={{ margin: "4px" }} />
                          Dashboard
                        </Button>
                      </Link>
                    )}
                  </VStack>
                ) : (
                  <>
                    <Link onClick={onClose} href="/auth/login">
                      <Button colorScheme="yellow">Login</Button>
                    </Link>

                    <p>OR</p>

                    <Link onClick={onClose} href="/auth/register">
                      <Button colorScheme="yellow">Sign Up</Button>
                    </Link>
                  </>
                )}
              </HStack>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Header;
