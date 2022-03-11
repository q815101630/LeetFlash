import { Button, HStack, IconButton } from "@chakra-ui/react";
import { RiEnglishInput } from "react-icons/ri";
import { RiEmphasisCn } from "react-icons/ri";
const UrlCell = ({ url }: { url: string }) => {
  return (
    <HStack>
      <IconButton
        variant="ghost"
        href={url}
        as="a"
        target="_blank"
        aria-label="go leetcode-en"
        rel="noopener noreferrer"
        icon={<RiEnglishInput size={20} />}
      >
        LeetCode-International
      </IconButton>

      <IconButton
        variant="ghost"
        href={url}
        as="a"
        target="_blank"
        aria-label="go leetcode-en"
        icon={<RiEmphasisCn size={20} />}
        rel="noopener noreferrer"
      >
        LeetCode-CN
      </IconButton>
    </HStack>
  );
};
export default UrlCell;
