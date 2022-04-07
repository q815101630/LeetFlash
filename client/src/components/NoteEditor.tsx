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
import { Markdown } from './Markdown';

export const MarkdownEditor = () => {
  const [markdownText, setMarkdownText] = React.useState<string>(`
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

`);

  return (
    <Box>
      <Markdown text={markdownText} />
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
