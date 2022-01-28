import React from "react";
import {
  Box,
  Stack,
  Heading,
  Flex,
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
        spacing={{ base: 2, md: 10 }}
        mt={{ base: 4, md: 0 }}
      >
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/tutorial">Tutorial</Link>
        <Link to="/about">About</Link>
      </Stack>

      <Box
        display={{ base: isOpen ? "block" : "none", md: "block" }}
        mt={{ base: 4, md: 0 }}
      >
        <Button
          variant="outline"
          _hover={{ bg: "orange.700", borderColor: "orange.700" }}
          onClick={handleClick}
        >
          {user.status === "active" ? "Logout" : "Login"}
        </Button>
      </Box>
    </Flex>
  );
};

export default Header;
