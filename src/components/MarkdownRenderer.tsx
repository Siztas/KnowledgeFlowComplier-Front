"use client";

import { Box, Heading, Link, ListItem, OrderedList, Text, UnorderedList, Code, Divider } from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

// 组件属性接口
interface MarkdownRendererProps {
  content: string;
  color?: string;
  fontSize?: string | object;
  lineHeight?: string;
}

/**
 * Markdown渲染器组件
 * 支持Markdown格式和数学公式渲染
 */
const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  color = "whiteAlpha.900",
  fontSize = { base: "md", md: "lg" },
  lineHeight = "tall"
}) => {
  // 自动为纯文本内容添加段落格式
  const preprocessContent = (text: string) => {
    // 检查内容中是否已有Markdown格式，如果有则不做处理
    const hasMarkdownSyntax = /[#*`_~\[\]()>-]/.test(text);
    if (hasMarkdownSyntax) return text;
    
    // 处理换行符，将单个换行转换为空格，连续两个换行转换为段落分隔
    return text
      .replace(/\r\n/g, '\n') // 统一所有换行符
      .replace(/\n{2,}/g, '\n\n') // 将多个连续换行压缩为两个
      .replace(/\n\n/g, '\n\n') // 段落之间保留两个换行
      .replace(/(?<!\n)\n(?!\n)/g, ' '); // 段落内单个换行转为空格
  };
  
  // 处理后的内容
  const processedContent = preprocessContent(content);

  // 自定义渲染组件
  const components = {
    h1: (props: any) => <Heading as="h1" size="xl" mt={8} mb={4} color={color} {...props} />,
    h2: (props: any) => <Heading as="h2" size="lg" mt={6} mb={3} color={color} {...props} />,
    h3: (props: any) => <Heading as="h3" size="md" mt={5} mb={2} color={color} {...props} />,
    h4: (props: any) => <Heading as="h4" size="sm" mt={4} mb={2} color={color} {...props} />,
    p: (props: any) => <Text mb={4} color={color} fontSize={fontSize} lineHeight={lineHeight} {...props} />,
    a: (props: any) => <Link color="brand.300" isExternal {...props} />,
    ul: (props: any) => <UnorderedList mb={4} spacing={1} pl={2} {...props} />,
    ol: (props: any) => <OrderedList mb={4} spacing={1} pl={2} {...props} />,
    li: (props: any) => <ListItem color={color} fontSize={fontSize} {...props} />,
    code: (props: any) => {
      const { inline, children, ...rest } = props;
      return inline ? (
        <Code colorScheme="brand" fontSize="0.9em" {...rest}>
          {children}
        </Code>
      ) : (
        <Box
          as="pre"
          p={4}
          mb={4}
          borderRadius="md"
          bg="gray.800"
          overflowX="auto"
          fontSize="0.9em"
          {...rest}
        >
          {children}
        </Box>
      );
    },
    hr: () => <Divider my={4} borderColor="whiteAlpha.300" />,
    blockquote: (props: any) => (
      <Box
        as="blockquote"
        pl={4}
        borderLeftWidth="4px"
        borderLeftColor="brand.400"
        mb={4}
        color={`${color.split('.')[0]}.700`}
        fontStyle="italic"
        {...props}
      />
    ),
    img: (props: any) => (
      <img
        {...props}
        style={{
          maxWidth: '100%',
          maxHeight: '400px',
          borderRadius: '4px',
          display: 'block',
          margin: '1rem auto',
        }}
      />
    ),
  };

  return (
    <Box className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeRaw, rehypeKatex]}
        components={components}
      >
        {processedContent}
      </ReactMarkdown>
    </Box>
  );
};

export default MarkdownRenderer; 