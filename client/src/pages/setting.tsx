import { Box, Flex } from "@chakra-ui/react";
import { useAppSelector } from "../redux/hooks";
import { selectUser } from "../redux/user/userSlice";
import SideBar from "../components/SideBar";
import { useState } from "react";

export const enum DisplayType {
  API,
  GENERAL,
  COMMENTS,
}
export const Setting = ({}) => {
  const user = useAppSelector(selectUser);
  const [displayType, setDisplayType] = useState<DisplayType>(DisplayType.API);
  return (
    <Flex>
      <SideBar setDisplayType={setDisplayType} />
      <Box>{displayType}</Box>
    </Flex>
  );
};
