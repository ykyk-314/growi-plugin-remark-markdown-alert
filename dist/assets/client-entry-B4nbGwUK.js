const A="growi-plugin-remark-markdown-alert",O="1.0.0",x="GROWI plugin Remark alert syntax",j="MIT",T=[],I="module",P={dev:"vite",build:"tsc && vite build",preview:"vite preview"},R={react:"^18.3.1","react-dom":"^18.3.1","react-innertext":"^1.1.5",unified:"^11.0.5","unist-util-visit":"^5.0.0"},F={"@types/react":"^18.3.3","@types/react-dom":"^18.3.0","@typescript-eslint/eslint-plugin":"^5.0.0","@typescript-eslint/parser":"^5.0.0","@vitejs/plugin-react":"^4.3.1",eslint:"^8.18.0","eslint-config-next":"^14.2.4","eslint-config-weseek":"^2.1.0","eslint-import-resolver-typescript":"^3.2.5","eslint-plugin-import":"^2.29.1","eslint-plugin-jest":"^27.1.0","eslint-plugin-react":"^7.30.1","eslint-plugin-react-hooks":"^4.6.0","eslint-plugin-regex":"^1.10.0",jest:"^29.7.0",typescript:"^5.5.2",vite:"^5.3.2"},C={schemaVersion:"4",types:["script"]},E={name:A,version:O,description:x,license:j,keywords:T,type:I,scripts:P,dependencies:R,devDependencies:F,growiPlugin:C},v=function(e){if(e==null)return J;if(typeof e=="function")return h(e);if(typeof e=="object")return Array.isArray(e)?S(e):$(e);if(typeof e=="string")return G(e);throw new Error("Expected function, string, or object as test")};function S(e){const t=[];let n=-1;for(;++n<e.length;)t[n]=v(e[n]);return h(i);function i(...c){let r=-1;for(;++r<t.length;)if(t[r].apply(this,c))return!0;return!1}}function $(e){const t=e;return h(n);function n(i){const c=i;let r;for(r in e)if(c[r]!==t[r])return!1;return!0}}function G(e){return h(t);function t(n){return n&&n.type===e}}function h(e){return t;function t(n,i,c){return!!(q(n)&&e.call(this,n,typeof i=="number"?i:void 0,c||void 0))}}function J(){return!0}function q(e){return e!==null&&typeof e=="object"&&"type"in e}const b=[],L=!0,k=!1,M="skip";function V(e,t,n,i){let c;typeof t=="function"&&typeof n!="function"?(i=n,n=t):c=t;const r=v(c),p=i?-1:1;d(e,void 0,[])();function d(o,s,l){const a=o&&typeof o=="object"?o:{};if(typeof a.type=="string"){const u=typeof a.tagName=="string"?a.tagName:typeof a.name=="string"?a.name:void 0;Object.defineProperty(m,"name",{value:"node ("+(o.type+(u?"<"+u+">":""))+")"})}return m;function m(){let u=b,y,f,w;if((!t||r(o,s,l[l.length-1]||void 0))&&(u=D(n(o,l)),u[0]===k))return u;if("children"in o&&o.children){const g=o;if(g.children&&u[0]!==M)for(f=(i?g.children.length:-1)+p,w=l.concat(g);f>-1&&f<g.children.length;){const N=g.children[f];if(y=d(N,f,w)(),y[0]===k)return y;f=typeof y[1]=="number"?y[1]:f+p}}return u}}}function D(e){return Array.isArray(e)?e:typeof e=="number"?[L,e]:e==null?b:[e]}function U(e,t,n,i){let c,r,p;r=t,p=n,c=i,V(e,r,d,c);function d(o,s){const l=s[s.length-1],a=l?l.children.indexOf(o):void 0;return p(o,a,l)}}const W=function(){return e=>{U(e,"blockquote",t=>{if(console.log(JSON.parse(JSON.stringify(t))),t.children&&t.children.length>0){const n=t.children[0];if(n.type==="paragraph"&&n.children&&n.children.length>0){const i=n.children[0];if(i.type==="text"&&i.value){const c=i.value.trim(),r=c.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](.*)$/);if(console.log(c),console.log(r),r){const p=r[1].toLowerCase(),o=n.children.slice(1).map(s=>s.type==="text"?`<p>${s.value}</p>`:s.type==="break"?"<br>":s.type==="paragraph"?`<p>${s.children.map(l=>l.value||"").join("")}</p>`:"").join("");console.log(JSON.parse(JSON.stringify(o))),t.type="html",t.value=`
                <div class="callout callout-${p}">
                  <blockquote>${o}</blockquote>
                </div>
              `,t.children=[]}}}}})}},B=()=>{if(growiFacade==null||growiFacade.markdownRenderer==null)return;const{optionsGenerators:e}=growiFacade.markdownRenderer;e.customGenerateViewOptions=(...t)=>{const n=e.generateViewOptions(...t);return n.remarkPlugins.push(W),n}},H=()=>{};window.pluginActivators==null&&(window.pluginActivators={});window.pluginActivators[E.name]={activate:B,deactivate:H};
