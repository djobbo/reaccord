import{_ as n,o as s,c as e,d as a}from"./app.294e585f.js";const t={},o=a(`<h1 id="using-typescript" tabindex="-1"><a class="header-anchor" href="#using-typescript" aria-hidden="true">#</a> Using Typescript</h1><h2 id="installation" tabindex="-1"><a class="header-anchor" href="#installation" aria-hidden="true">#</a> Installation</h2><p>Reaccord has typescript support built-in, but for the optimal experience you will want to add <code>@types/react</code> to your devDependencies.</p><div class="language-bash ext-sh"><pre class="language-bash"><code><span class="token function">npm</span> <span class="token function">install</span> -D @types/react
<span class="token function">yarn</span> <span class="token function">add</span> -D @types/react
<span class="token function">pnpm</span> <span class="token function">add</span> -D @types/react
</code></pre></div><h2 id="getting-the-right-jsx-types" tabindex="-1"><a class="header-anchor" href="#getting-the-right-jsx-types" aria-hidden="true">#</a> Getting the right jsx types</h2><p>In order to get a complete typescript experience you&#39;ll want to add these two rules to your <code>tsconfig.json</code></p><div class="language-json ext-json line-numbers-mode"><pre class="language-json"><code><span class="token punctuation">{</span>
    <span class="token property">&quot;compilerOptions&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        ...
        <span class="token property">&quot;jsx&quot;</span><span class="token operator">:</span> <span class="token string">&quot;react-jsx&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;jsxImportSource&quot;</span><span class="token operator">:</span> <span class="token string">&quot;reaccord&quot;</span>
        ...
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,7),i=[o];function p(c,r){return s(),e("div",null,i)}var d=n(t,[["render",p],["__file","typescript.html.vue"]]);export{d as default};
