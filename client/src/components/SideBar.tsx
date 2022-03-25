import React from "react";
import {
  Avatar,
  Divider,
  Flex,
  Heading,
  IconButton,
  Text,
  useColorModeValue,
  Box,
} from "@chakra-ui/react";
import { DisplayType } from "pages/setting";
import { useState } from "react";
import { FiInfo, FiKey, FiMessageCircle } from "react-icons/fi";
import { GiHamburgerMenu } from "react-icons/gi";
import { useAppSelector } from "redux/hooks";
import { selectUser } from "redux/user/userSlice";
import NavItem from "./NavItem";
const SideBar = ({
  setDisplayType,
}: {
  setDisplayType: (value: DisplayType) => void;
}) => {
  const [navSize, setNavSize] = useState<string>("large");
  const bg = useColorModeValue("white", "gray.700");
  const user = useAppSelector(selectUser);
  const sidebarWidth = navSize === "small" ? "75px" : "200px";
  const boxWidth = navSize === "small" ? "30px" : "35px";


  return (
    <React.Fragment>
      <Flex
        pos="sticky"
        left="5"
        h="90vh"
        filter="drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1))"
        bg={bg}
        w={sidebarWidth}
        borderRadius={navSize === "small" ? "15px" : "30px"}
        direction="column"
        justifyContent="space-between"
        transition="all 0.3s"
      >
        <Flex
          p="5%"
          direction="column"
          alignItems="flex-start"
          as="nav"
          align="center"
        >
          <IconButton
            w="100%"
            background="none"
            mt={5}
            _hover={{ background: "none" }}
            icon={<GiHamburgerMenu />}
            aria-label="Menu"
            onClick={() => {
              navSize === "large" ? setNavSize("small") : setNavSize("large");
            }}
          />
          <NavItem
            navSize={navSize}
            icon={FiKey}
            title="API Token"
            setDisplayType={setDisplayType}
          />
          <NavItem
            navSize={navSize}
            icon={FiInfo}
            title="General"
            setDisplayType={setDisplayType}
          />
          <NavItem
            navSize={navSize}
            icon={FiMessageCircle}
            title="Comments"
            setDisplayType={setDisplayType}
          />
        </Flex>
        <Flex
          p="5%"
          direction="column"
          w="100%"
          alignItems={navSize === "small" ? "center" : "flex-start"}
          mb={4}
        >
          <Divider display={navSize === "small" ? "none" : "flex"} />
          <Flex mt={4} align="center">
            <Avatar size="sm" />
            <Flex
              direction="column"
              maxW="130px"
              ml={4}
              display={navSize === "small" ? "none" : "flex"}
            >
              <Heading as="h3" size="s">
                {user.email}
              </Heading>
              <Text>{user.status}</Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <Box h="90vh" w={boxWidth}></Box>
    </React.Fragment>
  );
};

export default SideBar;
