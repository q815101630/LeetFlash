import { Flex, Text } from "@chakra-ui/react";
import React from "react";
import { useAppSelector } from "redux/hooks";
import { selectLang } from "redux/lang/langSlice";

interface QuestionCellProps {
  text: string;
  translateText: string;
}

const QuestionCell = ({ text, translateText }: QuestionCellProps) => {
  const lang = useAppSelector(selectLang);

  return (
    <>
      <Flex direction="column">
        <Text>
          {lang.lang === "EN"
            ? text
              ? text
              : translateText
            : translateText
            ? translateText
            : text}
        </Text>
      </Flex>
    </>
  );
};

export default QuestionCell;
