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
      console.log(JSON.parse(JSON.stringify(node)));
      if (node.children && node.children.length > 0) {
        // 最初の子要素であるparagraphを取得
        const paragraph = node.children[0];

        if (paragraph.type === 'paragraph' && paragraph.children && paragraph.children.length > 0) {
          // paragraph内の最初のテキスト要素
          const textNode = paragraph.children[0];
          if (textNode.type === 'text' && textNode.value) {
            const content = textNode.value.trim();
            const match = content.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](.*)$/);

            console.log(content);
            console.log(match);
            if (match) {
              const alertType = match[1].toLowerCase(); // NOTE, TIP, WARNING など

              // アラート記法のタグ部分をスキップし、それ以外の内容を全て取得
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
