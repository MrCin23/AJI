(()=>{"use strict";var e={d:(t,n)=>{for(var r in n)e.o(n,r)&&!e.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:n[r]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},t={};e.r(t),e.d(t,{xX:()=>ee,qA:()=>te,LG:()=>Y,cH:()=>Z,v3:()=>re,v7:()=>ne,fK:()=>ie,i7:()=>z,PO:()=>ce,m_:()=>oe,Ll:()=>se,OE:()=>ue,Is:()=>ae});const n="0.7.0";let r,s,o,i,a,u,c,l,d,p=!1,f=null,h=null,y=null,m=null;class w{constructor(e){this.body=e}get[Symbol.toStringTag](){return"MultipartBody"}}r||function(e,t={auto:!1}){if(p)throw new Error(`you must \`import 'groq-sdk/shims/${e.kind}'\` before importing anything else from groq-sdk`);if(r)throw new Error(`can't \`import 'groq-sdk/shims/${e.kind}'\` after \`import 'groq-sdk/shims/${r}'\``);p=t.auto,r=e.kind,s=e.fetch,f=e.Request,h=e.Response,y=e.Headers,o=e.FormData,m=e.Blob,i=e.File,a=e.ReadableStream,u=e.getMultipartRequestOptions,c=e.getDefaultAgent,l=e.fileFromPath,d=e.isFsReadStream}(function({manuallyImported:e}={}){const t=e?"You may need to use polyfills":"Add one of these imports before your first `import … from 'groq-sdk'`:\n- `import 'groq-sdk/shims/node'` (if you're running on Node)\n- `import 'groq-sdk/shims/web'` (otherwise)\n";let n,r,s,o;try{n=fetch,r=Request,s=Response,o=Headers}catch(e){throw new Error(`this environment is missing the following Web Fetch API type: ${e.message}. ${t}`)}return{kind:"web",fetch:n,Request:r,Response:s,Headers:o,FormData:"undefined"!=typeof FormData?FormData:class{constructor(){throw new Error(`file uploads aren't supported in this environment yet as 'FormData' is undefined. ${t}`)}},Blob:"undefined"!=typeof Blob?Blob:class{constructor(){throw new Error(`file uploads aren't supported in this environment yet as 'Blob' is undefined. ${t}`)}},File:"undefined"!=typeof File?File:class{constructor(){throw new Error(`file uploads aren't supported in this environment yet as 'File' is undefined. ${t}`)}},ReadableStream:"undefined"!=typeof ReadableStream?ReadableStream:class{constructor(){throw new Error(`streaming isn't supported in this environment yet as 'ReadableStream' is undefined. ${t}`)}},getMultipartRequestOptions:async(e,t)=>({...t,body:new w(e)}),getDefaultAgent:e=>{},fileFromPath:()=>{throw new Error("The `fileFromPath` function is only supported in Node. See the README for more details: https://www.github.com/groq/groq-typescript#file-uploads")},isFsReadStream:e=>!1}}(),{auto:!0});class g{constructor(e,t){this.iterator=e,this.controller=t}static fromSSEResponse(e,t){let n=!1;const r=new b;return new g((async function*(){if(n)throw new Error("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");n=!0;let s=!1;try{for await(const n of async function*(){if(!e.body)throw t.abort(),new z("Attempted to iterate over a response with no body");const n=new R,s=x(e.body);for await(const e of s)for(const t of n.decode(e)){const e=r.decode(t);e&&(yield e)}for(const e of n.flush()){const t=r.decode(e);t&&(yield t)}}())if(!s)if(n.data.startsWith("[DONE]"))s=!0;else if(null===n.event||"error"===n.event){let e;try{e=JSON.parse(n.data)}catch(e){throw console.error("Could not parse message into JSON:",n.data),console.error("From chunk:",n.raw),e}if(e&&e.error)throw new Y(e.error.status_code,e.error,e.error.message,void 0);yield e}s=!0}catch(e){if(e instanceof Error&&"AbortError"===e.name)return;throw e}finally{s||t.abort()}}),t)}static fromReadableStream(e,t){let n=!1;return new g((async function*(){if(n)throw new Error("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");n=!0;let r=!1;try{for await(const t of async function*(){const t=new R,n=x(e);for await(const e of n)for(const n of t.decode(e))yield n;for(const e of t.flush())yield e}())r||t&&(yield JSON.parse(t));r=!0}catch(e){if(e instanceof Error&&"AbortError"===e.name)return;throw e}finally{r||t.abort()}}),t)}[Symbol.asyncIterator](){return this.iterator()}tee(){const e=[],t=[],n=this.iterator(),r=r=>({next:()=>{if(0===r.length){const r=n.next();e.push(r),t.push(r)}return r.shift()}});return[new g((()=>r(e)),this.controller),new g((()=>r(t)),this.controller)]}toReadableStream(){const e=this;let t;const n=new TextEncoder;return new a({async start(){t=e[Symbol.asyncIterator]()},async pull(e){try{const{value:r,done:s}=await t.next();if(s)return e.close();const o=n.encode(JSON.stringify(r)+"\n");e.enqueue(o)}catch(t){e.error(t)}},async cancel(){await(t.return?.())}})}}class b{constructor(){this.event=null,this.data=[],this.chunks=[]}decode(e){if(e.endsWith("\r")&&(e=e.substring(0,e.length-1)),!e){if(!this.event&&!this.data.length)return null;const e={event:this.event,data:this.data.join("\n"),raw:this.chunks};return this.event=null,this.data=[],this.chunks=[],e}if(this.chunks.push(e),e.startsWith(":"))return null;let[t,n,r]=function(e){const t=e.indexOf(":");return-1!==t?[e.substring(0,t),":",e.substring(t+1)]:[e,"",""]}(e);return r.startsWith(" ")&&(r=r.substring(1)),"event"===t?this.event=r:"data"===t&&this.data.push(r),null}}class R{constructor(){this.buffer=[],this.trailingCR=!1}decode(e){let t=this.decodeText(e);if(this.trailingCR&&(t="\r"+t,this.trailingCR=!1),t.endsWith("\r")&&(this.trailingCR=!0,t=t.slice(0,-1)),!t)return[];const n=R.NEWLINE_CHARS.has(t[t.length-1]||"");let r=t.split(R.NEWLINE_REGEXP);return 1!==r.length||n?(this.buffer.length>0&&(r=[this.buffer.join("")+r[0],...r.slice(1)],this.buffer=[]),n||(this.buffer=[r.pop()||""]),r):(this.buffer.push(r[0]),[])}decodeText(e){if(null==e)return"";if("string"==typeof e)return e;if("undefined"!=typeof Buffer){if(e instanceof Buffer)return e.toString();if(e instanceof Uint8Array)return Buffer.from(e).toString();throw new z(`Unexpected: received non-Uint8Array (${e.constructor.name}) stream chunk in an environment with a global "Buffer" defined, which this library assumes to be Node. Please report this error.`)}if("undefined"!=typeof TextDecoder){if(e instanceof Uint8Array||e instanceof ArrayBuffer)return this.textDecoder??(this.textDecoder=new TextDecoder("utf8")),this.textDecoder.decode(e);throw new z(`Unexpected: received non-Uint8Array/ArrayBuffer (${e.constructor.name}) in a web platform. Please report this error.`)}throw new z("Unexpected: neither Buffer nor TextDecoder are available as globals. Please report this error.")}flush(){if(!this.buffer.length&&!this.trailingCR)return[];const e=[this.buffer.join("")];return this.buffer=[],this.trailingCR=!1,e}}function x(e){if(e[Symbol.asyncIterator])return e;const t=e.getReader();return{async next(){try{const e=await t.read();return e?.done&&t.releaseLock(),e}catch(e){throw t.releaseLock(),e}},async return(){const e=t.cancel();return t.releaseLock(),await e,{done:!0,value:void 0}},[Symbol.asyncIterator](){return this}}}R.NEWLINE_CHARS=new Set(["\n","\r","\v","\f","","","","","\u2028","\u2029"]),R.NEWLINE_REGEXP=/\r\n|[\n\r\x0b\x0c\x1c\x1d\x1e\x85\u2028\u2029]/g;const v=e=>null!=e&&"object"==typeof e&&"string"==typeof e.url&&"function"==typeof e.blob,S=e=>null!=e&&"object"==typeof e&&"string"==typeof e.name&&"number"==typeof e.lastModified&&E(e),E=e=>null!=e&&"object"==typeof e&&"number"==typeof e.size&&"string"==typeof e.type&&"function"==typeof e.text&&"function"==typeof e.slice&&"function"==typeof e.arrayBuffer;async function A(e,t,n){if(e=await e,n??(n=S(e)?{lastModified:e.lastModified,type:e.type}:{}),v(e)){const r=await e.blob();return t||(t=new URL(e.url).pathname.split(/[\\/]/).pop()??"unknown_file"),new i([r],t,n)}const r=await async function(e){let t=[];if("string"==typeof e||ArrayBuffer.isView(e)||e instanceof ArrayBuffer)t.push(e);else if(E(e))t.push(await e.arrayBuffer());else{if(!q(e))throw new Error(`Unexpected data type: ${typeof e}; constructor: ${e?.constructor?.name}; props: ${function(e){return`[${Object.getOwnPropertyNames(e).map((e=>`"${e}"`)).join(", ")}]`}(e)}`);for await(const n of e)t.push(n)}return t}(e);if(t||(t=function(e){return D(e.name)||D(e.filename)||D(e.path)?.split(/[\\/]/).pop()}(e)??"unknown_file"),!n.type){const e=r[0]?.type;"string"==typeof e&&(n={...n,type:e})}return new i(r,t,n)}const D=e=>"string"==typeof e?e:"undefined"!=typeof Buffer&&e instanceof Buffer?String(e):void 0,q=e=>null!=e&&"object"==typeof e&&"function"==typeof e[Symbol.asyncIterator],k=e=>e&&"object"==typeof e&&e.body&&"MultipartBody"===e[Symbol.toStringTag],L=async e=>{const t=await C(e.body);return u(t,e)},C=async e=>{const t=new o;return await Promise.all(Object.entries(e||{}).map((([e,n])=>P(t,e,n)))),t},P=async(e,t,n)=>{if(void 0!==n){if(null==n)throw new TypeError(`Received null for "${t}"; to pass null in FormData, you must use the string 'null'`);if("string"==typeof n||"number"==typeof n||"boolean"==typeof n)e.append(t,String(n));else if((e=>S(e)||v(e)||d(e))(n)){const r=await A(n);e.append(t,r)}else if(Array.isArray(n))await Promise.all(n.map((n=>P(e,t+"[]",n))));else{if("object"!=typeof n)throw new TypeError(`Invalid value given to form, expected a string, number, boolean, object, Array, File or Blob but got ${n} instead`);await Promise.all(Object.entries(n).map((([n,r])=>P(e,`${t}[${n}]`,r))))}}};async function O(e){const{response:t}=e;if(e.options.stream)return J("response",t.status,t.url,t.headers,t.body),e.options.__streamClass?e.options.__streamClass.fromSSEResponse(t,e.controller):g.fromSSEResponse(t,e.controller);if(204===t.status)return null;if(e.options.__binaryResponse)return t;const n=t.headers.get("content-type");if(n?.includes("application/json")||n?.includes("application/vnd.api+json")){const e=await t.json();return J("response",t.status,t.url,t.headers,e),e}const r=await t.text();return J("response",t.status,t.url,t.headers,r),r}class I extends Promise{constructor(e,t=O){super((e=>{e(null)})),this.responsePromise=e,this.parseResponse=t}_thenUnwrap(e){return new I(this.responsePromise,(async t=>e(await this.parseResponse(t))))}asResponse(){return this.responsePromise.then((e=>e.response))}async withResponse(){const[e,t]=await Promise.all([this.parse(),this.asResponse()]);return{data:e,response:t}}parse(){return this.parsedPromise||(this.parsedPromise=this.responsePromise.then(this.parseResponse)),this.parsedPromise}then(e,t){return this.parse().then(e,t)}catch(e){return this.parse().catch(e)}finally(e){return this.parse().finally(e)}}class T{constructor({baseURL:e,maxRetries:t=2,timeout:n=6e4,httpAgent:r,fetch:o}){this.baseURL=e,this.maxRetries=W("maxRetries",t),this.timeout=W("timeout",n),this.httpAgent=r,this.fetch=o??s}authHeaders(e){return{}}defaultHeaders(e){return{Accept:"application/json","Content-Type":"application/json","User-Agent":this.getUserAgent(),...j(),...this.authHeaders(e)}}validateHeaders(e,t){}defaultIdempotencyKey(){return`stainless-node-retry-${Q()}`}get(e,t){return this.methodRequest("get",e,t)}post(e,t){return this.methodRequest("post",e,t)}patch(e,t){return this.methodRequest("patch",e,t)}put(e,t){return this.methodRequest("put",e,t)}delete(e,t){return this.methodRequest("delete",e,t)}methodRequest(e,t,n){return this.request(Promise.resolve(n).then((async n=>{const r=n&&E(n?.body)?new DataView(await n.body.arrayBuffer()):n?.body instanceof DataView?n.body:n?.body instanceof ArrayBuffer?new DataView(n.body):n&&ArrayBuffer.isView(n?.body)?new DataView(n.body.buffer):n?.body;return{method:e,path:t,...n,body:r}})))}getAPIList(e,t,n){return this.requestAPIList(t,{method:"get",path:e,...n})}calculateContentLength(e){if("string"==typeof e){if("undefined"!=typeof Buffer)return Buffer.byteLength(e,"utf8").toString();if("undefined"!=typeof TextEncoder)return(new TextEncoder).encode(e).length.toString()}else if(ArrayBuffer.isView(e))return e.byteLength.toString();return null}buildRequest(e){const{method:t,path:n,query:r,headers:s={}}=e,o=ArrayBuffer.isView(e.body)||e.__binaryRequest&&"string"==typeof e.body?e.body:k(e.body)?e.body.body:e.body?JSON.stringify(e.body,null,2):null,i=this.calculateContentLength(o),a=this.buildURL(n,r);"timeout"in e&&W("timeout",e.timeout);const u=e.timeout??this.timeout,l=e.httpAgent??this.httpAgent??c(a),d=u+1e3;return"number"==typeof l?.options?.timeout&&d>(l.options.timeout??0)&&(l.options.timeout=d),this.idempotencyHeader&&"get"!==t&&(e.idempotencyKey||(e.idempotencyKey=this.defaultIdempotencyKey()),s[this.idempotencyHeader]=e.idempotencyKey),{req:{method:t,...o&&{body:o},headers:this.buildHeaders({options:e,headers:s,contentLength:i}),...l&&{agent:l},signal:e.signal??null},url:a,timeout:u}}buildHeaders({options:e,headers:t,contentLength:n}){const s={};return n&&(s["content-length"]=n),G(s,this.defaultHeaders(e)),G(s,t),k(e.body)&&"node"!==r&&delete s["content-type"],this.validateHeaders(s,t),s}async prepareOptions(e){}async prepareRequest(e,{url:t,options:n}){}parseHeaders(e){return e?Symbol.iterator in e?Object.fromEntries(Array.from(e).map((e=>[...e]))):{...e}:{}}makeStatusError(e,t,n,r){return Y.generate(e,t,n,r)}request(e,t=null){return new I(this.makeRequest(e,t))}async makeRequest(e,t){const n=await e;null==t&&(t=n.maxRetries??this.maxRetries),await this.prepareOptions(n);const{req:r,url:s,timeout:o}=this.buildRequest(n);if(await this.prepareRequest(r,{url:s,options:n}),J("request",s,n,r.headers),n.signal?.aborted)throw new Z;const i=new AbortController,a=await this.fetchWithTimeout(s,r,o,i).catch(K);if(a instanceof Error){if(n.signal?.aborted)throw new Z;if(t)return this.retryRequest(n,t);if("AbortError"===a.name)throw new te;throw new ee({cause:a})}const u=B(a.headers);if(!a.ok){if(t&&this.shouldRetry(a))return J(`response (error; retrying, ${t} attempts remaining)`,a.status,s,u),this.retryRequest(n,t,u);const e=await a.text().catch((e=>K(e).message)),r=N(e),o=r?void 0:e;throw J(`response (error; ${t?"(error; no more retries left)":"(error; not retryable)"})`,a.status,s,u,o),this.makeStatusError(a.status,r,o,u)}return{response:a,options:n,controller:i}}requestAPIList(e,t){const n=this.makeRequest(t,null);return new $(this,n,e)}buildURL(e,t){const n=H(e)?new URL(e):new URL(this.baseURL+(this.baseURL.endsWith("/")&&e.startsWith("/")?e.slice(1):e)),r=this.defaultQuery();return function(e){if(!e)return!0;for(const t in e)return!1;return!0}(r)||(t={...r,...t}),"object"==typeof t&&t&&!Array.isArray(t)&&(n.search=this.stringifyQuery(t)),n.toString()}stringifyQuery(e){return Object.entries(e).filter((([e,t])=>void 0!==t)).map((([e,t])=>{if("string"==typeof t||"number"==typeof t||"boolean"==typeof t)return`${encodeURIComponent(e)}=${encodeURIComponent(t)}`;if(null===t)return`${encodeURIComponent(e)}=`;throw new z(`Cannot stringify type ${typeof t}; Expected string, number, boolean, or null. If you need to pass nested query parameters, you can manually encode them, e.g. { query: { 'foo[key1]': value1, 'foo[key2]': value2 } }, and please open a GitHub issue requesting better support for your use case.`)})).join("&")}async fetchWithTimeout(e,t,n,r){const{signal:s,...o}=t||{};s&&s.addEventListener("abort",(()=>r.abort()));const i=setTimeout((()=>r.abort()),n);return this.getRequestClient().fetch.call(void 0,e,{signal:r.signal,...o}).finally((()=>{clearTimeout(i)}))}getRequestClient(){return{fetch:this.fetch}}shouldRetry(e){const t=e.headers.get("x-should-retry");return"true"===t||"false"!==t&&(408===e.status||409===e.status||429===e.status||e.status>=500)}async retryRequest(e,t,n){let r;const s=n?.["retry-after-ms"];if(s){const e=parseFloat(s);Number.isNaN(e)||(r=e)}const o=n?.["retry-after"];if(o&&!r){const e=parseFloat(o);r=Number.isNaN(e)?Date.parse(o)-Date.now():1e3*e}if(!(r&&0<=r&&r<6e4)){const n=e.maxRetries??this.maxRetries;r=this.calculateDefaultRetryTimeoutMillis(t,n)}return await F(r),this.makeRequest(e,t-1)}calculateDefaultRetryTimeoutMillis(e,t){const n=t-e;return Math.min(.5*Math.pow(2,n),8)*(1-.25*Math.random())*1e3}getUserAgent(){return`${this.constructor.name}/JS ${n}`}}new WeakMap,Symbol.asyncIterator;class $ extends I{constructor(e,t,n){super(t,(async t=>new n(e,t.response,await O(t),t.options)))}async*[Symbol.asyncIterator](){const e=await(this);for await(const t of e)yield t}}const B=e=>new Proxy(Object.fromEntries(e.entries()),{get(e,t){const n=t.toString();return e[n.toLowerCase()]||e[n]}}),X=e=>"x32"===e?"x32":"x86_64"===e||"x64"===e?"x64":"arm"===e?"arm":"aarch64"===e||"arm64"===e?"arm64":e?`other:${e}`:"unknown",_=e=>(e=e.toLowerCase()).includes("ios")?"iOS":"android"===e?"Android":"darwin"===e?"MacOS":"win32"===e?"Windows":"freebsd"===e?"FreeBSD":"openbsd"===e?"OpenBSD":"linux"===e?"Linux":e?`Other:${e}`:"Unknown";let U;const j=()=>U??(U=(()=>{if("undefined"!=typeof Deno&&null!=Deno.build)return{"X-Stainless-Lang":"js","X-Stainless-Package-Version":n,"X-Stainless-OS":_(Deno.build.os),"X-Stainless-Arch":X(Deno.build.arch),"X-Stainless-Runtime":"deno","X-Stainless-Runtime-Version":"string"==typeof Deno.version?Deno.version:Deno.version?.deno??"unknown"};if("undefined"!=typeof EdgeRuntime)return{"X-Stainless-Lang":"js","X-Stainless-Package-Version":n,"X-Stainless-OS":"Unknown","X-Stainless-Arch":`other:${EdgeRuntime}`,"X-Stainless-Runtime":"edge","X-Stainless-Runtime-Version":process.version};if("[object process]"===Object.prototype.toString.call("undefined"!=typeof process?process:0))return{"X-Stainless-Lang":"js","X-Stainless-Package-Version":n,"X-Stainless-OS":_(process.platform),"X-Stainless-Arch":X(process.arch),"X-Stainless-Runtime":"node","X-Stainless-Runtime-Version":process.version};const e=function(){if("undefined"==typeof navigator||!navigator)return null;const e=[{key:"edge",pattern:/Edge(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/},{key:"ie",pattern:/MSIE(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/},{key:"ie",pattern:/Trident(?:.*rv\:(\d+)\.(\d+)(?:\.(\d+))?)?/},{key:"chrome",pattern:/Chrome(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/},{key:"firefox",pattern:/Firefox(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/},{key:"safari",pattern:/(?:Version\W+(\d+)\.(\d+)(?:\.(\d+))?)?(?:\W+Mobile\S*)?\W+Safari/}];for(const{key:t,pattern:n}of e){const e=n.exec(navigator.userAgent);if(e)return{browser:t,version:`${e[1]||0}.${e[2]||0}.${e[3]||0}`}}return null}();return e?{"X-Stainless-Lang":"js","X-Stainless-Package-Version":n,"X-Stainless-OS":"Unknown","X-Stainless-Arch":"unknown","X-Stainless-Runtime":`browser:${e.browser}`,"X-Stainless-Runtime-Version":e.version}:{"X-Stainless-Lang":"js","X-Stainless-Package-Version":n,"X-Stainless-OS":"Unknown","X-Stainless-Arch":"unknown","X-Stainless-Runtime":"unknown","X-Stainless-Runtime-Version":"unknown"}})()),N=e=>{try{return JSON.parse(e)}catch(e){return}},M=new RegExp("^(?:[a-z]+:)?//","i"),H=e=>M.test(e),F=e=>new Promise((t=>setTimeout(t,e))),W=(e,t)=>{if("number"!=typeof t||!Number.isInteger(t))throw new z(`${e} must be an integer`);if(t<0)throw new z(`${e} must be a positive integer`);return t},K=e=>e instanceof Error?e:new Error(e),V=e=>"undefined"!=typeof process?process.env?.[e]?.trim()??void 0:"undefined"!=typeof Deno?Deno.env?.get?.(e)?.trim():void 0;function G(e,t){for(const s in t){if(n=t,r=s,!Object.prototype.hasOwnProperty.call(n,r))continue;const o=s.toLowerCase();if(!o)continue;const i=t[s];null===i?delete e[o]:void 0!==i&&(e[o]=i)}var n,r}function J(e,...t){"undefined"!=typeof process&&"true"===process?.env?.DEBUG&&console.log(`Groq:DEBUG:${e}`,...t)}const Q=()=>"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,(e=>{const t=16*Math.random()|0;return("x"===e?t:3&t|8).toString(16)}));class z extends Error{}class Y extends z{constructor(e,t,n,r){super(`${Y.makeMessage(e,t,n)}`),this.status=e,this.headers=r,this.error=t}static makeMessage(e,t,n){const r=t?.message?"string"==typeof t.message?t.message:JSON.stringify(t.message):t?JSON.stringify(t):n;return e&&r?`${e} ${r}`:e?`${e} status code (no body)`:r||"(no status code or body)"}static generate(e,t,n,r){if(!e)return new ee({cause:K(t)});const s=t;return 400===e?new ne(e,s,n,r):401===e?new re(e,s,n,r):403===e?new se(e,s,n,r):404===e?new oe(e,s,n,r):409===e?new ie(e,s,n,r):422===e?new ae(e,s,n,r):429===e?new ue(e,s,n,r):e>=500?new ce(e,s,n,r):new Y(e,s,n,r)}}class Z extends Y{constructor({message:e}={}){super(void 0,void 0,e||"Request was aborted.",void 0),this.status=void 0}}class ee extends Y{constructor({message:e,cause:t}){super(void 0,void 0,e||"Connection error.",void 0),this.status=void 0,t&&(this.cause=t)}}class te extends ee{constructor({message:e}={}){super({message:e??"Request timed out."})}}class ne extends Y{constructor(){super(...arguments),this.status=400}}class re extends Y{constructor(){super(...arguments),this.status=401}}class se extends Y{constructor(){super(...arguments),this.status=403}}class oe extends Y{constructor(){super(...arguments),this.status=404}}class ie extends Y{constructor(){super(...arguments),this.status=409}}class ae extends Y{constructor(){super(...arguments),this.status=422}}class ue extends Y{constructor(){super(...arguments),this.status=429}}class ce extends Y{}class le{constructor(e){this._client=e}}class de extends le{}de||(de={});class pe extends le{create(e,t){return this._client.post("/openai/v1/chat/completions",{body:e,...t,stream:e.stream??!1})}}pe||(pe={});class fe extends le{constructor(){super(...arguments),this.completions=new pe(this._client)}}!function(e){e.Completions=pe}(fe||(fe={}));class he extends le{create(e,t){return this._client.post("/openai/v1/embeddings",{body:e,...t})}}he||(he={});class ye extends le{create(e,t){return this._client.post("/openai/v1/audio/transcriptions",L({body:e,...t}))}}ye||(ye={});class me extends le{create(e,t){return this._client.post("/openai/v1/audio/translations",L({body:e,...t}))}}me||(me={});class we extends le{constructor(){super(...arguments),this.transcriptions=new ye(this._client),this.translations=new me(this._client)}}!function(e){e.Transcriptions=ye,e.Translations=me}(we||(we={}));class ge extends le{retrieve(e,t){return this._client.get(`/openai/v1/models/${e}`,t)}list(e){return this._client.get("/openai/v1/models",e)}delete(e,t){return this._client.delete(`/openai/v1/models/${e}`,t)}}var be;ge||(ge={});class Re extends T{constructor({baseURL:e=V("GROQ_BASE_URL"),apiKey:t=V("GROQ_API_KEY"),...n}={}){if(void 0===t)throw new z("The GROQ_API_KEY environment variable is missing or empty; either provide it, or instantiate the Groq client with an apiKey option, like new Groq({ apiKey: 'My API Key' }).");const r={apiKey:t,...n,baseURL:e||"https://api.groq.com"};if(!r.dangerouslyAllowBrowser&&"undefined"!=typeof window&&void 0!==window.document&&"undefined"!=typeof navigator)throw new z("It looks like you're running in a browser-like environment.\n\nThis is disabled by default, as it risks exposing your secret API credentials to attackers.\nIf you understand the risks and have appropriate mitigations in place,\nyou can set the `dangerouslyAllowBrowser` option to `true`, e.g.,\n\nnew Groq({ apiKey, dangerouslyAllowBrowser: true })");super({baseURL:r.baseURL,timeout:r.timeout??6e4,httpAgent:r.httpAgent,maxRetries:r.maxRetries,fetch:r.fetch}),this.completions=new de(this),this.chat=new fe(this),this.embeddings=new he(this),this.audio=new we(this),this.models=new ge(this),this._options=r,this.apiKey=t}defaultQuery(){return this._options.defaultQuery}defaultHeaders(e){return{...super.defaultHeaders(e),...this._options.defaultHeaders}}authHeaders(e){return{Authorization:`Bearer ${this.apiKey}`}}}be=Re,Re.Groq=be,Re.DEFAULT_TIMEOUT=6e4,Re.GroqError=z,Re.APIError=Y,Re.APIConnectionError=ee,Re.APIConnectionTimeoutError=te,Re.APIUserAbortError=Z,Re.NotFoundError=oe,Re.ConflictError=ie,Re.RateLimitError=ue,Re.BadRequestError=ne,Re.AuthenticationError=re,Re.InternalServerError=ce,Re.PermissionDeniedError=se,Re.UnprocessableEntityError=ae,Re.toFile=A,Re.fileFromPath=l;const{i7:xe,LG:ve,xX:Se,qA:Ee,cH:Ae,m_:De,fK:qe,OE:ke,v7:Le,v3:Ce,PO:Pe,Ll:Oe,Is:Ie}=t;!function(e){e.Completions=de,e.Chat=fe,e.Embeddings=he,e.Audio=we,e.Models=ge}(Re||(Re={}));let Te=[];new Re({dangerouslyAllowBrowser:!0,apiKey:config.GROQAPI});let $e=function(){let e=document.getElementById("todoListView"),t=document.getElementById("myTable");t&&t.remove();let n=document.createElement("TABLE");n.setAttribute("id","myTable"),n.className="table table-bordered";let r=document.createElement("TR");["Title","Description","Place","Due Date","Actions"].forEach((e=>{let t=document.createElement("TH");t.textContent=e,r.appendChild(t)})),n.appendChild(r);let s=document.getElementById("inputSearch"),o=document.getElementById("inputSearchFrom"),i=document.getElementById("inputSearchTo");Te.filter((function(e){return 0===o.value&&0===i.value?0<=Date.parse(e.dueDate)&&Date.parse(e.dueDate)<=864e13:0===o.value?0<=Date.parse(e.dueDate)&&Date.parse(e.dueDate)<=Date.parse(i.value):0===i.value?Date.parse(o.value)<=Date.parse(e.dueDate)&&Date.parse(e.dueDate)<=864e13:Date.parse(o.value)<=Date.parse(e.dueDate)&&Date.parse(e.dueDate)<=Date.parse(i.value)})).forEach(((e,t)=>{if(""===s.value||e.title.toLowerCase().includes(s.value.toLowerCase())||e.description.toLowerCase().includes(s.value.toLowerCase())){let r=document.createElement("TR"),s=document.createElement("TD");s.textContent=e.title,r.appendChild(s);let o=document.createElement("TD");o.textContent=e.description,r.appendChild(o);let i=document.createElement("TD");i.textContent=e.place,r.appendChild(i);let a=document.createElement("TD");a.textContent=e.dueDate,r.appendChild(a);let u=document.createElement("TD"),c=document.createElement("input");c.type="button",c.value="Delete",c.className="btn btn-xs btn-danger",c.addEventListener("click",(()=>Be(t))),u.appendChild(c),r.appendChild(u),n.appendChild(r)}})),e.appendChild(n)};setInterval($e,1e3);let Be=function(e){Te.splice(e,1),function(){let e=new XMLHttpRequest;e.onreadystatechange=()=>{e.readyState===XMLHttpRequest.DONE&&200===e.status&&console.log("List updated in JSONbin")},e.open("PUT",`https://api.jsonbin.io/v3/b/${config.BINID}`,!0),e.setRequestHeader("Content-Type","application/json"),e.setRequestHeader("X-Master-Key",config.XMasterKey),e.send(JSON.stringify(Te))}()};!function(){let e=new XMLHttpRequest;e.onreadystatechange=()=>{e.readyState===XMLHttpRequest.DONE&&200===e.status&&(Te=JSON.parse(e.responseText).record||[],$e())},e.open("GET",`https://api.jsonbin.io/v3/b/${config.BINID}/latest`,!0),e.setRequestHeader("X-Master-Key",config.XMasterKey),e.send()}()})();