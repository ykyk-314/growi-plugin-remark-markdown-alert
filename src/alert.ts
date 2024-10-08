import { toMarkdown } from 'mdast-util-to-markdown';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import { is } from 'unist-util-is';
import { Root, RootContent } from 'mdast'; // これでmdastの型を使用


interface GrowiNode extends Node {
  name?: string;
  type: string;
  attributes: {[key: string]: string}
  children: GrowiNode[];
  value?: string;
}

declare const growiFacade: {
  markdownRenderer?: {
    parse?: (content: string) => string;
  };
};

export const plugin: Plugin = function() {
  return (tree) => {
    visit(tree, 'blockquote', (node: GrowiNode) => {
      if (node.children && node.children.length > 0) {
        // 最初の子要素であるparagraphを取得
        const paragraph = node.children[0];

        if (paragraph.type === 'paragraph' && paragraph.children && paragraph.children.length > 0) {
          console.log(JSON.parse(JSON.stringify(node)));
          return;
          // paragraph内の最初のテキスト要素
          const textNode = paragraph.children[0];
          if (textNode.type === 'text' && textNode.value) {
            const content = textNode.value.trim();
            const match = content.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](.*)$/);

            if (match) {
              console.log(content);
              console.log(match);
              // アラート記法タグの取得
              const alertType = match[1].toLowerCase();

              // アラート記法タグを除いた残りの子要素を保持
              const remainingContent = paragraph.children.slice(1);

              // 残りのMarkdownコンテンツを再度Markdownとして解析
              // mdast-util-to-markdown を使って残りのノードをMarkdownに変換
              const markdownContent = toMarkdown({
                type: 'root',
                children: remainingContent,
              });

              // GrowiのmarkdownRendererを使って再パース
              const renderedHTML = growiFacade.markdownRenderer?.parse
                ? growiFacade.markdownRenderer.parse(markdownContent)
                : markdownContent; // パースできない場合はそのままテキストを出力

              console.log(JSON.parse(JSON.stringify(renderedHTML)));

              // HTMLとしてカスタムアラートを生成
              node.type = 'html';
              node.value = `
                <div class="callout callout-${alertType}">
                  ${renderedHTML}
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
