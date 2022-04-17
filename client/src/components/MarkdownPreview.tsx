import React, { Fragment, useCallback, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Button, Checkbox, Code, Flex, Link, useColorModeValue } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Box, Divider, Heading, Text } from '@chakra-ui/react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Markdown } from './Markdown';

const defaultMarkdownText = `
## 😃 You don't have note for this question! Keep going! (●'◡'●) 
`;

interface MarkdownPreviewProps {
  markdown: string;
  show: boolean;
}

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ markdown, show }) => {
  return (
    <Box position="relative" w="full">
      {!show && <Flex className="absolute inset-0 backdrop-blur-sm z-10" justify="center"></Flex>}
      <Markdown text={markdown === '' ? defaultMarkdownText : markdown} />
    </Box>
  );
};

//   code: CodeComponent | ReactMarkdownNames;

//   li: LiComponent | ReactMarkdownNames;
//   ol: OrderedListComponent | ReactMarkdownNames;
//   td: TableCellComponent | ReactMarkdownNames;
//   th: TableCellComponent | ReactMarkdownNames;
//   tr: TableRowComponent | ReactMarkdownNames;
//   ul: UnorderedListComponent | ReactMarkdownNames;
