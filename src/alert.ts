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
      if (node.children && node.children.length > 0) {
        const paragraph = node.children[0];

        if (paragraph.type === 'paragraph' && paragraph.children && paragraph.children.length > 0) {
          const textNode = paragraph.children[0];

          if (textNode.type === 'text' && textNode.value) {
            const content = textNode.value.trim();
            const match = content.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](.*)$/);

            if (match) {
              const alertType = match[1].toLowerCase(); // NOTE, TIP, WARNING など

              // アラート記法タグを削除した後の残りのMarkdownコンテンツを取得
              const remainingContent = paragraph.children.slice(1);

              // 残りのコンテンツを再帰的に取得
              const markdownContent = remainingContent.map(getMarkdownContent).join('\n');

              // GrowiのmarkdownRendererを使って残りのコンテンツを再パース
              let renderedContent = '';
              if (growiFacade.markdownRenderer && growiFacade.markdownRenderer.parse) {
                renderedContent = growiFacade.markdownRenderer.parse(markdownContent);
              }
              else {
                renderedContent = markdownContent; // フォールバックとして元のMarkdownを返す
              }

              // アラート記法用のカスタムHTMLを生成
              const alertHTML = `
                <div class="callout callout-${alertType}">
                  ${renderedContent}
                </div>
              `;

              // アラート部分をカスタマイズしてHTMLに変換
              node.type = 'html';
              node.value = alertHTML;

              // 子要素をクリア
              node.children = [];
            }
          }
        }
      }
    });
  };
};
