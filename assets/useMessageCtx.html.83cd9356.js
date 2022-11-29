import{_ as t,r as o,o as c,c as r,a as e,b as s,d as n,e as i}from"./app.872d8008.js";const l={},p=i(`<h1 id="usemessagectx" tabindex="-1"><a class="header-anchor" href="#usemessagectx" aria-hidden="true">#</a> useMessageCtx</h1><h2 id="usage" tabindex="-1"><a class="header-anchor" href="#usage" aria-hidden="true">#</a> Usage</h2><div class="language-tsx line-numbers-mode" data-ext="tsx"><pre class="language-tsx"><code><span class="token keyword">const</span> <span class="token function-variable function">App</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token punctuation">{</span> message<span class="token punctuation">,</span> client <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">useMessageCtx</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

  <span class="token keyword">return</span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span></span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span></span><span class="token punctuation">&gt;</span></span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="messagecontext" tabindex="-1"><a class="header-anchor" href="#messagecontext" aria-hidden="true">#</a> MessageContext</h2><p>The message context contains properties related to the current message.</p><h3 id="client-client" tabindex="-1"><a class="header-anchor" href="#client-client" aria-hidden="true">#</a> client <code>Client</code></h3><p>The current Discord.js Client being used.</p>`,7),d={href:"https://discord.js.org/#/docs/discord.js/stable/class/Client",target:"_blank",rel:"noopener noreferrer"},u=e("h3",{id:"message-message",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#message-message","aria-hidden":"true"},"#"),s(" message "),e("code",null,"Message")],-1),h=e("p",null,"The current message being rendered.",-1),g={href:"https://discord.js.org/#/docs/discord.js/stable/class/Message",target:"_blank",rel:"noopener noreferrer"};function k(m,_){const a=o("ExternalLinkIcon");return c(),r("div",null,[p,e("blockquote",null,[e("p",null,[s("More info about "),e("a",d,[s("Discord.js Client"),n(a)])])]),u,h,e("blockquote",null,[e("p",null,[s("More info about "),e("a",g,[s("Message"),n(a)])])])])}const b=t(l,[["render",k],["__file","useMessageCtx.html.vue"]]);export{b as default};
