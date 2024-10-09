import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

interface GrowiNode extends Node {
  name?: string;
  type: string;
  attributes?: { [key: string]: string };
  children?: GrowiNode[];
  value?: string;
}

declare const growiFacade: {
  markdownRenderer?: {
    parse?: (content: string) => string;
  };
};

export const plugin: Plugin = function () {
  return (tree) => {
    visit(tree, 'blockquote', (node: GrowiNode) => {
      // 子要素がある場合の処理
      if (node.children && node.children.length > 0) {
        const paragraph = node.children[0];

        if (paragraph.type === 'paragraph' && paragraph.children && paragraph.children.length > 0) {
          const textNode = paragraph.children[0];

          // アラート記法を検出
          if (textNode.type === 'text' && textNode.value) {
            const content = textNode.value.trim();
            const match = content.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](.*)$/);

            if (match) {
              const alertType = match[1].toLowerCase(); // NOTE, TIP, WARNINGなどのアラートタイプ

              // 残りのコンテンツを取得（最初のアラート記法以降）
              const remainingNodes = node.children.slice(1);

              // 残りのコンテンツをMarkdownとして再構成して、HTMLに変換
              const markdownContent = remainingNodes.map(child => {
                if (child.value) {
                  return child.value; // テキストノード
                }
                if (child.children) {
                  return child.children.map(subChild => subChild.value || '').join(''); // 子要素を連結
                }
                return '';
              }).join('\n');

              let renderedContent = '';
              if (growiFacade.markdownRenderer && growiFacade.markdownRenderer.parse) {
                // MarkdownをHTMLに変換
                renderedContent = growiFacade.markdownRenderer.parse(markdownContent);
              }
              else {
                renderedContent = markdownContent; // フォールバックとしてMarkdownをそのまま使用
              }

              // アラート記法のカスタムHTMLを生成し、残りのコンテンツを含む
              node.type = 'html';
              node.value = `
                <div class="callout callout-${alertType}">
                  ${renderedContent}
                </div>
              `;

              // 子要素をクリア
              node.children = [];
            }
          }
        }
      }
    });
  };
};
