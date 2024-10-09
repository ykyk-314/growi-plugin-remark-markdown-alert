const N="growi-plugin-remark-markdown-alert",j="1.0.0",x="GROWI plugin Remark alert syntax",F="MIT",T=[],I="module",O={dev:"vite",build:"tsc && vite build",preview:"vite preview"},P={"mdast-util-to-markdown":"^2.1.0",react:"^18.3.1","react-dom":"^18.3.1","react-innertext":"^1.1.5",unified:"^11.0.5","unist-util-visit":"^5.0.0"},C={"@types/react":"^18.3.3","@types/react-dom":"^18.3.0","@typescript-eslint/eslint-plugin":"^5.0.0","@typescript-eslint/parser":"^5.0.0","@vitejs/plugin-react":"^4.3.1",eslint:"^8.18.0","eslint-config-next":"^14.2.4","eslint-config-weseek":"^2.1.0","eslint-import-resolver-typescript":"^3.2.5","eslint-plugin-import":"^2.29.1","eslint-plugin-jest":"^27.1.0","eslint-plugin-react":"^7.30.1","eslint-plugin-react-hooks":"^4.6.0","eslint-plugin-regex":"^1.10.0",jest:"^29.7.0",typescript:"^5.5.2",vite:"^5.3.2"},E={schemaVersion:"4",types:["script"]},G={name:N,version:j,description:x,license:F,keywords:T,type:I,scripts:O,dependencies:P,devDependencies:C,growiPlugin:E},v=function(e){if(e==null)return $;if(typeof e=="function")return h(e);if(typeof e=="object")return Array.isArray(e)?M(e):L(e);if(typeof e=="string")return V(e);throw new Error("Expected function, string, or object as test")};function M(e){const t=[];let n=-1;for(;++n<e.length;)t[n]=v(e[n]);return h(r);function r(...o){let c=-1;for(;++c<t.length;)if(t[c].apply(this,o))return!0;return!1}}function L(e){const t=e;return h(n);function n(r){const o=r;let c;for(c in e)if(o[c]!==t[c])return!1;return!0}}function V(e){return h(t);function t(n){return n&&n.type===e}}function h(e){return t;function t(n,r,o){return!!(D(n)&&e.call(this,n,typeof r=="number"?r:void 0,o||void 0))}}function $(){return!0}function D(e){return e!==null&&typeof e=="object"&&"type"in e}const A=[],U=!0,k=!1,W="skip";function q(e,t,n,r){let o;typeof t=="function"&&typeof n!="function"?(r=n,n=t):o=t;const c=v(o),a=r?-1:1;d(e,void 0,[])();function d(i,l,s){const p=i&&typeof i=="object"?i:{};if(typeof p.type=="string"){const u=typeof p.tagName=="string"?p.tagName:typeof p.name=="string"?p.name:void 0;Object.defineProperty(m,"name",{value:"node ("+(i.type+(u?"<"+u+">":""))+")"})}return m;function m(){let u=A,g,f,w;if((!t||c(i,l,s[s.length-1]||void 0))&&(u=B(n(i,s)),u[0]===k))return u;if("children"in i&&i.children){const y=i;if(y.children&&u[0]!==W)for(f=(r?y.children.length:-1)+a,w=s.concat(y);f>-1&&f<y.children.length;){const R=y.children[f];if(g=d(R,f,w)(),g[0]===k)return g;f=typeof g[1]=="number"?g[1]:f+a}}return u}}}function B(e){return Array.isArray(e)?e:typeof e=="number"?[U,e]:e==null?A:[e]}function H(e,t,n,r){let o,c,a;c=t,a=n,o=r,q(e,c,d,o);function d(i,l){const s=l[l.length-1],p=s?s.children.indexOf(i):void 0;return a(i,p,s)}}const b=e=>e.value?e.value:e.children&&e.children.length>0?e.children.map(b).join(""):"",K=function(){return e=>{H(e,"blockquote",t=>{if(t.children&&t.children.length>0){const n=t.children[0];if(n.type==="paragraph"&&n.children&&n.children.length>0){const r=n.children[0];if(r.type==="text"&&r.value){const c=r.value.trim().match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](.*)$/);if(c){const a=c[1].toLowerCase(),i=n.children.slice(1).map(b).join(`
`);let l="";growiFacade.markdownRenderer&&growiFacade.markdownRenderer.parse?l=growiFacade.markdownRenderer.parse(i):l=i;const s=`
                <div class="callout callout-${a}">
                  ${l}
                </div>
              `;t.type="html",t.value=s,t.children=[]}}}}})}},S=()=>{if(growiFacade==null||growiFacade.markdownRenderer==null)return;const{optionsGenerators:e}=growiFacade.markdownRenderer;e.customGenerateViewOptions=(...t)=>{const n=e.generateViewOptions(...t);return n.remarkPlugins.push(K),n}},X=()=>{};window.pluginActivators==null&&(window.pluginActivators={});window.pluginActivators[G.name]={activate:S,deactivate:X};
