var app=function(){"use strict";function t(){}function n(t){return t()}function e(){return Object.create(null)}function o(t){t.forEach(n)}function r(t){return"function"==typeof t}function c(t,n){return t!=t?n==n:t!==n||t&&"object"==typeof t||"function"==typeof t}function i(n,e,o){n.$$.on_destroy.push(function(n,...e){if(null==n)return t;const o=n.subscribe(...e);return o.unsubscribe?()=>o.unsubscribe():o}(e,o))}function u(t,n,e){return t.set(e),n}function s(t,n){t.appendChild(n)}function l(t,n,e){t.insertBefore(n,e||null)}function a(t){t.parentNode.removeChild(t)}function f(t){return document.createElement(t)}function d(t){return document.createTextNode(t)}function h(){return d(" ")}function p(t,n,e,o){return t.addEventListener(n,e,o),()=>t.removeEventListener(n,e,o)}function m(t,n,e){null==e?t.removeAttribute(n):t.getAttribute(n)!==e&&t.setAttribute(n,e)}function $(t,n){t.value=null==n?"":n}let g;function b(t){g=t}function y(t){(function(){if(!g)throw new Error("Function called outside component initialization");return g})().$$.on_mount.push(t)}const v=[],x=[],_=[],w=[],k=Promise.resolve();let E=!1;function T(t){_.push(t)}let S=!1;const j=new Set;function C(){if(!S){S=!0;do{for(let t=0;t<v.length;t+=1){const n=v[t];b(n),L(n.$$)}for(b(null),v.length=0;x.length;)x.pop()();for(let t=0;t<_.length;t+=1){const n=_[t];j.has(n)||(j.add(n),n())}_.length=0}while(v.length);for(;w.length;)w.pop()();E=!1,S=!1,j.clear()}}function L(t){if(null!==t.fragment){t.update(),o(t.before_update);const n=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,n),t.after_update.forEach(T)}}const O=new Set;function P(t,n){-1===t.$$.dirty[0]&&(v.push(t),E||(E=!0,k.then(C)),t.$$.dirty.fill(0)),t.$$.dirty[n/31|0]|=1<<n%31}function z(c,i,u,s,l,f,d,h=[-1]){const p=g;b(c);const m=c.$$={fragment:null,ctx:null,props:f,update:t,not_equal:l,bound:e(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(p?p.$$.context:i.context||[]),callbacks:e(),dirty:h,skip_bound:!1,root:i.target||p.$$.root};d&&d(m.root);let $=!1;if(m.ctx=u?u(c,i.props||{},((t,n,...e)=>{const o=e.length?e[0]:n;return m.ctx&&l(m.ctx[t],m.ctx[t]=o)&&(!m.skip_bound&&m.bound[t]&&m.bound[t](o),$&&P(c,t)),n})):[],m.update(),$=!0,o(m.before_update),m.fragment=!!s&&s(m.ctx),i.target){if(i.hydrate){const t=function(t){return Array.from(t.childNodes)}(i.target);m.fragment&&m.fragment.l(t),t.forEach(a)}else m.fragment&&m.fragment.c();i.intro&&((y=c.$$.fragment)&&y.i&&(O.delete(y),y.i(v))),function(t,e,c,i){const{fragment:u,on_mount:s,on_destroy:l,after_update:a}=t.$$;u&&u.m(e,c),i||T((()=>{const e=s.map(n).filter(r);l?l.push(...e):o(e),t.$$.on_mount=[]})),a.forEach(T)}(c,i.target,i.anchor,i.customElement),C()}var y,v;b(p)}const A=[];function N(n){let e,r,c,i,u,g,b,y,v,x,_,w,k,E,T;return{c(){var t,o,s;e=f("nav"),e.innerHTML='<span class="navbar-brand mb-0 h1">Short URL</span>',r=h(),c=f("div"),i=f("div"),u=f("input"),g=h(),b=f("button"),b.textContent="Short-it",y=h(),v=f("input"),x=h(),_=f("p"),w=d("Visitors : "),k=d(n[2]),m(e,"class","navbar navbar-light bg-light"),m(u,"class","form-control form-control-lg"),m(u,"type","text"),m(u,"placeholder","Enter Link to short.."),m(v,"class","form-control form-control-lg"),m(v,"type","text"),m(v,"placeholder","Your new Link"),v.disabled=!0,m(i,"class","h-50 w-50"),t="border",o="1px solid red",i.style.setProperty(t,o,s?"important":""),m(c,"class","h-75 d-flex justify-content-center align-items-center")},m(t,o){l(t,e,o),l(t,r,o),l(t,c,o),s(c,i),s(i,u),$(u,n[0]),s(i,g),s(i,b),s(i,y),s(i,v),$(v,n[1]),s(i,x),s(i,_),s(_,w),s(_,k),E||(T=[p(u,"input",n[6]),p(b,"click",n[5]),p(v,"input",n[7]),p(v,"click",n[4]())],E=!0)},p(t,[n]){1&n&&u.value!==t[0]&&$(u,t[0]),2&n&&v.value!==t[1]&&$(v,t[1]),4&n&&function(t,n){n=""+n,t.wholeText!==n&&(t.data=n)}(k,t[2])},i:t,o:t,d(t){t&&a(e),t&&a(r),t&&a(c),E=!1,o(T)}}}function q(n,e,o){let r,s="",l="",a=function(n,e=t){let o;const r=new Set;function i(t){if(c(n,t)&&(n=t,o)){const t=!A.length;for(const t of r)t[1](),A.push(t,n);if(t){for(let t=0;t<A.length;t+=2)A[t][0](A[t+1]);A.length=0}}}return{set:i,update:function(t){i(t(n))},subscribe:function(c,u=t){const s=[c,u];return r.add(s),1===r.size&&(o=e(i)||t),c(n),()=>{r.delete(s),0===r.size&&(o(),o=null)}}}}(0);function f(){var t=async function(){fetch("http://localhost:8080/visitors",{method:"GET",headers:{"Content-Type":"application/json"}}).then((t=>{t.text().then((t=>{u(a,r=t.trim(),r)}))})).catch((t=>{u(a,r="Server Offline",r),console.error(t)}))}(),n=new Promise((function(t,n){setTimeout(t,5e3,"Timeout Done")}));Promise.all([t,n]).then((function(){f()}))}return i(n,a,(t=>o(2,r=t))),y((async()=>{f()})),[s,l,r,a,function(){""!==l&&(navigator.clipboard.writeText(l),alert("Copied the text: "+copyText.value))},async function(){fetch("http://localhost:8080/sqzm",{method:"POST",headers:{"Content-Type":"application/json"},body:`{"url":"${s}"}`}).then((t=>{t.text().then((t=>{o(1,l=t.trim())}))})).catch((t=>{o(1,l="Server Offline"),console.error(t)}))},function(){s=this.value,o(0,s)},function(){l=this.value,o(1,l)}]}return new class extends class{$destroy(){!function(t,n){const e=t.$$;null!==e.fragment&&(o(e.on_destroy),e.fragment&&e.fragment.d(n),e.on_destroy=e.fragment=null,e.ctx=[])}(this,1),this.$destroy=t}$on(t,n){const e=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return e.push(n),()=>{const t=e.indexOf(n);-1!==t&&e.splice(t,1)}}$set(t){var n;this.$$set&&(n=t,0!==Object.keys(n).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}{constructor(t){super(),z(this,t,q,N,c,{})}}({target:document.body,props:{name:"world"}})}();
//# sourceMappingURL=bundle.js.map
