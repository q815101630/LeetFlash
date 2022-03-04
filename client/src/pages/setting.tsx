import { Box, Center, Flex, Text } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { generateApiTokenAsync, selectUser } from "../redux/user/userSlice";
import SideBar from "../components/SideBar";
import { useEffect, useState } from "react";

export const enum DisplayType {
  API,
  GENERAL,
  COMMENTS,
}

const TokenSettingContent = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user.token === "invalid") {
      dispatch(generateApiTokenAsync());
    }
  }, [user.token]);
  return (
    <Center h="100%" w="100%">
      <Flex direction="column">
        <Text> Your API Token is </Text>
        <Text> {user.token}</Text>
      </Flex>
    </Center>
  );
};

export const Setting = ({}) => {
  const user = useAppSelector(selectUser);
  const [displayType, setDisplayType] = useState<DisplayType>(DisplayType.API);
  return (
    <Flex>
      <SideBar setDisplayType={setDisplayType} />
      <Box h="90vh" mt="2.5vh" mx="2.5vh" w="100%">
        {displayType === DisplayType.API && <TokenSettingContent />}
      </Box>
    </Flex>
  );
};
