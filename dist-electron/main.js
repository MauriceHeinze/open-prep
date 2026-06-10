"use strict";var ue=Object.create;var w=Object.defineProperty;var me=Object.getOwnPropertyDescriptor;var de=Object.getOwnPropertyNames;var ge=Object.getPrototypeOf,fe=Object.prototype.hasOwnProperty;var ye=(e,t,s)=>t in e?w(e,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[t]=s;var he=(e,t,s,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of de(t))!fe.call(e,r)&&r!==s&&w(e,r,{get:()=>t[r],enumerable:!(n=me(t,r))||n.enumerable});return e};var Te=(e,t,s)=>(s=e!=null?ue(ge(e)):{},he(t||!e||!e.__esModule?w(s,"default",{value:e,enumerable:!0}):s,e));var O=(e,t,s)=>ye(e,typeof t!="symbol"?t+"":t,s);const d=require("electron"),l=require("node:path"),ve=require("node:child_process"),Ee=require("node:module"),N=require("node:fs"),W=require("node:crypto"),xe=require("better-sqlite3");var R=typeof document<"u"?document.currentScript:null;const _e={lang:void 0,message:void 0,abortEarly:void 0,abortPipeEarly:void 0};function Y(e){return _e}let L;function Se(e){return L==null?void 0:L.get(e)}let C;function Oe(e){return C==null?void 0:C.get(e)}let D;function be(e,t){var s;return(s=D==null?void 0:D.get(e))==null?void 0:s.get(t)}function _(e){var s,n;const t=typeof e;return t==="string"?`"${e}"`:t==="number"||t==="bigint"||t==="boolean"?`${e}`:t==="object"||t==="function"?(e&&((n=(s=Object.getPrototypeOf(e))==null?void 0:s.constructor)==null?void 0:n.name))??"null":t}function g(e,t,s,n,r){const i=r&&"input"in r?r.input:s.value,a=(r==null?void 0:r.expected)??e.expects??null,o=(r==null?void 0:r.received)??_(i),p={kind:e.kind,type:e.type,input:i,expected:a,received:o,message:`Invalid ${t}: ${a?`Expected ${a} but r`:"R"}eceived ${o}`,requirement:e.requirement,path:r==null?void 0:r.path,issues:r==null?void 0:r.issues,lang:n.lang,abortEarly:n.abortEarly,abortPipeEarly:n.abortPipeEarly},u=e.kind==="schema",m=(r==null?void 0:r.message)??e.message??be(e.reference,p.lang)??(u?Oe(p.lang):null)??n.message??Se(p.lang);m!==void 0&&(p.message=typeof m=="function"?m(p):m),u&&(s.typed=!1),s.issues?s.issues.push(p):s.issues=[p]}const B=new WeakMap;function h(e){let t=B.get(e);return t||(t={version:1,vendor:"valibot",validate(s){return e["~run"]({value:s},Y())}},B.set(e,t)),t}function z(e,t){const s=[...new Set(e)];return s.length>1?`(${s.join(` ${t} `)})`:s[0]??"never"}var Ae=class extends Error{constructor(e){super(e[0].message),this.name="ValiError",this.issues=e}};function A(e,t){return{kind:"validation",type:"max_value",reference:A,async:!1,expects:`<=${e instanceof Date?e.toJSON():_(e)}`,requirement:e,message:t,"~run"(s,n){return s.typed&&!(s.value<=this.requirement)&&g(this,"value",s,n,{received:s.value instanceof Date?s.value.toJSON():_(s.value)}),s}}}function K(e,t){return{kind:"validation",type:"min_length",reference:K,async:!1,expects:`>=${e}`,requirement:e,message:t,"~run"(s,n){return s.typed&&s.value.length<this.requirement&&g(this,"length",s,n,{received:`${s.value.length}`}),s}}}function E(e,t){return{kind:"validation",type:"min_value",reference:E,async:!1,expects:`>=${e instanceof Date?e.toJSON():_(e)}`,requirement:e,message:t,"~run"(s,n){return s.typed&&!(s.value>=this.requirement)&&g(this,"value",s,n,{received:s.value instanceof Date?s.value.toJSON():_(s.value)}),s}}}function Ne(e,t,s){return typeof e.fallback=="function"?e.fallback(t,s):e.fallback}function $(e,t,s){return typeof e.default=="function"?e.default(t,s):e.default}function S(e,t){return{kind:"schema",type:"array",reference:S,expects:"Array",async:!1,item:e,message:t,get"~standard"(){return h(this)},"~run"(s,n){var i;const r=s.value;if(Array.isArray(r)){s.typed=!0,s.value=[];for(let a=0;a<r.length;a++){const o=r[a],p=this.item["~run"]({value:o},n);if(p.issues){const u={type:"array",origin:"value",input:r,key:a,value:o};for(const m of p.issues)m.path?m.path.unshift(u):m.path=[u],(i=s.issues)==null||i.push(m);if(s.issues||(s.issues=p.issues),n.abortEarly){s.typed=!1;break}}p.typed||(s.typed=!1),s.value.push(p.value)}}else g(this,"type",s,n);return s}}}function U(e,t){return{kind:"schema",type:"nullable",reference:U,expects:`(${e.expects} | null)`,async:!1,wrapped:e,default:t,get"~standard"(){return h(this)},"~run"(s,n){return s.value===null&&(this.default!==void 0&&(s.value=$(this,s,n)),s.value===null)?(s.typed=!0,s):this.wrapped["~run"](s,n)}}}function v(e){return{kind:"schema",type:"number",reference:v,expects:"number",async:!1,message:e,get"~standard"(){return h(this)},"~run"(t,s){return typeof t.value=="number"&&!isNaN(t.value)?t.typed=!0:g(this,"type",t,s),t}}}function f(e,t){return{kind:"schema",type:"object",reference:f,expects:"Object",async:!1,entries:e,message:t,get"~standard"(){return h(this)},"~run"(s,n){var i;const r=s.value;if(r&&typeof r=="object"){s.typed=!0,s.value={};for(const a in this.entries){const o=this.entries[a];if(a in r||(o.type==="exact_optional"||o.type==="optional"||o.type==="nullish")&&o.default!==void 0){const p=a in r?r[a]:$(o),u=o["~run"]({value:p},n);if(u.issues){const m={type:"object",origin:"value",input:r,key:a,value:p};for(const T of u.issues)T.path?T.path.unshift(m):T.path=[m],(i=s.issues)==null||i.push(T);if(s.issues||(s.issues=u.issues),n.abortEarly){s.typed=!1;break}}u.typed||(s.typed=!1),s.value[a]=u.value}else if(o.fallback!==void 0)s.value[a]=Ne(o);else if(o.type!=="exact_optional"&&o.type!=="optional"&&o.type!=="nullish"&&(g(this,"key",s,n,{input:void 0,expected:`"${a}"`,path:[{type:"object",origin:"key",input:r,key:a,value:r[a]}]}),n.abortEarly))break}}else g(this,"type",s,n);return s}}}function P(e,t){return{kind:"schema",type:"optional",reference:P,expects:`(${e.expects} | undefined)`,async:!1,wrapped:e,default:t,get"~standard"(){return h(this)},"~run"(s,n){return s.value===void 0&&(this.default!==void 0&&(s.value=$(this,s,n)),s.value===void 0)?(s.typed=!0,s):this.wrapped["~run"](s,n)}}}function y(e,t){return{kind:"schema",type:"picklist",reference:y,expects:z(e.map(_),"|"),async:!1,options:e,message:t,get"~standard"(){return h(this)},"~run"(s,n){return this.options.includes(s.value)?s.typed=!0:g(this,"type",s,n),s}}}function c(e){return{kind:"schema",type:"string",reference:c,expects:"string",async:!1,message:e,get"~standard"(){return h(this)},"~run"(t,s){return typeof t.value=="string"?t.typed=!0:g(this,"type",t,s),t}}}function J(e){let t;if(e)for(const s of e)if(t)for(const n of s.issues)t.push(n);else t=s.issues;return t}function Q(e,t){return{kind:"schema",type:"union",reference:Q,expects:z(e.map(s=>s.expects),"|"),async:!1,options:e,message:t,get"~standard"(){return h(this)},"~run"(s,n){let r,i,a;for(const o of this.options){const p=o["~run"]({value:s.value},n);if(p.typed)if(p.issues)i?i.push(p):i=[p];else{r=p;break}else a?a.push(p):a=[p]}if(r)return r;if(i){if(i.length===1)return i[0];g(this,"type",s,n,{issues:J(i)}),s.typed=!0}else{if((a==null?void 0:a.length)===1)return a[0];g(this,"type",s,n,{issues:J(a)})}return s}}}function X(e,t,s){const n=e["~run"]({value:t},Y());if(n.issues)throw new Ae(n.issues);return n.value}function x(...e){return{...e[0],pipe:e,get"~standard"(){return h(this)},"~run"(t,s){for(const n of e)if(n.kind!=="metadata"){if(t.issues&&(n.kind==="schema"||n.kind==="transformation")){t.typed=!1;break}(!t.issues||!s.abortEarly&&!s.abortPipeEarly)&&(t=n["~run"](t,s))}return t}}}const Pe=["toefl","ielts","cambridge"],we=["reading","listening","writing","speaking"],Re=["organization","grammarAndMechanics","languageAccuracy","developmentAndSupport"],Z=y(Pe),ee=y(we),Le=y(Re),te=y(["academic-discussion","email","legacy"]),Ce=f({role:y(["professor","student"]),name:c(),gender:y(["female","male"]),avatarUrl:c(),message:c()}),De=f({id:c(),title:c(),category:c(),examType:Z,sectionType:ee,lastScore:U(v()),lastCompletedAt:U(c())});({...De.entries});const se={id:c(),title:c(),category:c(),examType:Z,sectionType:ee},Ie=f({...se,type:P(te,"legacy"),instructions:c(),question:c(),passage:c(),recommendedWordCount:c()}),ke=f({...se,type:y(["academic-discussion","email"]),scenario:c(),discussion:P(f({professor:c(),studentA:c(),studentB:c()}))}),Ue=S(Q([Ie,ke])),Me=f({promptId:c(),essayText:x(c(),K(50))}),je=({codexReadinessService:e,promptCatalogService:t,attemptRepository:s,writingEvaluationService:n})=>{d.ipcMain.handle("codex-auth:get-status",()=>e.getStatus()),d.ipcMain.handle("codex-auth:sign-in",()=>e.signIn()),d.ipcMain.handle("prompt-catalog:list",()=>t.listPromptCatalog()),d.ipcMain.handle("prompt-catalog:get",(r,i)=>t.getPromptDetails(i)),d.ipcMain.handle("writing:submit",(r,i)=>n.submitAttempt(X(Me,i))),d.ipcMain.handle("attempts:get",(r,i)=>s.getAttemptDetails(i))},Fe=f({criterion:Le,label:c(),score:x(v(),E(0),A(5)),maxScore:x(v(),E(1),A(5)),comment:c()}),$e=f({id:c(),excerpt:c(),replacement:c(),category:y(["grammar-spelling","relevance","idiomatic-word-choice","elaboration"]),explanation:c(),alternatives:P(S(c()),[]),startOffset:x(v(),E(0)),endOffset:x(v(),E(0))}),Xe=f({overallScore:x(v(),E(0),A(6)),overallMaxScore:x(v(),E(1),A(6)),summary:c(),nextStep:c(),criterionScores:S(Fe),highlights:S($e)}),We=()=>["Return valid JSON only.","Evaluate the writing using TOEFL®-style writing criteria.","Use this exact shape:","{",'  "overallScore": number,','  "overallMaxScore": 6,','  "summary": string,','  "nextStep": string,','  "criterionScores": [','    { "criterion": "organization" | "grammarAndMechanics" | "languageAccuracy" | "developmentAndSupport", "label": string, "score": number, "maxScore": 5, "comment": string }',"  ],",'  "highlights": [','    { "id": string, "excerpt": string, "replacement": string, "category": "grammar-spelling" | "relevance" | "idiomatic-word-choice" | "elaboration", "explanation": string, "alternatives": string[], "startOffset": number, "endOffset": number }',"  ]","}","If no useful highlight exists, return an empty highlights array.","Every highlight must include startOffset and endOffset from the student essay. Omit highlights when exact offsets are unclear."].join(`
`),Be=e=>e.replace(/<li>/gi,"- ").replace(/<\/li>/gi,`
`).replace(/<\/p>/gi,`

`).replace(/<br\s*\/?>/gi,`
`).replace(/<[^>]+>/g," ").replace(/\s+\n/g,`
`).replace(/\n{3,}/g,`

`).replace(/[ \t]{2,}/g," ").trim(),Je=e=>{const t=[`Exam: ${e.prompt.examType.toUpperCase()}`,`Section: ${e.prompt.sectionType.toUpperCase()}`,`Category: ${e.prompt.category}`,`Prompt type: ${e.prompt.promptType}`,`Scenario: ${Be(e.prompt.scenario)}`];return e.prompt.discussionParticipants.length>0&&t.push("Discussion:",...e.prompt.discussionParticipants.map(s=>`${s.name} (${s.role}): ${s.message}`)),e.prompt.recommendedWordCount&&t.push(`Recommended length: ${e.prompt.recommendedWordCount}`),t},qe=(e,t)=>[t.trim(),"",We(),"","Context:",...Je(e),"","Student essay:",e.essayText,"","Keep the feedback concise, specific, and encouraging."].join(`
`),Ve={type:"object",additionalProperties:!1,properties:{overallScore:{type:"number",minimum:0,maximum:6},overallMaxScore:{type:"number",minimum:1,maximum:6},summary:{type:"string"},nextStep:{type:"string"},criterionScores:{type:"array",items:{type:"object",additionalProperties:!1,properties:{criterion:{type:"string",enum:["organization","grammarAndMechanics","languageAccuracy","developmentAndSupport"]},label:{type:"string"},score:{type:"number",minimum:0,maximum:5},maxScore:{type:"number",minimum:1,maximum:5},comment:{type:"string"}},required:["criterion","label","score","maxScore","comment"]}},highlights:{type:"array",items:{type:"object",additionalProperties:!1,properties:{id:{type:"string"},excerpt:{type:"string"},replacement:{type:"string"},category:{type:"string",enum:["grammar-spelling","relevance","idiomatic-word-choice","elaboration"]},explanation:{type:"string"},alternatives:{type:"array",items:{type:"string"}},startOffset:{type:"number",minimum:0},endOffset:{type:"number",minimum:0}},required:["id","excerpt","replacement","category","explanation","alternatives","startOffset","endOffset"]}}},required:["overallScore","overallMaxScore","summary","nextStep","criterionScores","highlights"]},Ge=process.platform==="win32"?"codex.exe":"codex",He={"darwin:arm64":{packageName:"@openai/codex-darwin-arm64",targetTriple:"aarch64-apple-darwin"},"darwin:x64":{packageName:"@openai/codex-darwin-x64",targetTriple:"x86_64-apple-darwin"},"linux:arm64":{packageName:"@openai/codex-linux-arm64",targetTriple:"aarch64-unknown-linux-musl"},"linux:x64":{packageName:"@openai/codex-linux-x64",targetTriple:"x86_64-unknown-linux-musl"},"win32:arm64":{packageName:"@openai/codex-win32-arm64",targetTriple:"aarch64-pc-windows-msvc"},"win32:x64":{packageName:"@openai/codex-win32-x64",targetTriple:"x86_64-pc-windows-msvc"}},ne=Ee.createRequire(typeof document>"u"?require("url").pathToFileURL(__filename).href:R&&R.tagName.toUpperCase()==="SCRIPT"&&R.src||new URL("main.js",document.baseURI).href),re=e=>e.replace(`${l.sep}app.asar${l.sep}`,`${l.sep}app.asar.unpacked${l.sep}`),M=e=>{const t=Object.fromEntries(Object.entries(process.env).filter(s=>s[1]!==void 0));return e&&(t.PATH=[e,process.env.PATH].filter(Boolean).join(l.delimiter)),t},ie=()=>{const e=`${process.platform}:${process.arch}`,t=He[e];if(!t)return null;try{const s=ne.resolve(`${t.packageName}/package.json`),n=re(l.dirname(s)),r=l.join(n,"vendor",t.targetTriple);return{executablePath:l.join(r,"bin",Ge),pathDirectory:l.join(r,"codex-path")}}catch{return null}},Ye=()=>{const e=ie();return e?{command:e.executablePath,argsPrefix:[],env:M(e.pathDirectory)}:{command:process.execPath,argsPrefix:[re(ne.resolve("@openai/codex/bin/codex.js"))],env:M()}},ze=async()=>{const{Codex:e}=await import("@openai/codex-sdk"),t=ie();return t!=null&&t.executablePath.includes(`${l.sep}app.asar.unpacked${l.sep}`)?new e({codexPathOverride:t.executablePath,env:M(t.pathDirectory)}):new e},Ke=()=>process.env.APP_ROOT??process.cwd(),Qe=()=>l.resolve(Ke(),"prompts/system/codex/writing-evaluation.md"),Ze=async()=>{const e=Qe();try{return await N.promises.readFile(e,"utf8")}catch{throw new Error(`Missing Codex system prompt file at ${e}. Create it before running writing evaluation.`)}},et="gpt-5.4-mini",tt="low",st=3e5,ae=(e=process.env)=>{const t=Number(e.OPEN_PREP_CODEX_TIMEOUT_MS);return Number.isFinite(t)&&t>0?t:st},q=e=>typeof e=="number"&&Number.isFinite(e)&&e>=0,nt=(e,t)=>{if(q(t.startOffset)&&q(t.endOffset))return{startOffset:t.startOffset,endOffset:Math.max(t.startOffset,t.endOffset)};if(typeof t.excerpt!="string"||t.excerpt.trim().length===0)return null;const s=e.indexOf(t.excerpt);return s<0?null:{startOffset:s,endOffset:s+t.excerpt.length}},rt=(e,t)=>{if(!e||typeof e!="object")return e;const s=e,n=(Array.isArray(s.highlights),s.highlights);return Array.isArray(n)?{...s,highlights:n.flatMap(r=>{if(!r||typeof r!="object")return[];const i=r,a=nt(t,i);return a?[{...i,alternatives:Array.isArray(i.alternatives)?i.alternatives:[],...a}]:[]})}:s};class it{constructor(){O(this,"id","codex")}async evaluateWriting(t){const s=await Ze(),n=qe(t,s),i=(await ze()).startThread({model:et,modelReasoningEffort:tt,skipGitRepoCheck:!0}),a=ae(),o=new AbortController,p=setTimeout(()=>o.abort(),a);try{const u=await i.run(n,{outputSchema:Ve,signal:o.signal}),m=rt(JSON.parse(u.finalResponse),t.essayText);return X(Xe,m)}catch(u){throw o.signal.aborted?new Error(`Codex evaluation timed out after ${String(a)}ms.`):u}finally{clearTimeout(p)}}}const at=1e4,V=async(e,t)=>{const{command:s,argsPrefix:n,env:r}=Ye(),i=new AbortController;let a=!1;const o=setTimeout(()=>{a=!0,i.abort()},t);try{return await new Promise((p,u)=>{ve.execFile(s,[...n,...e],{env:r,signal:i.signal,timeout:t},(m,T,le)=>{if(a){u(new Error(`Codex command timed out after ${String(t)}ms.`));return}if(m){u(m);return}p(`${String(T)}${String(le)}`)})})}finally{clearTimeout(o)}};class ot{constructor(){O(this,"isAuthenticated",process.env.OPEN_PREP_AI_PROVIDER==="mock")}async getStatus(){if(process.env.OPEN_PREP_AI_PROVIDER==="mock")return this.isAuthenticated=!0,{isAuthenticated:this.isAuthenticated};try{await V(["login","status"],at),this.isAuthenticated=!0}catch{this.isAuthenticated=!1}return{isAuthenticated:this.isAuthenticated}}async signIn(){if(process.env.OPEN_PREP_AI_PROVIDER==="mock")return this.isAuthenticated=!0,this.getStatus();const t=ae();try{return await V(["login"],t),this.isAuthenticated=!0,await this.getStatus()}catch(s){throw this.isAuthenticated=!1,s instanceof Error&&s.message.includes("timed out")?new Error(`ChatGPT sign-in check timed out after ${String(t)}ms.`):s}}}class ct{constructor(t){this.attemptRepository=t}listPromptCatalog(){return this.attemptRepository.listPromptSummaries()}getPromptDetails(t){return this.attemptRepository.getPromptDetails(t)}}const pt=e=>({id:e.id,title:e.title,category:e.category,examType:e.exam_type,sectionType:e.section_type,lastScore:e.last_score,lastCompletedAt:e.last_completed_at}),lt=(e,t)=>({id:e.id,title:e.title,category:e.category,examType:e.exam_type,sectionType:e.section_type,promptType:e.prompt_type,scenario:e.scenario_html,discussionParticipants:JSON.parse(e.discussion_json),instructions:e.instructions,question:e.question,passage:e.passage,recommendedWordCount:e.recommended_word_count,lastScore:(t==null?void 0:t.last_score)??null,lastCompletedAt:(t==null?void 0:t.last_completed_at)??null});class ut{constructor(t){this.database=t}listPromptSummaries(){return this.database.prepare(`
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
      `).all().map(pt)}getPromptDetails(t){const s=this.database.prepare("SELECT * FROM prompts WHERE id = ?").get(t);if(!s)throw new Error(`Prompt not found: ${t}`);const n=this.database.prepare(`
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
      `).get(t);return lt(s,n)}createAttempt(t,s){const n=this.getPromptDetails(t.promptId),r=W.randomUUID(),i=new Date().toISOString();return this.database.prepare(`
          INSERT INTO attempts (id, prompt_id, essay_text, submitted_at, provider_type, status)
          VALUES (?, ?, ?, ?, ?, 'pending')
        `).run(r,t.promptId,t.essayText,i,s),{id:r,prompt:n,essayText:t.essayText,submittedAt:i,providerType:s,status:"pending",evaluation:null}}completeAttempt(t,s){const n=W.randomUUID(),r=new Date().toISOString();return this.database.prepare("UPDATE attempts SET status = 'completed' WHERE id = ?").run(t),this.database.prepare(`
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
        `).run(n,t,s.overallScore,s.overallMaxScore,s.summary,s.nextStep,JSON.stringify(s),r),this.getAttemptDetails(t)}markAttemptFailed(t){this.database.prepare("UPDATE attempts SET status = 'failed' WHERE id = ?").run(t)}getAttemptDetails(t){const s=this.database.prepare("SELECT * FROM attempts WHERE id = ?").get(t);if(!s)throw new Error(`Attempt not found: ${t}`);const n=this.getPromptDetails(s.prompt_id),r=this.database.prepare("SELECT payload_json FROM evaluations WHERE attempt_id = ?").get(t);return{id:s.id,prompt:n,essayText:s.essay_text,submittedAt:s.submitted_at,providerType:s.provider_type,status:s.status,evaluation:r?JSON.parse(r.payload_json):null}}}const mt=()=>process.env.APP_ROOT??process.cwd(),dt=()=>l.resolve(mt(),"prompts","writing"),gt=e=>e.toLowerCase().endsWith(".json"),ft={female:["Dr. Maya Patel","Dr. Elena Brooks","Dr. Nina Alvarez","Dr. Rachel Kim","Dr. Sonia Bennett","Dr. Priya Shah"],male:["Dr. Marcus Bennett","Dr. Daniel Cho","Dr. Adrian Foster","Dr. Leo Ramirez","Dr. Victor Hall","Dr. Simon Carter"]},yt={female:["Ava","Nora","Jasmine","Lena","Tanya","Mila","Naomi","Sofia"],male:["Sam","Ethan","Leo","Noah","Owen","Mateo","Julian","Miles"]},ht={female:["/avatars/uifaces/125.jpg","/avatars/uifaces/128.jpg","/avatars/uifaces/217.jpg","/avatars/uifaces/219.jpg","/avatars/uifaces/220.jpg","/avatars/uifaces/221.jpg"],male:["/avatars/uifaces/80.jpg","/avatars/uifaces/92.jpg","/avatars/uifaces/218.jpg","/avatars/uifaces/222.jpg"]},Tt=e=>e.replace(/<li>/gi,"- ").replace(/<\/li>/gi,`
`).replace(/<\/p>/gi,`

`).replace(/<br\s*\/?>/gi,`
`).replace(/<[^>]+>/g," ").replace(/&rsquo;/g,"'").replace(/&lsquo;/g,"'").replace(/&ldquo;/g,'"').replace(/&rdquo;/g,'"').replace(/&amp;/g,"&").replace(/\s+\n/g,`
`).replace(/\n{3,}/g,`

`).replace(/[ \t]{2,}/g," ").trim(),oe=e=>Array.from(e).reduce((t,s)=>(t*31+s.charCodeAt(0))%2147483647,0),G=(e,t,s)=>{const n=oe(t)%e.length;for(let r=0;r<e.length;r+=1){const i=e[(n+r)%e.length];if(!s.has(i))return s.add(i),i}return e[n]},I=e=>oe(e)%2===0?"female":"male",k=(e,t,s,n,r,i)=>{const a=t==="professor"?ft[n]:yt[n],o=G(a,`${e}:${t}:name`,r),p=G(ht[n],`${e}:${t}:avatar`,i);return{role:t,name:o,gender:n,avatarUrl:p,message:s}},vt=e=>{const t=e.match(/at least (\d+) words?/i);if(t)return`${t[1]} words minimum`;const s=e.match(/(\d+)\s*-\s*(\d+) words?/i);return s?`${s[1]}-${s[2]} words`:""},Et=e=>{var a;const t=Tt(e.scenario),s=e.type,n=[];if(e.type==="academic-discussion"&&e.discussion){const o=new Set,p=new Set,u=I(`${e.id}:professor`),m=I(`${e.id}:student-a`),T=I(`${e.id}:student-b`);n.push(k(e.id,"professor",e.discussion.professor,u,o,p),k(e.id,"student",e.discussion.studentA,m,o,p),k(e.id,"student",e.discussion.studentB,T,o,p))}const r=((a=n.find(o=>o.role==="professor"))==null?void 0:a.message)??"",i=n.filter(o=>o.role==="student").map(o=>`${o.name}: ${o.message}`).join(`

`);return{id:e.id,title:e.title,category:e.category,examType:e.examType,sectionType:e.sectionType,promptType:s,scenario:e.scenario,discussionParticipants:n,instructions:t,question:r,passage:i,recommendedWordCount:vt(t),lastScore:null,lastCompletedAt:null}},xt=e=>({id:e.id,title:e.title,category:e.category,examType:e.examType,sectionType:e.sectionType,promptType:"legacy",scenario:`<p>${e.instructions}</p>`,discussionParticipants:[],instructions:e.instructions,question:e.question,passage:e.passage,recommendedWordCount:e.recommendedWordCount,lastScore:null,lastCompletedAt:null}),_t=e=>"scenario"in e?Et(e):xt(e),St=()=>{const e=dt();if(!N.existsSync(e))throw new Error(`Writing prompts directory not found: ${e}`);const t=N.readdirSync(e).filter(gt).sort();if(t.length===0)throw new Error(`No writing prompt JSON files found in ${e}`);return t.flatMap(s=>{const n=l.join(e,s),r=N.readFileSync(n,"utf8");try{const i=JSON.parse(r);return X(Ue,i).map(_t)}catch(i){const a=i instanceof Error?i.message:"Unknown validation error";throw new Error(`Invalid writing prompt file "${s}": ${a}`)}})},Ot=e=>{const t=new Set(e.prepare("SELECT name FROM pragma_table_info('prompts')").all().map(s=>s.name));t.has("prompt_type")||e.exec("ALTER TABLE prompts ADD COLUMN prompt_type TEXT NOT NULL DEFAULT 'legacy'"),t.has("scenario_html")||e.exec("ALTER TABLE prompts ADD COLUMN scenario_html TEXT NOT NULL DEFAULT ''"),t.has("discussion_json")||e.exec("ALTER TABLE prompts ADD COLUMN discussion_json TEXT NOT NULL DEFAULT '[]'")},bt=e=>{e.exec(`
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
  `),Ot(e)},At=e=>{const t=e.prepare(`
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
  `),s=St();e.transaction(()=>{s.forEach(r=>{t.run({...r,discussionParticipantsJson:JSON.stringify(r.discussionParticipants)})})})()},Nt=e=>{const t=l.join(e.getPath("userData"),"open-prep.db"),s=new xe(t);return bt(s),At(s),s};class Pt{constructor(){O(this,"id","mock")}async evaluateWriting(t){const s=t.essayText.slice(0,Math.min(t.essayText.length,32));return{overallScore:4,overallMaxScore:6,summary:"Your response is organized and readable, but it still needs more precise vocabulary and stronger support for the main claim.",nextStep:"Add one concrete example and replace at least two informal phrases with more academic wording.",criterionScores:[{criterion:"organization",label:"Organization",score:5,maxScore:5,comment:"The response follows a clear structure and moves logically from the main claim to supporting points."},{criterion:"grammarAndMechanics",label:"Grammar & Mechanics",score:5,maxScore:5,comment:"Grammar is generally correct and sentence boundaries are controlled well throughout the response."},{criterion:"languageAccuracy",label:"Language Accuracy",score:3,maxScore:5,comment:"The language is understandable, but the vocabulary range is limited and several choices sound informal for TOEFL® writing."},{criterion:"developmentAndSupport",label:"Development & Support",score:2,maxScore:5,comment:"The response states a position, but it would benefit from more specific evidence and a fuller explanation of the reasoning."}],highlights:[{id:"mock-highlight-1",excerpt:s,replacement:"particularly",category:"idiomatic-word-choice",explanation:"This phrase can sound too conversational for an academic response. A more precise adverb keeps the tone formal.",alternatives:["particularly","notably","especially","significantly"],startOffset:0,endOffset:Math.min(6,t.essayText.length)}]}}}const wt=()=>process.env.OPEN_PREP_AI_PROVIDER==="mock"?new Pt:new it;class Rt{constructor(t,s){O(this,"provider",wt());this.promptCatalogService=t,this.attemptRepository=s}async submitAttempt(t){const s=this.promptCatalogService.getPromptDetails(t.promptId),n=this.attemptRepository.createAttempt(t,this.provider.id);try{const r=await this.provider.evaluateWriting({prompt:s,essayText:t.essayText});return this.attemptRepository.completeAttempt(n.id,r)}catch(r){throw this.attemptRepository.markAttemptFailed(n.id),r}}}const ce=__dirname;process.env.APP_ROOT=l.join(ce,"..");const{VITE_DEV_SERVER_URL:j}=process.env,F=l.join(process.env.APP_ROOT,"dist"),pe="OpenPrep";process.env.VITE_PUBLIC=j?l.join(process.env.APP_ROOT,"public"):F;let b=null;const H=()=>{const e=process.env.VITE_PUBLIC??F,t=l.join(e,"logo/logo_icon_only.svg");b=new d.BrowserWindow({width:1440,height:1024,minWidth:1200,minHeight:820,backgroundColor:"#f5f3ef",title:pe,icon:t,webPreferences:{preload:l.join(ce,"preload.js"),contextIsolation:!0,nodeIntegration:!1}}),j?(b.loadURL(j),b.webContents.openDevTools({mode:"detach"})):b.loadFile(l.join(F,"index.html"))};d.app.whenReady().then(()=>{d.app.setName(pe);const e=Nt(d.app),t=new ut(e),s=new ot,n=new ct(t),r=new Rt(n,t);je({codexReadinessService:s,promptCatalogService:n,attemptRepository:t,writingEvaluationService:r}),H(),d.app.on("activate",()=>{d.BrowserWindow.getAllWindows().length===0&&H()})});d.app.on("window-all-closed",()=>{process.platform!=="darwin"&&(d.app.quit(),b=null)});
