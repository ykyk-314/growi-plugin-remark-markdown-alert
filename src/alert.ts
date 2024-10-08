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
          console.log(JSON.parse(JSON.stringify(node)));
          console.log(JSON.parse(JSON.stringify(node.children)));
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

              // 残りのコンテンツを連結してHTMLとして出力する
              const innerHTML = remainingContent.map((child) => {
                if (child.type === 'text') {
                  return `<p>${child.value}</p>`;
                }
                if (child.type === 'break') {
                  return '<br>';
                }
                if (child.type === 'paragraph') {
                  return `<p>${child.children.map(subChild => subChild.value || '').join('')}</p>`;
                }
                if (child.type === 'strong') {
                  return `<strong>${child.children.map(subChild => subChild.value || '').join('')}</strong>`;
                }
                if (child.type === 'emphasis') {
                  return `<em>${child.children.map(subChild => subChild.value || '').join('')}</em>`;
                }
                if (child.type === 'delete') {
                  return `<del>${child.children.map(subChild => subChild.value || '').join('')}</del>`;
                }
                if (child.type === 'list') {
                  const items = child.children.map(listItem => `<li>${listItem.children.map(subChild => subChild.value || '').join('')}</li>`).join('');
                  return `<ul>${items}</ul>`;
                }
                return '';
              }).join('');
              console.log(JSON.parse(JSON.stringify(innerHTML)));

              // HTMLとしてカスタムアラートを生成
              node.type = 'html';
              node.value = `
                <div class="callout callout-${alertType}">
                  ${innerHTML}
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
