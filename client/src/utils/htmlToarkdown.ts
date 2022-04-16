import TurndownService from 'turndown';

const turndownService = new TurndownService();
turndownService.addRule('code', {
  filter: 'pre',
  replacement: (content: string) => {
    return `\`\`\` ${content} \`\`\``;
  },
});

export const htmlToMarkdown = (html: string) => {
  console.log(html);
  return turndownService.turndown(html);
};
