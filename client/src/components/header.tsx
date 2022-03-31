import React from 'react';
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
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectUser } from '../redux/user/userSlice';
import { FaLanguage } from 'react-icons/fa';
import { selectSettings, toggleLang } from 'redux/settings/settingsSlice';
import { MdDarkMode } from 'react-icons/md';

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleToggle = () => (isOpen ? onClose() : onOpen());
  const { toggleColorMode } = useColorMode();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const settings = useAppSelector(selectSettings);
  let navigate = useNavigate();
  const handleClick = () => {
    if (user.status === 'active') {
      navigate('/logout');
    } else {
      navigate('/login');
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
      px={3}
      py={2}
      bg="orange.500"
      color="white"
      pos="sticky"
      top="0"
      zIndex={1}
    >
      <Flex align="center" mr={5}>
        <Heading
          as="button"
          size="lg"
          letterSpacing={'tighter'}
          onClick={() => {
            navigate('/');
          }}
        >
          LeetFlash
        </Heading>
      </Flex>

      <Box display={{ base: 'block', md: 'none' }} onClick={handleToggle}>
        <HamburgerIcon />
      </Box>

      <Stack
        direction={{ base: 'column', md: 'row' }}
        display={{ base: isOpen ? 'block' : 'none', md: 'flex' }}
        width={{ base: 'full', md: 'auto' }}
        alignItems="center"
        flexGrow={1}
        spacing={{ base: 2, md: 5 }}
        mt={{ base: 4, md: 0 }}
      >
        <Box _hover={{ bg: 'orange.700', borderColor: 'orange.700' }} p={2} rounded="md">
          <Link to="/dashboard">Dashboard</Link>
        </Box>
        <Box _hover={{ bg: 'orange.700', borderColor: 'orange.700' }} p={2} rounded="md">
          <Link to="/review">Daily Review</Link>
        </Box>

        <Box _hover={{ bg: 'orange.700', borderColor: 'orange.700' }} p={2} rounded="md">
          <Link to="/setting">Setting</Link>
        </Box>
        <Box _hover={{ bg: 'orange.700', borderColor: 'orange.700' }} p={2} rounded="md">
          <Link to="/about">About</Link>
        </Box>
      </Stack>

      <Box display={{ base: isOpen ? 'block' : 'none', md: 'block' }} mt={{ base: 4, md: 0 }}>
        <Stack direction={{ base: 'column', md: 'row' }} spacing={3}>
          <Tooltip
            hasArrow
            label={settings.lang === 'EN' ? 'Switch to Chinese' : 'Switch to English'}
            placement="auto-start"
          >
            <IconButton
              variant="ghost"
              _hover={{ bg: 'orange.700', borderColor: 'orange.700' }}
              aria-label="Switch language"
              icon={<FaLanguage size={28} />}
              onClick={switchLang}
            />
          </Tooltip>

          <Tooltip hasArrow label="Dark mode" placement="auto-start">
            <IconButton
              variant="ghost"
              _hover={{ bg: 'orange.700', borderColor: 'orange.700' }}
              aria-label="Switch language"
              icon={<MdDarkMode size={28} />}
              onClick={toggleColorMode}
            />
          </Tooltip>

          <Button
            variant="outline"
            _hover={{ bg: 'orange.700', borderColor: 'orange.700' }}
            onClick={handleClick}
          >
            {user.status === 'active' ? 'Logout' : 'Login'}
          </Button>
        </Stack>
      </Box>
    </Flex>
  );
};

export default Header;
