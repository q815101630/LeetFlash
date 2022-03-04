import {
  Flex,
  FlexProps,
  Icon,
  Link,
  Menu,
  MenuButton,
  Text,
} from "@chakra-ui/react";
import { DisplayType } from "pages/setting";
import { IconType } from "react-icons";

interface NavItemProps extends FlexProps {
  navSize: string;
  icon: IconType;
  title: string;
  setDisplayType: (value: DisplayType) => void;
}
const NavItem = ({ navSize, icon, title, setDisplayType }: NavItemProps) => {
  const handleSetDisplayType = () => {
    if (title === "General") {
      setDisplayType(DisplayType.GENERAL);
    } else if (title === "Comments") {
      setDisplayType(DisplayType.COMMENTS);
    } else {
      setDisplayType(DisplayType.API);
    }
  };
  return (
    <Flex
      mt={30}
      direction="column"
      w="100%"
      alignItems={navSize === "small" ? "center" : "flex-start"}
    >
      <Menu placement="right">
        <Link
          p={3}
          borderRadius={8}
          _hover={{ textDecor: "none", bgColor: "#AEC8CA" }}
          w={navSize === "large" ? "100%" : "none"}
          onClick={handleSetDisplayType}
        >
          <MenuButton w="100%">
            <Flex>
              <Icon as={icon} fontSize="xl" />
              <Text ml={5} display={navSize === "small" ? "none" : "flex"}>
                {title}
              </Text>
            </Flex>
          </MenuButton>
        </Link>
      </Menu>
    </Flex>
  );
};

export default NavItem;
