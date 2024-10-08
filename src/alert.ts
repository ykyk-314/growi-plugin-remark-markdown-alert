import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

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
              const markdownContent = remainingContent.map((child) => {
                if (child.type === 'text') {
                  return child.value; // すべてのテキストノードを連結
                }
                if (child.type === 'break') {
                  return '\n'; // 改行はそのまま
                }
                return ''; // その他のノードは空として扱う
              }).join('');

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
