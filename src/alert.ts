import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

interface GrowiNode extends Node {
  name: string;
  type: string;
  attributes: {[key: string]: string}
  children: GrowiNode[];
  value: string;
}

export const plugin: Plugin = function() {
  return (tree) => {
    visit(tree, 'blockquote', (node: GrowiNode) => {
      const content = node.children[0]?.value.trim();
      if (content) {
        const match = content.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](.*)$/);
        if (match) {
          const alertType = match[1].toLowerCase(); // NOTE, TIP, WARNING など
          const alertContent = match[2].trim(); // アラート内容

          // HTMLとしてカスタムアラートを生成
          node.type = 'html';
          node.value = `
            <div class="callout callout-${alertType}">
              <p>${alertContent}</p>
            </div>
          `;
          node.children = [];
        }
      }
    });
  };
};
