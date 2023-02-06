import React, { useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Checkbox, Code, Link, useColorModeValue } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Box, Divider, Heading, Text } from '@chakra-ui/react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export const Markdown: React.FC<{ text: string }> = ({ text }) => {
  const codeColor = useColorModeValue('#171923', '#F7FAFC');
  const codeBlockBg = useColorModeValue('gray.100', 'gray.800');
  const blockquoteColor = useColorModeValue('gray.400', 'gray.500');

  let textHack = text.replaceAll("```", "").replaceAll("**Output", "\n**Output").replaceAll("**Explanation", "\n**Explanation");
  textHack = textHack.replaceAll("**输入：**", "\n**输入**：").replaceAll("**输出：**", "\n**输出**：").replaceAll("**解释：**", "\n**解释**：");

  return (
    <Box px={3} py={2}>
      <ReactMarkdown
        children={textHack}
        sourcePos
        linkTarget={'_blank'}
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        transformLinkUri={(href, children, title) => {
          return title || '';
        }}
        components={{
          h1: (props) => {
            const { children, node, className } = props;
            return (
              <Box py={2}>
                <Heading as="h1" pb={2}>
                  {children}
                </Heading>
                <Divider />
              </Box>
            );
          },
          h2: (props) => {
            const { children } = props;
            return (
              <Box py={2}>
                <Heading as="h2" size="lg" pb={2}>
                  {children}
                </Heading>
                <Divider />
              </Box>
            );
          },
          h3: (props) => {
            const { children } = props;
            return (
              <Box py={2}>
                <Heading as="h3" size="md" pb={2}>
                  {children}
                </Heading>
                <Divider />
              </Box>
            );
          },
          h4: (props) => {
            const { children } = props;
            return (
              <Box py={2}>
                <Heading as="h4" size="sm" pb={2}>
                  {children}
                </Heading>
                <Divider />
              </Box>
            );
          },
          h5: (props) => {
            const { children } = props;
            return (
              <Box py={2}>
                <Heading as="h5" size="xs" pb={2}>
                  {children}
                </Heading>
                <Divider />
              </Box>
            );
          },
          h6: (props) => {
            const { children } = props;
            return (
              <Box py={2}>
                <Heading as="h6" size="xs" pb={2}>
                  {children}
                </Heading>
                <Divider />
              </Box>
            );
          },
          p: (props) => {
            const { children } = props;
            return <Text>{children}</Text>;
          },
          a: (props) => {
            const { children, href } = props;
            return (
              <Link color="orange.400" href={href} target="_blank">
                {children}
              </Link>
            );
          },
          code: (props) => {
            const { children, inline, className } = props;
            const language = className?.slice(9);

            return (
              <React.Fragment>
                {inline ? (
                  <Code>{children}</Code>
                ) : (
                  <SyntaxHighlighter
                    language={language}
                    style={docco}
                    customStyle={{
                      color: codeColor,
                      fontSize: '0.9rem',
                    }}
                  >
                    {children}
                  </SyntaxHighlighter>
                )}
              </React.Fragment>
            );
          },
          pre: (props) => {
            const { children, node } = props;
            console.log(children);
            return (
              <Box as="pre" w="full" bg={codeBlockBg} p={3}>
                {children}
              </Box>
            );
          },
          ul: (props) => {
            const { children } = props;
            return (
              <Box className="list-inside list-disc" as="ul" py={2}>
                {children}
              </Box>
            );
          },
          ol: (props) => {
            const { children } = props;
            return (
              <Box className="list-decimal indent-2 pl-4" as="ol" py={2}>
                {children}
              </Box>
            );
          },
          input: (props) => {
            const { children, node, checked } = props;

            return (
              <Checkbox isChecked={checked} pt={1} pr={1}>
                {children}
              </Checkbox>
            );
          },
          blockquote: (props) => {
            const { children } = props;
            return (
              <Box
                as="blockquote"
                my={2}
                p={3}
                borderLeftWidth={3}
                borderLeftColor={blockquoteColor}
              >
                {children}
              </Box>
            );
          }
        }}
      />
    </Box>
  );
};
