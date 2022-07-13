import React, { useState } from "react";
import {
  HStack,
  Link,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
} from "@chakra-ui/react";
import { Card } from "../interfaces/interfaces";
import { defaultPopoverContentProps } from "utils";
import { MarkdownPreview } from "./MarkdownPreview";
import { htmlToMarkdown } from "utils/htmlToarkdown";

export const QuestionTitle: React.FC<{ card: Card; lang: string }> = ({
  card,
  lang,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <HStack w={350}>
      <Text>{`${card.question.questionId}.`}</Text>
      <Popover
        placement="right"
        returnFocusOnClose={false}
        isOpen={isOpen}
        onClose={close}
      >
        <PopoverTrigger>
          <Link
            isExternal
            href={
              lang === "EN" ? card.question.url : card.question.translatedUrl
            }
            _focus={{}}
            _hover={{
              textColor: "blue.500",
              textDecoration: "underline",
            }}
            onMouseEnter={open}
            onMouseLeave={close}
          >
            <Text fontWeight="semibold" as={card.is_archived ? "del" : "p"}>
              {lang === "EN"
                ? card.question.title
                : card.question.translatedTitle}
            </Text>
          </Link>
        </PopoverTrigger>
        <PopoverContent
          {...defaultPopoverContentProps}
          display={isOpen ? "block" : "none"}
          minW={"50rem"}
          maxH={"50rem"}
          overflow="hidden"
        >
          <PopoverArrow />
          <PopoverHeader fontWeight="semibold">Question Prompt</PopoverHeader>
          <PopoverBody>
            <MarkdownPreview
              show={true}
              markdown={htmlToMarkdown(
                lang === "EN"
                  ? card.question.content
                  : card.question.translatedContent || ""
              )}
            />
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </HStack>
  );
};
