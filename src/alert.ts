import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

interface GrowiNode extends Node {
  name?: string;
  type: string;
  attributes: {[key: string]: string}
  children: GrowiNode[];
  value?: string;
}

export const plugin: Plugin = function() {
  return (tree) => {
    visit(tree, 'blockquote', (node: GrowiNode) => {
      if (node.children && node.children.length > 0) {
        // 最初の子要素であるparagraphを取得
        const paragraph = node.children[0];

        if (paragraph.type === 'paragraph' && paragraph.children && paragraph.children.length > 0) {
          // paragraph内の最初のテキスト要素
          const textNode = paragraph.children[0];
          if (textNode.type === 'text' && textNode.value) {
            // テキストを取得してtrim()を適用
            const content = textNode.value.trim();
            console.log(content);

            const match = content.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](.*)$/);
            if (match) {
              const alertType = match[1].toLowerCase(); // NOTE, TIP, WARNING など
              const alertContent = match[2].trim(); // アラート内容

              // HTMLとしてカスタムアラートを生成
              node.type = 'html';
              node.value = `
                <div class="custom-alert alert-${alertType}">
                  <strong>${alertType.toUpperCase()}</strong>
                  <p>${alertContent}</p>
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
