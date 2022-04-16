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

const markdownText = `
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6
A paragraph with *emphasis* and **strong importance** $f(x) = 1$.

> A block quote with ~strikethrough~ and a URL: https://reactjs.org.

* Lists
* [ ] todo
* [x] done

1. This is an ordered list
2. Some content
3. More content

This is a inline code \`ReactiveEffect\`.

### This is a block code
\`\`\`python
**const** foo = 'bar';

class ReactiveEffect {
  private _fn: any;

  constructor(fn) {
    this._fn = fn;
  }

  run() {
    activeEffect = this;
    const res = this._fn();
    activeEffect = null;

    return res;
  }
}
\`\`\`

$$
f(x) = \\int_0^x \\sqrt{1-x^2} d x
$$

This is a inline code \`ReactiveEffect\`.

### This is a block code
\`\`\`python
const foo = 'bar';

class ReactiveEffect {
  private _fn: any;

  constructor(fn) {
    this._fn = fn;
  }

  run() {
    activeEffect = this;
    const res = this._fn();
    activeEffect = null;

    return res;
  }
}
\`\`\`

$$
f(x) = \\int_0^x \\sqrt{1-x^2} d x
$$

`;

interface MarkdownPreviewProps {
  markdown: string;
  show: boolean;
}

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ markdown, show }) => {
  return (
    <Box position="relative" w="full">
      {!show && <Flex className="absolute inset-0 backdrop-blur-sm z-10" justify="center"></Flex>}
      <Markdown text={markdown === '' ? markdownText : markdown} />
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
