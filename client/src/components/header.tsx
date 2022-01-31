import React from "react";
import {
  Box,
  Stack,
  Heading,
  Flex,
  useColorMode,
  Text,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import { selectUser } from "../redux/user/userSlice";

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleToggle = () => (isOpen ? onClose() : onOpen());
  const { toggleColorMode } = useColorMode();

  const user = useAppSelector(selectUser);
  let navigate = useNavigate();
  const handleClick = () => {
    if (user.status === "active") {
      navigate("/logout");
    } else {
      navigate("/login");
    }
  };
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding={3}
      bg="orange.500"
      color="white"
    >
      <Flex align="center" mr={5}>
        <Heading
          as="button"
          size="lg"
          letterSpacing={"tighter"}
          onClick={() => {
            navigate("/");
          }}
        >
          LeetFlash
        </Heading>
      </Flex>

      <Box display={{ base: "block", md: "none" }} onClick={handleToggle}>
        <HamburgerIcon />
      </Box>

      <Stack
        direction={{ base: "column", md: "row" }}
        display={{ base: isOpen ? "block" : "none", md: "flex" }}
        width={{ base: "full", md: "auto" }}
        alignItems="center"
        flexGrow={1}
        spacing={{ base: 2, md: 5 }}
        mt={{ base: 4, md: 0 }}
      >
        <Box
          _hover={{ bg: "orange.700", borderColor: "orange.700" }}
          p={2}
          rounded="md"
        >
          <Link to="/dashboard">Dashboard</Link>
        </Box>
        <Box
          _hover={{ bg: "orange.700", borderColor: "orange.700" }}
          p={2}
          rounded="md"
        >
          <Link to="/tutorial">Tutorial</Link>
        </Box>
        <Box
          _hover={{ bg: "orange.700", borderColor: "orange.700" }}
          p={2}
          rounded="md"
        >
          <Link to="/about">About</Link>
        </Box>
      </Stack>

      <Box
        display={{ base: isOpen ? "block" : "none", md: "block" }}
        mt={{ base: 4, md: 0 }}
      >
        <Stack direction={{ base: "column", md: "row" }}>
          <Button
            variant="outline"
            _hover={{ bg: "orange.700", borderColor: "orange.700" }}
            onClick={toggleColorMode}
          >
            Change color
          </Button>

          <Button
            variant="outline"
            _hover={{ bg: "orange.700", borderColor: "orange.700" }}
            onClick={handleClick}
          >
            {user.status === "active" ? "Logout" : "Login"}
          </Button>
        </Stack>
      </Box>
    </Flex>
  );
};

export default Header;
