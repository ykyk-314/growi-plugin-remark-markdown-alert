import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

interface GrowiNode extends Node {
  name?: string;
  type: string;
  attributes: { [key: string]: string };
  children: GrowiNode[];
  value?: string;
}

declare const growiFacade: {
  markdownRenderer?: {
    parse?: (content: string) => string;
  };
};

// 再帰的に子要素を処理して、Markdownの内容を取得
const getMarkdownContent = (node: GrowiNode): string => {
  if (node.value) {
    return node.value;
  }

  if (node.children && node.children.length > 0) {
    return node.children.map(getMarkdownContent).join('');
  }

  return ''; // valueやchildrenが存在しない場合は空文字を返す
};

export const plugin: Plugin = function() {
  return (tree) => {
    visit(tree, 'blockquote', (node: GrowiNode) => {
      console.log('node: ', JSON.parse(JSON.stringify(node)));
      if (node.children && node.children.length > 0) {
        const paragraph = node.children[0];

        console.log('paragraph: ', JSON.parse(JSON.stringify(paragraph)));

        if (paragraph.type === 'paragraph' && paragraph.children && paragraph.children.length > 0) {
          console.log('paragraph.children: ', JSON.parse(JSON.stringify(paragraph.children)));
          const textNode = paragraph.children[0];

          if (textNode.type === 'text' && textNode.value) {
            const content = textNode.value.trim();
            const match = content.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](.*)$/);
          }
        }
      }
    });
  };
};
