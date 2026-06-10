"use strict";var ae=Object.create;var R=Object.defineProperty;var oe=Object.getOwnPropertyDescriptor;var ce=Object.getOwnPropertyNames;var pe=Object.getPrototypeOf,le=Object.prototype.hasOwnProperty;var ue=(e,t,s)=>t in e?R(e,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[t]=s;var me=(e,t,s,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of ce(t))!le.call(e,n)&&n!==s&&R(e,n,{get:()=>t[n],enumerable:!(r=oe(t,n))||r.enumerable});return e};var de=(e,t,s)=>(s=e!=null?ae(pe(e)):{},me(t||!e||!e.__esModule?R(s,"default",{value:e,enumerable:!0}):s,e));var O=(e,t,s)=>ue(e,typeof t!="symbol"?t+"":t,s);const d=require("electron"),l=require("node:path"),ge=require("node:module"),A=require("node:fs"),X=require("node:crypto"),fe=require("better-sqlite3");var w=typeof document<"u"?document.currentScript:null;const ye={lang:void 0,message:void 0,abortEarly:void 0,abortPipeEarly:void 0};function H(e){return ye}let L;function he(e){return L==null?void 0:L.get(e)}let C;function Te(e){return C==null?void 0:C.get(e)}let D;function ve(e,t){var s;return(s=D==null?void 0:D.get(e))==null?void 0:s.get(t)}function _(e){var s,r;const t=typeof e;return t==="string"?`"${e}"`:t==="number"||t==="bigint"||t==="boolean"?`${e}`:t==="object"||t==="function"?(e&&((r=(s=Object.getPrototypeOf(e))==null?void 0:s.constructor)==null?void 0:r.name))??"null":t}function g(e,t,s,r,n){const i=n&&"input"in n?n.input:s.value,a=(n==null?void 0:n.expected)??e.expects??null,o=(n==null?void 0:n.received)??_(i),p={kind:e.kind,type:e.type,input:i,expected:a,received:o,message:`Invalid ${t}: ${a?`Expected ${a} but r`:"R"}eceived ${o}`,requirement:e.requirement,path:n==null?void 0:n.path,issues:n==null?void 0:n.issues,lang:r.lang,abortEarly:r.abortEarly,abortPipeEarly:r.abortPipeEarly},u=e.kind==="schema",m=(n==null?void 0:n.message)??e.message??ve(e.reference,p.lang)??(u?Te(p.lang):null)??r.message??he(p.lang);m!==void 0&&(p.message=typeof m=="function"?m(p):m),u&&(s.typed=!1),s.issues?s.issues.push(p):s.issues=[p]}const W=new WeakMap;function h(e){let t=W.get(e);return t||(t={version:1,vendor:"valibot",validate(s){return e["~run"]({value:s},H())}},W.set(e,t)),t}function V(e,t){const s=[...new Set(e)];return s.length>1?`(${s.join(` ${t} `)})`:s[0]??"never"}var Ee=class extends Error{constructor(e){super(e[0].message),this.name="ValiError",this.issues=e}};function N(e,t){return{kind:"validation",type:"max_value",reference:N,async:!1,expects:`<=${e instanceof Date?e.toJSON():_(e)}`,requirement:e,message:t,"~run"(s,r){return s.typed&&!(s.value<=this.requirement)&&g(this,"value",s,r,{received:s.value instanceof Date?s.value.toJSON():_(s.value)}),s}}}function Y(e,t){return{kind:"validation",type:"min_length",reference:Y,async:!1,expects:`>=${e}`,requirement:e,message:t,"~run"(s,r){return s.typed&&s.value.length<this.requirement&&g(this,"length",s,r,{received:`${s.value.length}`}),s}}}function v(e,t){return{kind:"validation",type:"min_value",reference:v,async:!1,expects:`>=${e instanceof Date?e.toJSON():_(e)}`,requirement:e,message:t,"~run"(s,r){return s.typed&&!(s.value>=this.requirement)&&g(this,"value",s,r,{received:s.value instanceof Date?s.value.toJSON():_(s.value)}),s}}}function xe(e,t,s){return typeof e.fallback=="function"?e.fallback(t,s):e.fallback}function F(e,t,s){return typeof e.default=="function"?e.default(t,s):e.default}function S(e,t){return{kind:"schema",type:"array",reference:S,expects:"Array",async:!1,item:e,message:t,get"~standard"(){return h(this)},"~run"(s,r){var i;const n=s.value;if(Array.isArray(n)){s.typed=!0,s.value=[];for(let a=0;a<n.length;a++){const o=n[a],p=this.item["~run"]({value:o},r);if(p.issues){const u={type:"array",origin:"value",input:n,key:a,value:o};for(const m of p.issues)m.path?m.path.unshift(u):m.path=[u],(i=s.issues)==null||i.push(m);if(s.issues||(s.issues=p.issues),r.abortEarly){s.typed=!1;break}}p.typed||(s.typed=!1),s.value.push(p.value)}}else g(this,"type",s,r);return s}}}function U(e,t){return{kind:"schema",type:"nullable",reference:U,expects:`(${e.expects} | null)`,async:!1,wrapped:e,default:t,get"~standard"(){return h(this)},"~run"(s,r){return s.value===null&&(this.default!==void 0&&(s.value=F(this,s,r)),s.value===null)?(s.typed=!0,s):this.wrapped["~run"](s,r)}}}function T(e){return{kind:"schema",type:"number",reference:T,expects:"number",async:!1,message:e,get"~standard"(){return h(this)},"~run"(t,s){return typeof t.value=="number"&&!isNaN(t.value)?t.typed=!0:g(this,"type",t,s),t}}}function f(e,t){return{kind:"schema",type:"object",reference:f,expects:"Object",async:!1,entries:e,message:t,get"~standard"(){return h(this)},"~run"(s,r){var i;const n=s.value;if(n&&typeof n=="object"){s.typed=!0,s.value={};for(const a in this.entries){const o=this.entries[a];if(a in n||(o.type==="exact_optional"||o.type==="optional"||o.type==="nullish")&&o.default!==void 0){const p=a in n?n[a]:F(o),u=o["~run"]({value:p},r);if(u.issues){const m={type:"object",origin:"value",input:n,key:a,value:p};for(const x of u.issues)x.path?x.path.unshift(m):x.path=[m],(i=s.issues)==null||i.push(x);if(s.issues||(s.issues=u.issues),r.abortEarly){s.typed=!1;break}}u.typed||(s.typed=!1),s.value[a]=u.value}else if(o.fallback!==void 0)s.value[a]=xe(o);else if(o.type!=="exact_optional"&&o.type!=="optional"&&o.type!=="nullish"&&(g(this,"key",s,r,{input:void 0,expected:`"${a}"`,path:[{type:"object",origin:"key",input:n,key:a,value:n[a]}]}),r.abortEarly))break}}else g(this,"type",s,r);return s}}}function P(e,t){return{kind:"schema",type:"optional",reference:P,expects:`(${e.expects} | undefined)`,async:!1,wrapped:e,default:t,get"~standard"(){return h(this)},"~run"(s,r){return s.value===void 0&&(this.default!==void 0&&(s.value=F(this,s,r)),s.value===void 0)?(s.typed=!0,s):this.wrapped["~run"](s,r)}}}function y(e,t){return{kind:"schema",type:"picklist",reference:y,expects:V(e.map(_),"|"),async:!1,options:e,message:t,get"~standard"(){return h(this)},"~run"(s,r){return this.options.includes(s.value)?s.typed=!0:g(this,"type",s,r),s}}}function c(e){return{kind:"schema",type:"string",reference:c,expects:"string",async:!1,message:e,get"~standard"(){return h(this)},"~run"(t,s){return typeof t.value=="string"?t.typed=!0:g(this,"type",t,s),t}}}function B(e){let t;if(e)for(const s of e)if(t)for(const r of s.issues)t.push(r);else t=s.issues;return t}function z(e,t){return{kind:"schema",type:"union",reference:z,expects:V(e.map(s=>s.expects),"|"),async:!1,options:e,message:t,get"~standard"(){return h(this)},"~run"(s,r){let n,i,a;for(const o of this.options){const p=o["~run"]({value:s.value},r);if(p.typed)if(p.issues)i?i.push(p):i=[p];else{n=p;break}else a?a.push(p):a=[p]}if(n)return n;if(i){if(i.length===1)return i[0];g(this,"type",s,r,{issues:B(i)}),s.typed=!0}else{if((a==null?void 0:a.length)===1)return a[0];g(this,"type",s,r,{issues:B(a)})}return s}}}function $(e,t,s){const r=e["~run"]({value:t},H());if(r.issues)throw new Ee(r.issues);return r.value}function E(...e){return{...e[0],pipe:e,get"~standard"(){return h(this)},"~run"(t,s){for(const r of e)if(r.kind!=="metadata"){if(t.issues&&(r.kind==="schema"||r.kind==="transformation")){t.typed=!1;break}(!t.issues||!s.abortEarly&&!s.abortPipeEarly)&&(t=r["~run"](t,s))}return t}}}const _e=["toefl","ielts","cambridge"],Se=["reading","listening","writing","speaking"],Oe=["organization","grammarAndMechanics","languageAccuracy","developmentAndSupport"],K=y(_e),Q=y(Se),be=y(Oe),Z=y(["academic-discussion","email","legacy"]),Ne=f({role:y(["professor","student"]),name:c(),gender:y(["female","male"]),avatarUrl:c(),message:c()}),Ae=f({id:c(),title:c(),category:c(),examType:K,sectionType:Q,lastScore:U(T()),lastCompletedAt:U(c())});({...Ae.entries});const ee={id:c(),title:c(),category:c(),examType:K,sectionType:Q},Pe=f({...ee,type:P(Z,"legacy"),instructions:c(),question:c(),passage:c(),recommendedWordCount:c()}),Re=f({...ee,type:y(["academic-discussion","email"]),scenario:c(),discussion:P(f({professor:c(),studentA:c(),studentB:c()}))}),we=S(z([Pe,Re])),Le=f({promptId:c(),essayText:E(c(),Y(50))}),Ce=({codexReadinessService:e,promptCatalogService:t,attemptRepository:s,writingEvaluationService:r})=>{d.ipcMain.handle("codex-auth:get-status",()=>e.getStatus()),d.ipcMain.handle("codex-auth:sign-in",()=>e.signIn()),d.ipcMain.handle("prompt-catalog:list",()=>t.listPromptCatalog()),d.ipcMain.handle("prompt-catalog:get",(n,i)=>t.getPromptDetails(i)),d.ipcMain.handle("writing:submit",(n,i)=>r.submitAttempt($(Le,i))),d.ipcMain.handle("attempts:get",(n,i)=>s.getAttemptDetails(i))},De=f({criterion:be,label:c(),score:E(T(),v(0),N(5)),maxScore:E(T(),v(1),N(5)),comment:c()}),ke=f({id:c(),excerpt:c(),replacement:c(),category:y(["grammar-spelling","relevance","idiomatic-word-choice","elaboration"]),explanation:c(),alternatives:P(S(c()),[]),startOffset:E(T(),v(0)),endOffset:E(T(),v(0))}),Ie=f({overallScore:E(T(),v(0),N(6)),overallMaxScore:E(T(),v(1),N(6)),summary:c(),nextStep:c(),criterionScores:S(De),highlights:S(ke)}),Ue=()=>["Return valid JSON only.","Evaluate the writing using TOEFL®-style writing criteria.","Use this exact shape:","{",'  "overallScore": number,','  "overallMaxScore": 6,','  "summary": string,','  "nextStep": string,','  "criterionScores": [','    { "criterion": "organization" | "grammarAndMechanics" | "languageAccuracy" | "developmentAndSupport", "label": string, "score": number, "maxScore": 5, "comment": string }',"  ],",'  "highlights": [','    { "id": string, "excerpt": string, "replacement": string, "category": "grammar-spelling" | "relevance" | "idiomatic-word-choice" | "elaboration", "explanation": string, "alternatives": string[], "startOffset": number, "endOffset": number }',"  ]","}","If no useful highlight exists, return an empty highlights array.","Every highlight must include startOffset and endOffset from the student essay. Omit highlights when exact offsets are unclear."].join(`
`),Me=e=>e.replace(/<li>/gi,"- ").replace(/<\/li>/gi,`
`).replace(/<\/p>/gi,`

`).replace(/<br\s*\/?>/gi,`
`).replace(/<[^>]+>/g," ").replace(/\s+\n/g,`
`).replace(/\n{3,}/g,`

`).replace(/[ \t]{2,}/g," ").trim(),je=e=>{const t=[`Exam: ${e.prompt.examType.toUpperCase()}`,`Section: ${e.prompt.sectionType.toUpperCase()}`,`Category: ${e.prompt.category}`,`Prompt type: ${e.prompt.promptType}`,`Scenario: ${Me(e.prompt.scenario)}`];return e.prompt.discussionParticipants.length>0&&t.push("Discussion:",...e.prompt.discussionParticipants.map(s=>`${s.name} (${s.role}): ${s.message}`)),e.prompt.recommendedWordCount&&t.push(`Recommended length: ${e.prompt.recommendedWordCount}`),t},Fe=(e,t)=>[t.trim(),"",Ue(),"","Context:",...je(e),"","Student essay:",e.essayText,"","Keep the feedback concise, specific, and encouraging."].join(`
`),$e={type:"object",additionalProperties:!1,properties:{overallScore:{type:"number",minimum:0,maximum:6},overallMaxScore:{type:"number",minimum:1,maximum:6},summary:{type:"string"},nextStep:{type:"string"},criterionScores:{type:"array",items:{type:"object",additionalProperties:!1,properties:{criterion:{type:"string",enum:["organization","grammarAndMechanics","languageAccuracy","developmentAndSupport"]},label:{type:"string"},score:{type:"number",minimum:0,maximum:5},maxScore:{type:"number",minimum:1,maximum:5},comment:{type:"string"}},required:["criterion","label","score","maxScore","comment"]}},highlights:{type:"array",items:{type:"object",additionalProperties:!1,properties:{id:{type:"string"},excerpt:{type:"string"},replacement:{type:"string"},category:{type:"string",enum:["grammar-spelling","relevance","idiomatic-word-choice","elaboration"]},explanation:{type:"string"},alternatives:{type:"array",items:{type:"string"}},startOffset:{type:"number",minimum:0},endOffset:{type:"number",minimum:0}},required:["id","excerpt","replacement","category","explanation","alternatives","startOffset","endOffset"]}}},required:["overallScore","overallMaxScore","summary","nextStep","criterionScores","highlights"]},Xe=process.platform==="win32"?"codex.exe":"codex",We={"darwin:arm64":{packageName:"@openai/codex-darwin-arm64",targetTriple:"aarch64-apple-darwin"},"darwin:x64":{packageName:"@openai/codex-darwin-x64",targetTriple:"x86_64-apple-darwin"},"linux:arm64":{packageName:"@openai/codex-linux-arm64",targetTriple:"aarch64-unknown-linux-musl"},"linux:x64":{packageName:"@openai/codex-linux-x64",targetTriple:"x86_64-unknown-linux-musl"},"win32:arm64":{packageName:"@openai/codex-win32-arm64",targetTriple:"aarch64-pc-windows-msvc"},"win32:x64":{packageName:"@openai/codex-win32-x64",targetTriple:"x86_64-pc-windows-msvc"}},Be=ge.createRequire(typeof document>"u"?require("url").pathToFileURL(__filename).href:w&&w.tagName.toUpperCase()==="SCRIPT"&&w.src||new URL("main.js",document.baseURI).href),Je=e=>e.replace(`${l.sep}app.asar${l.sep}`,`${l.sep}app.asar.unpacked${l.sep}`),qe=()=>{const e=`${process.platform}:${process.arch}`,t=We[e];if(!t)return null;try{const s=Be.resolve(`${t.packageName}/package.json`),r=Je(l.dirname(s)),n=l.join(r,"vendor",t.targetTriple);return{executablePath:l.join(n,"bin",Xe),pathDirectory:l.join(n,"codex-path")}}catch{return null}},te=async()=>{const{Codex:e}=await import("@openai/codex-sdk"),t=qe();return t!=null&&t.executablePath.includes(`${l.sep}app.asar.unpacked${l.sep}`)?new e({codexPathOverride:t.executablePath,env:{...process.env,PATH:[t.pathDirectory,process.env.PATH].filter(Boolean).join(l.delimiter)}}):new e},Ge=()=>process.env.APP_ROOT??process.cwd(),He=()=>l.resolve(Ge(),"prompts/system/codex/writing-evaluation.md"),Ve=async()=>{const e=He();try{return await A.promises.readFile(e,"utf8")}catch{throw new Error(`Missing Codex system prompt file at ${e}. Create it before running writing evaluation.`)}},Ye="gpt-5.4-mini",ze="low",Ke=3e5,se=(e=process.env)=>{const t=Number(e.OPEN_PREP_CODEX_TIMEOUT_MS);return Number.isFinite(t)&&t>0?t:Ke},J=e=>typeof e=="number"&&Number.isFinite(e)&&e>=0,Qe=(e,t)=>{if(J(t.startOffset)&&J(t.endOffset))return{startOffset:t.startOffset,endOffset:Math.max(t.startOffset,t.endOffset)};if(typeof t.excerpt!="string"||t.excerpt.trim().length===0)return null;const s=e.indexOf(t.excerpt);return s<0?null:{startOffset:s,endOffset:s+t.excerpt.length}},Ze=(e,t)=>{if(!e||typeof e!="object")return e;const s=e,r=(Array.isArray(s.highlights),s.highlights);return Array.isArray(r)?{...s,highlights:r.flatMap(n=>{if(!n||typeof n!="object")return[];const i=n,a=Qe(t,i);return a?[{...i,alternatives:Array.isArray(i.alternatives)?i.alternatives:[],...a}]:[]})}:s};class et{constructor(){O(this,"id","codex")}async evaluateWriting(t){const s=await Ve(),r=Fe(t,s),i=(await te()).startThread({model:Ye,modelReasoningEffort:ze,skipGitRepoCheck:!0}),a=se(),o=new AbortController,p=setTimeout(()=>o.abort(),a);try{const u=await i.run(r,{outputSchema:$e,signal:o.signal}),m=Ze(JSON.parse(u.finalResponse),t.essayText);return $(Ie,m)}catch(u){throw o.signal.aborted?new Error(`Codex evaluation timed out after ${String(a)}ms.`):u}finally{clearTimeout(p)}}}const tt="gpt-5.4-mini",st="low";class rt{constructor(){O(this,"isAuthenticated",process.env.OPEN_PREP_AI_PROVIDER==="mock")}getStatus(){return{isAuthenticated:this.isAuthenticated}}async signIn(){if(process.env.OPEN_PREP_AI_PROVIDER==="mock")return this.isAuthenticated=!0,this.getStatus();const s=(await te()).startThread({model:tt,modelReasoningEffort:st,skipGitRepoCheck:!0}),r=se(),n=new AbortController,i=setTimeout(()=>n.abort(),r);try{return await s.run("Return JSON with ok set to true.",{outputSchema:{type:"object",additionalProperties:!1,properties:{ok:{type:"boolean"}},required:["ok"]},signal:n.signal}),this.isAuthenticated=!0,this.getStatus()}catch(a){throw this.isAuthenticated=!1,n.signal.aborted?new Error(`ChatGPT sign-in check timed out after ${String(r)}ms.`):a}finally{clearTimeout(i)}}}class nt{constructor(t){this.attemptRepository=t}listPromptCatalog(){return this.attemptRepository.listPromptSummaries()}getPromptDetails(t){return this.attemptRepository.getPromptDetails(t)}}const it=e=>({id:e.id,title:e.title,category:e.category,examType:e.exam_type,sectionType:e.section_type,lastScore:e.last_score,lastCompletedAt:e.last_completed_at}),at=(e,t)=>({id:e.id,title:e.title,category:e.category,examType:e.exam_type,sectionType:e.section_type,promptType:e.prompt_type,scenario:e.scenario_html,discussionParticipants:JSON.parse(e.discussion_json),instructions:e.instructions,question:e.question,passage:e.passage,recommendedWordCount:e.recommended_word_count,lastScore:(t==null?void 0:t.last_score)??null,lastCompletedAt:(t==null?void 0:t.last_completed_at)??null});class ot{constructor(t){this.database=t}listPromptSummaries(){return this.database.prepare(`
        SELECT
          prompts.id,
          prompts.title,
          prompts.category,
          prompts.exam_type,
          prompts.section_type,
          (
            SELECT evaluations.overall_score
            FROM attempts
            INNER JOIN evaluations ON evaluations.attempt_id = attempts.id
            WHERE attempts.prompt_id = prompts.id
            ORDER BY attempts.submitted_at DESC
            LIMIT 1
          ) AS last_score,
          (
            SELECT attempts.submitted_at
            FROM attempts
            INNER JOIN evaluations ON evaluations.attempt_id = attempts.id
            WHERE attempts.prompt_id = prompts.id
            ORDER BY attempts.submitted_at DESC
            LIMIT 1
          ) AS last_completed_at
        FROM prompts
        ORDER BY prompts.title ASC
      `).all().map(it)}getPromptDetails(t){const s=this.database.prepare("SELECT * FROM prompts WHERE id = ?").get(t);if(!s)throw new Error(`Prompt not found: ${t}`);const r=this.database.prepare(`
        SELECT
          prompts.id,
          prompts.title,
          prompts.category,
          prompts.exam_type,
          prompts.section_type,
          evaluations.overall_score AS last_score,
          attempts.submitted_at AS last_completed_at
        FROM prompts
        LEFT JOIN attempts ON attempts.prompt_id = prompts.id
        LEFT JOIN evaluations ON evaluations.attempt_id = attempts.id
        WHERE prompts.id = ?
        ORDER BY attempts.submitted_at DESC
        LIMIT 1
      `).get(t);return at(s,r)}createAttempt(t,s){const r=this.getPromptDetails(t.promptId),n=X.randomUUID(),i=new Date().toISOString();return this.database.prepare(`
          INSERT INTO attempts (id, prompt_id, essay_text, submitted_at, provider_type, status)
          VALUES (?, ?, ?, ?, ?, 'pending')
        `).run(n,t.promptId,t.essayText,i,s),{id:n,prompt:r,essayText:t.essayText,submittedAt:i,providerType:s,status:"pending",evaluation:null}}completeAttempt(t,s){const r=X.randomUUID(),n=new Date().toISOString();return this.database.prepare("UPDATE attempts SET status = 'completed' WHERE id = ?").run(t),this.database.prepare(`
          INSERT INTO evaluations (
            id,
            attempt_id,
            overall_score,
            overall_max_score,
            summary,
            next_step,
            payload_json,
            created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(r,t,s.overallScore,s.overallMaxScore,s.summary,s.nextStep,JSON.stringify(s),n),this.getAttemptDetails(t)}markAttemptFailed(t){this.database.prepare("UPDATE attempts SET status = 'failed' WHERE id = ?").run(t)}getAttemptDetails(t){const s=this.database.prepare("SELECT * FROM attempts WHERE id = ?").get(t);if(!s)throw new Error(`Attempt not found: ${t}`);const r=this.getPromptDetails(s.prompt_id),n=this.database.prepare("SELECT payload_json FROM evaluations WHERE attempt_id = ?").get(t);return{id:s.id,prompt:r,essayText:s.essay_text,submittedAt:s.submitted_at,providerType:s.provider_type,status:s.status,evaluation:n?JSON.parse(n.payload_json):null}}}const ct=()=>process.env.APP_ROOT??process.cwd(),pt=()=>l.resolve(ct(),"prompts","writing"),lt=e=>e.toLowerCase().endsWith(".json"),ut={female:["Dr. Maya Patel","Dr. Elena Brooks","Dr. Nina Alvarez","Dr. Rachel Kim","Dr. Sonia Bennett","Dr. Priya Shah"],male:["Dr. Marcus Bennett","Dr. Daniel Cho","Dr. Adrian Foster","Dr. Leo Ramirez","Dr. Victor Hall","Dr. Simon Carter"]},mt={female:["Ava","Nora","Jasmine","Lena","Tanya","Mila","Naomi","Sofia"],male:["Sam","Ethan","Leo","Noah","Owen","Mateo","Julian","Miles"]},dt={female:["/avatars/uifaces/125.jpg","/avatars/uifaces/128.jpg","/avatars/uifaces/217.jpg","/avatars/uifaces/219.jpg","/avatars/uifaces/220.jpg","/avatars/uifaces/221.jpg"],male:["/avatars/uifaces/80.jpg","/avatars/uifaces/92.jpg","/avatars/uifaces/218.jpg","/avatars/uifaces/222.jpg"]},gt=e=>e.replace(/<li>/gi,"- ").replace(/<\/li>/gi,`
`).replace(/<\/p>/gi,`

`).replace(/<br\s*\/?>/gi,`
`).replace(/<[^>]+>/g," ").replace(/&rsquo;/g,"'").replace(/&lsquo;/g,"'").replace(/&ldquo;/g,'"').replace(/&rdquo;/g,'"').replace(/&amp;/g,"&").replace(/\s+\n/g,`
`).replace(/\n{3,}/g,`

`).replace(/[ \t]{2,}/g," ").trim(),re=e=>Array.from(e).reduce((t,s)=>(t*31+s.charCodeAt(0))%2147483647,0),q=(e,t,s)=>{const r=re(t)%e.length;for(let n=0;n<e.length;n+=1){const i=e[(r+n)%e.length];if(!s.has(i))return s.add(i),i}return e[r]},k=e=>re(e)%2===0?"female":"male",I=(e,t,s,r,n,i)=>{const a=t==="professor"?ut[r]:mt[r],o=q(a,`${e}:${t}:name`,n),p=q(dt[r],`${e}:${t}:avatar`,i);return{role:t,name:o,gender:r,avatarUrl:p,message:s}},ft=e=>{const t=e.match(/at least (\d+) words?/i);if(t)return`${t[1]} words minimum`;const s=e.match(/(\d+)\s*-\s*(\d+) words?/i);return s?`${s[1]}-${s[2]} words`:""},yt=e=>{var a;const t=gt(e.scenario),s=e.type,r=[];if(e.type==="academic-discussion"&&e.discussion){const o=new Set,p=new Set,u=k(`${e.id}:professor`),m=k(`${e.id}:student-a`),x=k(`${e.id}:student-b`);r.push(I(e.id,"professor",e.discussion.professor,u,o,p),I(e.id,"student",e.discussion.studentA,m,o,p),I(e.id,"student",e.discussion.studentB,x,o,p))}const n=((a=r.find(o=>o.role==="professor"))==null?void 0:a.message)??"",i=r.filter(o=>o.role==="student").map(o=>`${o.name}: ${o.message}`).join(`

`);return{id:e.id,title:e.title,category:e.category,examType:e.examType,sectionType:e.sectionType,promptType:s,scenario:e.scenario,discussionParticipants:r,instructions:t,question:n,passage:i,recommendedWordCount:ft(t),lastScore:null,lastCompletedAt:null}},ht=e=>({id:e.id,title:e.title,category:e.category,examType:e.examType,sectionType:e.sectionType,promptType:"legacy",scenario:`<p>${e.instructions}</p>`,discussionParticipants:[],instructions:e.instructions,question:e.question,passage:e.passage,recommendedWordCount:e.recommendedWordCount,lastScore:null,lastCompletedAt:null}),Tt=e=>"scenario"in e?yt(e):ht(e),vt=()=>{const e=pt();if(!A.existsSync(e))throw new Error(`Writing prompts directory not found: ${e}`);const t=A.readdirSync(e).filter(lt).sort();if(t.length===0)throw new Error(`No writing prompt JSON files found in ${e}`);return t.flatMap(s=>{const r=l.join(e,s),n=A.readFileSync(r,"utf8");try{const i=JSON.parse(n);return $(we,i).map(Tt)}catch(i){const a=i instanceof Error?i.message:"Unknown validation error";throw new Error(`Invalid writing prompt file "${s}": ${a}`)}})},Et=e=>{const t=new Set(e.prepare("SELECT name FROM pragma_table_info('prompts')").all().map(s=>s.name));t.has("prompt_type")||e.exec("ALTER TABLE prompts ADD COLUMN prompt_type TEXT NOT NULL DEFAULT 'legacy'"),t.has("scenario_html")||e.exec("ALTER TABLE prompts ADD COLUMN scenario_html TEXT NOT NULL DEFAULT ''"),t.has("discussion_json")||e.exec("ALTER TABLE prompts ADD COLUMN discussion_json TEXT NOT NULL DEFAULT '[]'")},xt=e=>{e.exec(`
    CREATE TABLE IF NOT EXISTS prompts (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      exam_type TEXT NOT NULL,
      section_type TEXT NOT NULL,
      prompt_type TEXT NOT NULL DEFAULT 'legacy',
      scenario_html TEXT NOT NULL DEFAULT '',
      discussion_json TEXT NOT NULL DEFAULT '[]',
      instructions TEXT NOT NULL,
      question TEXT NOT NULL,
      passage TEXT NOT NULL,
      recommended_word_count TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS attempts (
      id TEXT PRIMARY KEY,
      prompt_id TEXT NOT NULL,
      essay_text TEXT NOT NULL,
      submitted_at TEXT NOT NULL,
      provider_type TEXT NOT NULL,
      status TEXT NOT NULL,
      FOREIGN KEY (prompt_id) REFERENCES prompts (id)
    );

    CREATE TABLE IF NOT EXISTS evaluations (
      id TEXT PRIMARY KEY,
      attempt_id TEXT NOT NULL UNIQUE,
      overall_score REAL NOT NULL,
      overall_max_score REAL NOT NULL,
      summary TEXT NOT NULL,
      next_step TEXT NOT NULL,
      payload_json TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (attempt_id) REFERENCES attempts (id)
    );
  `),Et(e)},_t=e=>{const t=e.prepare(`
    INSERT INTO prompts (
      id,
      title,
      category,
      exam_type,
      section_type,
      prompt_type,
      scenario_html,
      discussion_json,
      instructions,
      question,
      passage,
      recommended_word_count
    ) VALUES (
      @id,
      @title,
      @category,
      @examType,
      @sectionType,
      @promptType,
      @scenario,
      @discussionParticipantsJson,
      @instructions,
      @question,
      @passage,
      @recommendedWordCount
    )
    ON CONFLICT(id) DO UPDATE SET
      title = excluded.title,
      category = excluded.category,
      exam_type = excluded.exam_type,
      section_type = excluded.section_type,
      prompt_type = excluded.prompt_type,
      scenario_html = excluded.scenario_html,
      discussion_json = excluded.discussion_json,
      instructions = excluded.instructions,
      question = excluded.question,
      passage = excluded.passage,
      recommended_word_count = excluded.recommended_word_count
  `),s=vt();e.transaction(()=>{s.forEach(n=>{t.run({...n,discussionParticipantsJson:JSON.stringify(n.discussionParticipants)})})})()},St=e=>{const t=l.join(e.getPath("userData"),"open-prep.db"),s=new fe(t);return xt(s),_t(s),s};class Ot{constructor(){O(this,"id","mock")}async evaluateWriting(t){const s=t.essayText.slice(0,Math.min(t.essayText.length,32));return{overallScore:4,overallMaxScore:6,summary:"Your response is organized and readable, but it still needs more precise vocabulary and stronger support for the main claim.",nextStep:"Add one concrete example and replace at least two informal phrases with more academic wording.",criterionScores:[{criterion:"organization",label:"Organization",score:5,maxScore:5,comment:"The response follows a clear structure and moves logically from the main claim to supporting points."},{criterion:"grammarAndMechanics",label:"Grammar & Mechanics",score:5,maxScore:5,comment:"Grammar is generally correct and sentence boundaries are controlled well throughout the response."},{criterion:"languageAccuracy",label:"Language Accuracy",score:3,maxScore:5,comment:"The language is understandable, but the vocabulary range is limited and several choices sound informal for TOEFL® writing."},{criterion:"developmentAndSupport",label:"Development & Support",score:2,maxScore:5,comment:"The response states a position, but it would benefit from more specific evidence and a fuller explanation of the reasoning."}],highlights:[{id:"mock-highlight-1",excerpt:s,replacement:"particularly",category:"idiomatic-word-choice",explanation:"This phrase can sound too conversational for an academic response. A more precise adverb keeps the tone formal.",alternatives:["particularly","notably","especially","significantly"],startOffset:0,endOffset:Math.min(6,t.essayText.length)}]}}}const bt=()=>process.env.OPEN_PREP_AI_PROVIDER==="mock"?new Ot:new et;class Nt{constructor(t,s){O(this,"provider",bt());this.promptCatalogService=t,this.attemptRepository=s}async submitAttempt(t){const s=this.promptCatalogService.getPromptDetails(t.promptId),r=this.attemptRepository.createAttempt(t,this.provider.id);try{const n=await this.provider.evaluateWriting({prompt:s,essayText:t.essayText});return this.attemptRepository.completeAttempt(r.id,n)}catch(n){throw this.attemptRepository.markAttemptFailed(r.id),n}}}const ne=__dirname;process.env.APP_ROOT=l.join(ne,"..");const{VITE_DEV_SERVER_URL:M}=process.env,j=l.join(process.env.APP_ROOT,"dist"),ie="OpenPrep";process.env.VITE_PUBLIC=M?l.join(process.env.APP_ROOT,"public"):j;let b=null;const G=()=>{const e=process.env.VITE_PUBLIC??j,t=l.join(e,"logo/logo_icon_only.svg");b=new d.BrowserWindow({width:1440,height:1024,minWidth:1200,minHeight:820,backgroundColor:"#f5f3ef",title:ie,icon:t,webPreferences:{preload:l.join(ne,"preload.js"),contextIsolation:!0,nodeIntegration:!1}}),M?(b.loadURL(M),b.webContents.openDevTools({mode:"detach"})):b.loadFile(l.join(j,"index.html"))};d.app.whenReady().then(()=>{d.app.setName(ie);const e=St(d.app),t=new ot(e),s=new rt,r=new nt(t),n=new Nt(r,t);Ce({codexReadinessService:s,promptCatalogService:r,attemptRepository:t,writingEvaluationService:n}),G(),d.app.on("activate",()=>{d.BrowserWindow.getAllWindows().length===0&&G()})});d.app.on("window-all-closed",()=>{process.platform!=="darwin"&&(d.app.quit(),b=null)});
