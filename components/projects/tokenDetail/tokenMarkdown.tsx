import React from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

type MarkdownRendererProps = {
  markdown: string | null; 
};

const TokenMarkdown: React.FC<MarkdownRendererProps> = ({ markdown }) => {
  return (
    <ReactMarkdown
      children={markdown}
      remarkPlugins={[gfm]}
      rehypePlugins={[rehypeRaw]}
      className="prose" // Tailwind CSS typography plugin class
    />
  );
};

export default TokenMarkdown;