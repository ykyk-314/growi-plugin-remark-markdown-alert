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
      // `children`が存在し、最初の子要素が存在するかをチェック
      console.log(node);
      console.log(node.children);
      console.log(node.children.length);
      if (node.children && node.children.length > 0 && node.children[0].value) {
        const content = node.children[0].value.trim(); // `trim()` を実行する前にチェック
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
    });
  };
};
