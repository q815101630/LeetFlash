import {
  Avatar,
  Divider,
  Flex,
  Heading,
  IconButton,
  Text,
} from "@chakra-ui/react";
import { DisplayType } from "pages/setting";
import { useState } from "react";
import { FiInfo, FiKey, FiMessageCircle } from "react-icons/fi";
import { GiHamburgerMenu } from "react-icons/gi";
import NavItem from "./NavItem";
const SideBar = ({
  setDisplayType,
}: {
  setDisplayType: (value: DisplayType) => void;
}) => {
  const [navSize, setNavSize] = useState<string>("large");
  return (
    <Flex
      pos="sticky"
      left="5"
      h="90vh"
      mt="2.5vh"
      boxShadow="0px 4px 12px 0 rgba(0, 0, 0, 0.05)"
      w={navSize === "small" ? "75px" : "200px"}
      borderRadius={navSize === "small" ? "15px" : "30px"}
      direction="column"
      justifyContent="space-between"
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
        <NavItem navSize={navSize} icon={FiKey} title="API Token" setDisplayType={setDisplayType} />
        <NavItem navSize={navSize} icon={FiInfo} title="General" setDisplayType={setDisplayType}/>
        <NavItem navSize={navSize} icon={FiMessageCircle} title="Comments" setDisplayType={setDisplayType}/>
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
              q8151@qq.com
            </Heading>
            <Text>User</Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default SideBar;
