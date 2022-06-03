import{_ as e,r as o,o as p,c,a as n,b as i,d as s,e as a}from"./app.2915195c.js";const l={},u=s(`<h1 id="action-row" tabindex="-1"><a class="header-anchor" href="#action-row" aria-hidden="true">#</a> Action Row</h1><h2 id="container" tabindex="-1"><a class="header-anchor" href="#container" aria-hidden="true">#</a> Container</h2><p><code>&lt;action-row&gt;</code> is a top-level element and should only be used as a direct child of your <code>&lt;message&gt;</code> element.</p><blockquote><p>You can have a maximum of 5 action rows per message, as per Discord API&#39;s specs.</p></blockquote><div class="language-tsx ext-tsx line-numbers-mode"><pre class="language-tsx"><code><span class="token keyword">const</span> <span class="token function-variable function">App</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">(</span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>action-row</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
        </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">Click Me!</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>action-row</span><span class="token punctuation">&gt;</span></span>
<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="button" tabindex="-1"><a class="header-anchor" href="#button" aria-hidden="true">#</a> Button</h2><p>Creates an interaction button.</p><blockquote><p>You can have a maximum of 5 buttons per interaction rows, as per Discord API&#39;s specs.</p></blockquote><h3 id="usage" tabindex="-1"><a class="header-anchor" href="#usage" aria-hidden="true">#</a> Usage</h3><div class="language-tsx ext-tsx line-numbers-mode"><pre class="language-tsx"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>action-row</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">My Button</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>action-row</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="props" tabindex="-1"><a class="header-anchor" href="#props" aria-hidden="true">#</a> Props</h3><h4 id="onclick-interaction-buttoninteraction-any" tabindex="-1"><a class="header-anchor" href="#onclick-interaction-buttoninteraction-any" aria-hidden="true">#</a> onClick <code>(interaction: ButtonInteraction) =&gt; any</code></h4>`,12),r=a("Read more about "),d={href:"https://discord.js.org/#/docs/discord.js/stable/class/ButtonInteraction",target:"_blank",rel:"noopener noreferrer"},k=a("ButtonInteraction"),g=a(" on the (discord.js docs)"),v=s(`<div class="language-tsx ext-tsx line-numbers-mode"><pre class="language-tsx"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">onClick</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span><span class="token punctuation">(</span><span class="token punctuation">{</span>user<span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">Hi </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>user<span class="token punctuation">.</span>username<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">!</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span><span class="token punctuation">}</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
    Say Hello
</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>And when I click</p><div class="language-text ext-text"><pre class="language-text"><code>Hi Alfie!
</code></pre></div><h3 id="important" tabindex="-1"><a class="header-anchor" href="#important" aria-hidden="true">#</a> Important</h3><p>By default <code>onClick</code> will respond to the interaction with a <code>deferUpdate</code>, in order to prevent discord from telling the user that their interaction failed.</p><p>To prevent this default behaviour, return a truthy value in your function.</p><h4 id="example" tabindex="-1"><a class="header-anchor" href="#example" aria-hidden="true">#</a> Example</h4><p>Will trigger default behaviour</p><div class="language-tsx ext-tsx line-numbers-mode"><pre class="language-tsx"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span>
    <span class="token attr-name">onClick</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
        <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;hello&#39;</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span><span class="token punctuation">}</span></span>
<span class="token punctuation">&gt;</span></span><span class="token plain-text">
    My Button
</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Won&#39;t trigger default behaviour, the interaction will fail if you don&#39;t handle it yourself.</p><div class="language-tsx ext-tsx line-numbers-mode"><pre class="language-tsx"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span>
    <span class="token attr-name">onClick</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
        <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;hello&#39;</span><span class="token punctuation">)</span>
        <span class="token keyword">return</span> <span class="token boolean">true</span> <span class="token comment">// or 1 or a non empty string etc...</span>
    <span class="token punctuation">}</span><span class="token punctuation">}</span></span>
<span class="token punctuation">&gt;</span></span><span class="token plain-text">
    My Button
</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,11);function h(b,m){const t=o("ExternalLinkIcon");return p(),c("div",null,[u,n("blockquote",null,[n("p",null,[r,n("a",d,[k,i(t)]),g])]),v])}var f=e(l,[["render",h],["__file","action-row.html.vue"]]);export{f as default};
