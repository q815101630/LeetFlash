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
  Tooltip,
  IconButton,
  Image,
  HStack,
  LightMode,
  DarkMode,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectUser } from "../redux/user/userSlice";
import { FaLanguage } from "react-icons/fa";
import { selectSettings, toggleLang } from "redux/settings/settingsSlice";
import { MdDarkMode, MdSettingsSuggest } from "react-icons/md";
import logo from "../assets/logo.png";
import { Setting } from "pages/setting";

{
  /*
<Box _hover={{ bg: 'orange.700', borderColor: 'orange.700' }} p={2} rounded="md">
<Link to="/review">Daily Review</Link>
</Box>

<Box _hover={{ bg: 'orange.700', borderColor: 'orange.700' }} p={2} rounded="md">
<Link to="/setting">Setting</Link>
</Box>
<Box _hover={{ bg: 'orange.700', borderColor: 'orange.700' }} p={2} rounded="md">
<Link to="/about">About</Link>
</Box> */
}

const links = [
  {
    name: "Dashboard",
    link: "/dashboard",
  },
  {
    name: "Daily Review",
    link: "/review",
  },
  // {
  //   name: 'Setting',
  //   link: '/setting',
  // },
  {
    name: "About",
    link: "/about",
  },
];

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleToggle = () => (isOpen ? onClose() : onOpen());
  const { toggleColorMode } = useColorMode();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const settings = useAppSelector(selectSettings);
  let navigate = useNavigate();

  const {
    isOpen: isSettingsOpen,
    onOpen: onSettingsOpen,
    onClose: onSettingsClose,
  } = useDisclosure();

  const handleClick = () => {
    if (user.status === "active") {
      navigate("/logout");
    } else {
      navigate("/login");
    }
  };
  const switchLang = () => {
    dispatch(toggleLang());
  };

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      px="1rem"
      py={2}
      bg="orange.500"
      color="white"
      pos="sticky"
      top="0"
      minH="4rem"
      zIndex={1}
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
          <HStack>
            <Image boxSize="2.2rem" borderRadius="full" src={logo} />
            <Text>LeetFlash</Text>
          </HStack>
        </Heading>
      </Flex>

      <Box display={{ base: "block", md: "none" }} onClick={handleToggle}>
        <DarkMode>
          <IconButton icon={<HamburgerIcon />} aria-label={"icon"} />
        </DarkMode>
      </Box>

      <Stack
        direction={{ base: "column", md: "row" }}
        textAlign="center"
        display={{ base: isOpen ? "block" : "none", md: "flex" }}
        width={{ base: "full", md: "auto" }}
        alignItems="center"
        flexGrow={1}
        spacing={{ base: 2, md: 5 }}
        mt={{ base: 4, md: 0 }}
        fontSize="lg"
        fontWeight="semibold"
      >
        {links.map((link, index) => (
          <Link to={link.link} key={`link=${index}`}>
            <Box
              _hover={{ bg: "orange.700", borderColor: "orange.700" }}
              p={2}
              rounded="md"
            >
              {link.name}
            </Box>
          </Link>
        ))}
      </Stack>

      <Box
        display={{ base: isOpen ? "block" : "none", md: "block" }}
        mt={{ base: 4, md: 0 }}
        w={{ base: "full", md: "auto" }}
        transition="all 0.5s"
      >
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={3}
          align="center"
        >
          <Tooltip hasArrow label="Settings" placement="auto-start">
            <IconButton
              variant="ghost"
              display={{ base: "none", lg: "inherit" }}
              _hover={{ bg: "orange.700", borderColor: "orange.700" }}
              aria-label="Settings"
              icon={<MdSettingsSuggest size={28} />}
              onClick={onSettingsOpen}
            />
          </Tooltip>
          <Tooltip
            hasArrow
            label={
              settings.lang === "EN" ? "Switch to Chinese" : "Switch to English"
            }
            placement="auto-start"
          >
            <IconButton
              variant="ghost"
              display={{ base: "none", lg: "inherit" }}
              _hover={{ bg: "orange.700", borderColor: "orange.700" }}
              aria-label="Switch language"
              icon={<FaLanguage size={28} />}
              onClick={switchLang}
            />
          </Tooltip>

          <Tooltip hasArrow label="Dark mode" placement="auto-start">
            <IconButton
              variant="ghost"
              display={{ base: "none", lg: "inherit" }}
              _hover={{ bg: "orange.700", borderColor: "orange.700" }}
              aria-label="Switch language"
              icon={<MdDarkMode size={28} />}
              onClick={toggleColorMode}
            />
          </Tooltip>

          <LightMode>
            <Button
              variant="outline"
              w={{ base: "full", md: "auto" }}
              _hover={{ bg: "orange.700", borderColor: "orange.700" }}
              onClick={handleClick}
            >
              {user.status === "active" ? "Logout" : "Login"}
            </Button>
          </LightMode>
        </Stack>
      </Box>
      <Setting
        isSettingsOpen={isSettingsOpen}
        onSettingsOpen={onSettingsOpen}
        onSettingsClose={onSettingsClose}
      />
    </Flex>
  );
};

export default Header;
