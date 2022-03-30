import React, { useState } from 'react';
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
} from '@chakra-ui/react';
import { Card } from '../interfaces/interfaces';
import { defaultPopoverContentProps } from 'utils';

export const QuestionTitle: React.FC<{ card: Card; lang: string }> = ({ card, lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <HStack w={350}>
      <Text>{`${card.question.question_id}.`}</Text>
      <Popover placement="right" returnFocusOnClose={false} isOpen={isOpen} onClose={close}>
        <PopoverTrigger>
          <Link
            isExternal
            href={lang === 'EN' ? card.question.url : card.question.translated_url}
            _focus={{}}
            _hover={{
              textColor: 'blue.500',
              textDecoration: 'underline',
            }}
            onMouseEnter={open}
            onMouseLeave={close}
          >
            <Text fontWeight="semibold">
              {lang === 'EN' ? card.question.title : card.question.translatedTitle}
            </Text>
          </Link>
        </PopoverTrigger>
        <PopoverContent {...defaultPopoverContentProps}>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader fontWeight="semibold">Question Prompt</PopoverHeader>
          <PopoverBody>
            {lang === 'EN' ? card.question.text : card.question.translatedText}
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </HStack>
  );
};
