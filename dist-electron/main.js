"use strict";var ie=Object.create;var P=Object.defineProperty;var oe=Object.getOwnPropertyDescriptor;var ae=Object.getOwnPropertyNames;var ce=Object.getPrototypeOf,pe=Object.prototype.hasOwnProperty;var le=(e,s,t)=>s in e?P(e,s,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[s]=t;var ue=(e,s,t,r)=>{if(s&&typeof s=="object"||typeof s=="function")for(let n of ae(s))!pe.call(e,n)&&n!==t&&P(e,n,{get:()=>s[n],enumerable:!(r=oe(s,n))||r.enumerable});return e};var me=(e,s,t)=>(t=e!=null?ie(ce(e)):{},ue(s||!e||!e.__esModule?P(t,"default",{value:e,enumerable:!0}):t,e));var O=(e,s,t)=>le(e,typeof s!="symbol"?s+"":s,t);const m=require("electron"),f=require("node:path"),A=require("node:fs"),X=require("node:crypto"),de=require("better-sqlite3"),ge={lang:void 0,message:void 0,abortEarly:void 0,abortPipeEarly:void 0};function V(e){return ge}let R;function fe(e){return R==null?void 0:R.get(e)}let w;function ye(e){return w==null?void 0:w.get(e)}let C;function he(e,s){var t;return(t=C==null?void 0:C.get(e))==null?void 0:t.get(s)}function S(e){var t,r;const s=typeof e;return s==="string"?`"${e}"`:s==="number"||s==="bigint"||s==="boolean"?`${e}`:s==="object"||s==="function"?(e&&((r=(t=Object.getPrototypeOf(e))==null?void 0:t.constructor)==null?void 0:r.name))??"null":s}function d(e,s,t,r,n){const i=n&&"input"in n?n.input:t.value,o=(n==null?void 0:n.expected)??e.expects??null,a=(n==null?void 0:n.received)??S(i),p={kind:e.kind,type:e.type,input:i,expected:o,received:a,message:`Invalid ${s}: ${o?`Expected ${o} but r`:"R"}eceived ${a}`,requirement:e.requirement,path:n==null?void 0:n.path,issues:n==null?void 0:n.issues,lang:r.lang,abortEarly:r.abortEarly,abortPipeEarly:r.abortPipeEarly},l=e.kind==="schema",u=(n==null?void 0:n.message)??e.message??he(e.reference,p.lang)??(l?ye(p.lang):null)??r.message??fe(p.lang);u!==void 0&&(p.message=typeof u=="function"?u(p):u),l&&(t.typed=!1),t.issues?t.issues.push(p):t.issues=[p]}const $=new WeakMap;function h(e){let s=$.get(e);return s||(s={version:1,vendor:"valibot",validate(t){return e["~run"]({value:t},V())}},$.set(e,s)),s}function H(e,s){const t=[...new Set(e)];return t.length>1?`(${t.join(` ${s} `)})`:t[0]??"never"}var Te=class extends Error{constructor(e){super(e[0].message),this.name="ValiError",this.issues=e}};function N(e,s){return{kind:"validation",type:"max_value",reference:N,async:!1,expects:`<=${e instanceof Date?e.toJSON():S(e)}`,requirement:e,message:s,"~run"(t,r){return t.typed&&!(t.value<=this.requirement)&&d(this,"value",t,r,{received:t.value instanceof Date?t.value.toJSON():S(t.value)}),t}}}function q(e,s){return{kind:"validation",type:"min_length",reference:q,async:!1,expects:`>=${e}`,requirement:e,message:s,"~run"(t,r){return t.typed&&t.value.length<this.requirement&&d(this,"length",t,r,{received:`${t.value.length}`}),t}}}function v(e,s){return{kind:"validation",type:"min_value",reference:v,async:!1,expects:`>=${e instanceof Date?e.toJSON():S(e)}`,requirement:e,message:s,"~run"(t,r){return t.typed&&!(t.value>=this.requirement)&&d(this,"value",t,r,{received:t.value instanceof Date?t.value.toJSON():S(t.value)}),t}}}function ve(e,s,t){return typeof e.fallback=="function"?e.fallback(s,t):e.fallback}function j(e,s,t){return typeof e.default=="function"?e.default(s,t):e.default}function x(e,s){return{kind:"schema",type:"array",reference:x,expects:"Array",async:!1,item:e,message:s,get"~standard"(){return h(this)},"~run"(t,r){var i;const n=t.value;if(Array.isArray(n)){t.typed=!0,t.value=[];for(let o=0;o<n.length;o++){const a=n[o],p=this.item["~run"]({value:a},r);if(p.issues){const l={type:"array",origin:"value",input:n,key:o,value:a};for(const u of p.issues)u.path?u.path.unshift(l):u.path=[l],(i=t.issues)==null||i.push(u);if(t.issues||(t.issues=p.issues),r.abortEarly){t.typed=!1;break}}p.typed||(t.typed=!1),t.value.push(p.value)}}else d(this,"type",t,r);return t}}}function M(e,s){return{kind:"schema",type:"nullable",reference:M,expects:`(${e.expects} | null)`,async:!1,wrapped:e,default:s,get"~standard"(){return h(this)},"~run"(t,r){return t.value===null&&(this.default!==void 0&&(t.value=j(this,t,r)),t.value===null)?(t.typed=!0,t):this.wrapped["~run"](t,r)}}}function T(e){return{kind:"schema",type:"number",reference:T,expects:"number",async:!1,message:e,get"~standard"(){return h(this)},"~run"(s,t){return typeof s.value=="number"&&!isNaN(s.value)?s.typed=!0:d(this,"type",s,t),s}}}function g(e,s){return{kind:"schema",type:"object",reference:g,expects:"Object",async:!1,entries:e,message:s,get"~standard"(){return h(this)},"~run"(t,r){var i;const n=t.value;if(n&&typeof n=="object"){t.typed=!0,t.value={};for(const o in this.entries){const a=this.entries[o];if(o in n||(a.type==="exact_optional"||a.type==="optional"||a.type==="nullish")&&a.default!==void 0){const p=o in n?n[o]:j(a),l=a["~run"]({value:p},r);if(l.issues){const u={type:"object",origin:"value",input:n,key:o,value:p};for(const _ of l.issues)_.path?_.path.unshift(u):_.path=[u],(i=t.issues)==null||i.push(_);if(t.issues||(t.issues=l.issues),r.abortEarly){t.typed=!1;break}}l.typed||(t.typed=!1),t.value[o]=l.value}else if(a.fallback!==void 0)t.value[o]=ve(a);else if(a.type!=="exact_optional"&&a.type!=="optional"&&a.type!=="nullish"&&(d(this,"key",t,r,{input:void 0,expected:`"${o}"`,path:[{type:"object",origin:"key",input:n,key:o,value:n[o]}]}),r.abortEarly))break}}else d(this,"type",t,r);return t}}}function L(e,s){return{kind:"schema",type:"optional",reference:L,expects:`(${e.expects} | undefined)`,async:!1,wrapped:e,default:s,get"~standard"(){return h(this)},"~run"(t,r){return t.value===void 0&&(this.default!==void 0&&(t.value=j(this,t,r)),t.value===void 0)?(t.typed=!0,t):this.wrapped["~run"](t,r)}}}function y(e,s){return{kind:"schema",type:"picklist",reference:y,expects:H(e.map(S),"|"),async:!1,options:e,message:s,get"~standard"(){return h(this)},"~run"(t,r){return this.options.includes(t.value)?t.typed=!0:d(this,"type",t,r),t}}}function c(e){return{kind:"schema",type:"string",reference:c,expects:"string",async:!1,message:e,get"~standard"(){return h(this)},"~run"(s,t){return typeof s.value=="string"?s.typed=!0:d(this,"type",s,t),s}}}function W(e){let s;if(e)for(const t of e)if(s)for(const r of t.issues)s.push(r);else s=t.issues;return s}function Y(e,s){return{kind:"schema",type:"union",reference:Y,expects:H(e.map(t=>t.expects),"|"),async:!1,options:e,message:s,get"~standard"(){return h(this)},"~run"(t,r){let n,i,o;for(const a of this.options){const p=a["~run"]({value:t.value},r);if(p.typed)if(p.issues)i?i.push(p):i=[p];else{n=p;break}else o?o.push(p):o=[p]}if(n)return n;if(i){if(i.length===1)return i[0];d(this,"type",t,r,{issues:W(i)}),t.typed=!0}else{if((o==null?void 0:o.length)===1)return o[0];d(this,"type",t,r,{issues:W(o)})}return t}}}function F(e,s,t){const r=e["~run"]({value:s},V());if(r.issues)throw new Te(r.issues);return r.value}function E(...e){return{...e[0],pipe:e,get"~standard"(){return h(this)},"~run"(s,t){for(const r of e)if(r.kind!=="metadata"){if(s.issues&&(r.kind==="schema"||r.kind==="transformation")){s.typed=!1;break}(!s.issues||!t.abortEarly&&!t.abortPipeEarly)&&(s=r["~run"](s,t))}return s}}}const Ee=["toefl","ielts","cambridge"],_e=["reading","listening","writing","speaking"],Se=["organization","grammarAndMechanics","languageAccuracy","developmentAndSupport"],z=y(Ee),K=y(_e),xe=y(Se),Q=y(["academic-discussion","email","legacy"]),Oe=g({role:y(["professor","student"]),name:c(),gender:y(["female","male"]),avatarUrl:c(),message:c()}),be=g({id:c(),title:c(),category:c(),examType:z,sectionType:K,lastScore:M(T()),lastCompletedAt:M(c())});({...be.entries});const Z={id:c(),title:c(),category:c(),examType:z,sectionType:K},Ne=g({...Z,type:L(Q,"legacy"),instructions:c(),question:c(),passage:c(),recommendedWordCount:c()}),Ae=g({...Z,type:y(["academic-discussion","email"]),scenario:c(),discussion:L(g({professor:c(),studentA:c(),studentB:c()}))}),Le=x(Y([Ne,Ae])),Pe=g({promptId:c(),essayText:E(c(),q(50))}),Re=({codexReadinessService:e,promptCatalogService:s,attemptRepository:t,writingEvaluationService:r})=>{m.ipcMain.handle("codex-auth:get-status",()=>e.getStatus()),m.ipcMain.handle("codex-auth:sign-in",()=>e.signIn()),m.ipcMain.handle("prompt-catalog:list",()=>s.listPromptCatalog()),m.ipcMain.handle("prompt-catalog:get",(n,i)=>s.getPromptDetails(i)),m.ipcMain.handle("writing:submit",(n,i)=>r.submitAttempt(F(Pe,i))),m.ipcMain.handle("attempts:get",(n,i)=>t.getAttemptDetails(i))},we=g({criterion:xe,label:c(),score:E(T(),v(0),N(5)),maxScore:E(T(),v(1),N(5)),comment:c()}),Ce=g({id:c(),excerpt:c(),replacement:c(),category:y(["grammar-spelling","relevance","idiomatic-word-choice","elaboration"]),explanation:c(),alternatives:L(x(c()),[]),startOffset:E(T(),v(0)),endOffset:E(T(),v(0))}),De=g({overallScore:E(T(),v(0),N(6)),overallMaxScore:E(T(),v(1),N(6)),summary:c(),nextStep:c(),criterionScores:x(we),highlights:x(Ce)}),Ie=()=>["Return valid JSON only.","Evaluate the writing using TOEFL®-style writing criteria.","Use this exact shape:","{",'  "overallScore": number,','  "overallMaxScore": 6,','  "summary": string,','  "nextStep": string,','  "criterionScores": [','    { "criterion": "organization" | "grammarAndMechanics" | "languageAccuracy" | "developmentAndSupport", "label": string, "score": number, "maxScore": 5, "comment": string }',"  ],",'  "highlights": [','    { "id": string, "excerpt": string, "replacement": string, "category": "grammar-spelling" | "relevance" | "idiomatic-word-choice" | "elaboration", "explanation": string, "alternatives": string[], "startOffset": number, "endOffset": number }',"  ]","}","If no useful highlight exists, return an empty highlights array.","Every highlight must include startOffset and endOffset from the student essay. Omit highlights when exact offsets are unclear."].join(`
`),Me=e=>e.replace(/<li>/gi,"- ").replace(/<\/li>/gi,`
`).replace(/<\/p>/gi,`

`).replace(/<br\s*\/?>/gi,`
`).replace(/<[^>]+>/g," ").replace(/\s+\n/g,`
`).replace(/\n{3,}/g,`

`).replace(/[ \t]{2,}/g," ").trim(),Ue=e=>{const s=[`Exam: ${e.prompt.examType.toUpperCase()}`,`Section: ${e.prompt.sectionType.toUpperCase()}`,`Category: ${e.prompt.category}`,`Prompt type: ${e.prompt.promptType}`,`Scenario: ${Me(e.prompt.scenario)}`];return e.prompt.discussionParticipants.length>0&&s.push("Discussion:",...e.prompt.discussionParticipants.map(t=>`${t.name} (${t.role}): ${t.message}`)),e.prompt.recommendedWordCount&&s.push(`Recommended length: ${e.prompt.recommendedWordCount}`),s},ke=(e,s)=>[s.trim(),"",Ie(),"","Context:",...Ue(e),"","Student essay:",e.essayText,"","Keep the feedback concise, specific, and encouraging."].join(`
`),je={type:"object",additionalProperties:!1,properties:{overallScore:{type:"number",minimum:0,maximum:6},overallMaxScore:{type:"number",minimum:1,maximum:6},summary:{type:"string"},nextStep:{type:"string"},criterionScores:{type:"array",items:{type:"object",additionalProperties:!1,properties:{criterion:{type:"string",enum:["organization","grammarAndMechanics","languageAccuracy","developmentAndSupport"]},label:{type:"string"},score:{type:"number",minimum:0,maximum:5},maxScore:{type:"number",minimum:1,maximum:5},comment:{type:"string"}},required:["criterion","label","score","maxScore","comment"]}},highlights:{type:"array",items:{type:"object",additionalProperties:!1,properties:{id:{type:"string"},excerpt:{type:"string"},replacement:{type:"string"},category:{type:"string",enum:["grammar-spelling","relevance","idiomatic-word-choice","elaboration"]},explanation:{type:"string"},alternatives:{type:"array",items:{type:"string"}},startOffset:{type:"number",minimum:0},endOffset:{type:"number",minimum:0}},required:["id","excerpt","replacement","category","explanation","alternatives","startOffset","endOffset"]}}},required:["overallScore","overallMaxScore","summary","nextStep","criterionScores","highlights"]},ee=async()=>{const{Codex:e}=await import("@openai/codex-sdk");return new e},Fe=()=>process.env.APP_ROOT??process.cwd(),Xe=()=>f.resolve(Fe(),"prompts/system/codex/writing-evaluation.md"),$e=async()=>{const e=Xe();try{return await A.promises.readFile(e,"utf8")}catch{throw new Error(`Missing Codex system prompt file at ${e}. Create it before running writing evaluation.`)}},We="gpt-5.4-mini",Je="low",Be=3e5,te=(e=process.env)=>{const s=Number(e.OPEN_PREP_CODEX_TIMEOUT_MS);return Number.isFinite(s)&&s>0?s:Be},J=e=>typeof e=="number"&&Number.isFinite(e)&&e>=0,Ge=(e,s)=>{if(J(s.startOffset)&&J(s.endOffset))return{startOffset:s.startOffset,endOffset:Math.max(s.startOffset,s.endOffset)};if(typeof s.excerpt!="string"||s.excerpt.trim().length===0)return null;const t=e.indexOf(s.excerpt);return t<0?null:{startOffset:t,endOffset:t+s.excerpt.length}},Ve=(e,s)=>{if(!e||typeof e!="object")return e;const t=e,r=(Array.isArray(t.highlights),t.highlights);return Array.isArray(r)?{...t,highlights:r.flatMap(n=>{if(!n||typeof n!="object")return[];const i=n,o=Ge(s,i);return o?[{...i,alternatives:Array.isArray(i.alternatives)?i.alternatives:[],...o}]:[]})}:t};class He{constructor(){O(this,"id","codex")}async evaluateWriting(s){const t=await $e(),r=ke(s,t),i=(await ee()).startThread({model:We,modelReasoningEffort:Je,skipGitRepoCheck:!0}),o=te(),a=new AbortController,p=setTimeout(()=>a.abort(),o);try{const l=await i.run(r,{outputSchema:je,signal:a.signal}),u=Ve(JSON.parse(l.finalResponse),s.essayText);return F(De,u)}catch(l){throw a.signal.aborted?new Error(`Codex evaluation timed out after ${String(o)}ms.`):l}finally{clearTimeout(p)}}}const qe="gpt-5.4-mini",Ye="low";class ze{constructor(){O(this,"isAuthenticated",process.env.OPEN_PREP_AI_PROVIDER==="mock")}getStatus(){return{isAuthenticated:this.isAuthenticated}}async signIn(){if(process.env.OPEN_PREP_AI_PROVIDER==="mock")return this.isAuthenticated=!0,this.getStatus();const t=(await ee()).startThread({model:qe,modelReasoningEffort:Ye,skipGitRepoCheck:!0}),r=te(),n=new AbortController,i=setTimeout(()=>n.abort(),r);try{return await t.run("Return JSON with ok set to true.",{outputSchema:{type:"object",additionalProperties:!1,properties:{ok:{type:"boolean"}},required:["ok"]},signal:n.signal}),this.isAuthenticated=!0,this.getStatus()}catch(o){throw this.isAuthenticated=!1,n.signal.aborted?new Error(`ChatGPT sign-in check timed out after ${String(r)}ms.`):o}finally{clearTimeout(i)}}}class Ke{constructor(s){this.attemptRepository=s}listPromptCatalog(){return this.attemptRepository.listPromptSummaries()}getPromptDetails(s){return this.attemptRepository.getPromptDetails(s)}}const Qe=e=>({id:e.id,title:e.title,category:e.category,examType:e.exam_type,sectionType:e.section_type,lastScore:e.last_score,lastCompletedAt:e.last_completed_at}),Ze=(e,s)=>({id:e.id,title:e.title,category:e.category,examType:e.exam_type,sectionType:e.section_type,promptType:e.prompt_type,scenario:e.scenario_html,discussionParticipants:JSON.parse(e.discussion_json),instructions:e.instructions,question:e.question,passage:e.passage,recommendedWordCount:e.recommended_word_count,lastScore:(s==null?void 0:s.last_score)??null,lastCompletedAt:(s==null?void 0:s.last_completed_at)??null});class et{constructor(s){this.database=s}listPromptSummaries(){return this.database.prepare(`
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
      `).all().map(Qe)}getPromptDetails(s){const t=this.database.prepare("SELECT * FROM prompts WHERE id = ?").get(s);if(!t)throw new Error(`Prompt not found: ${s}`);const r=this.database.prepare(`
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
      `).get(s);return Ze(t,r)}createAttempt(s,t){const r=this.getPromptDetails(s.promptId),n=X.randomUUID(),i=new Date().toISOString();return this.database.prepare(`
          INSERT INTO attempts (id, prompt_id, essay_text, submitted_at, provider_type, status)
          VALUES (?, ?, ?, ?, ?, 'pending')
        `).run(n,s.promptId,s.essayText,i,t),{id:n,prompt:r,essayText:s.essayText,submittedAt:i,providerType:t,status:"pending",evaluation:null}}completeAttempt(s,t){const r=X.randomUUID(),n=new Date().toISOString();return this.database.prepare("UPDATE attempts SET status = 'completed' WHERE id = ?").run(s),this.database.prepare(`
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
        `).run(r,s,t.overallScore,t.overallMaxScore,t.summary,t.nextStep,JSON.stringify(t),n),this.getAttemptDetails(s)}markAttemptFailed(s){this.database.prepare("UPDATE attempts SET status = 'failed' WHERE id = ?").run(s)}getAttemptDetails(s){const t=this.database.prepare("SELECT * FROM attempts WHERE id = ?").get(s);if(!t)throw new Error(`Attempt not found: ${s}`);const r=this.getPromptDetails(t.prompt_id),n=this.database.prepare("SELECT payload_json FROM evaluations WHERE attempt_id = ?").get(s);return{id:t.id,prompt:r,essayText:t.essay_text,submittedAt:t.submitted_at,providerType:t.provider_type,status:t.status,evaluation:n?JSON.parse(n.payload_json):null}}}const tt=()=>process.env.APP_ROOT??process.cwd(),st=()=>f.resolve(tt(),"prompts","writing"),rt=e=>e.toLowerCase().endsWith(".json"),nt={female:["Dr. Maya Patel","Dr. Elena Brooks","Dr. Nina Alvarez","Dr. Rachel Kim","Dr. Sonia Bennett","Dr. Priya Shah"],male:["Dr. Marcus Bennett","Dr. Daniel Cho","Dr. Adrian Foster","Dr. Leo Ramirez","Dr. Victor Hall","Dr. Simon Carter"]},it={female:["Ava","Nora","Jasmine","Lena","Tanya","Mila","Naomi","Sofia"],male:["Sam","Ethan","Leo","Noah","Owen","Mateo","Julian","Miles"]},ot={female:["/avatars/uifaces/125.jpg","/avatars/uifaces/128.jpg","/avatars/uifaces/217.jpg","/avatars/uifaces/219.jpg","/avatars/uifaces/220.jpg","/avatars/uifaces/221.jpg"],male:["/avatars/uifaces/80.jpg","/avatars/uifaces/92.jpg","/avatars/uifaces/218.jpg","/avatars/uifaces/222.jpg"]},at=e=>e.replace(/<li>/gi,"- ").replace(/<\/li>/gi,`
`).replace(/<\/p>/gi,`

`).replace(/<br\s*\/?>/gi,`
`).replace(/<[^>]+>/g," ").replace(/&rsquo;/g,"'").replace(/&lsquo;/g,"'").replace(/&ldquo;/g,'"').replace(/&rdquo;/g,'"').replace(/&amp;/g,"&").replace(/\s+\n/g,`
`).replace(/\n{3,}/g,`

`).replace(/[ \t]{2,}/g," ").trim(),se=e=>Array.from(e).reduce((s,t)=>(s*31+t.charCodeAt(0))%2147483647,0),B=(e,s,t)=>{const r=se(s)%e.length;for(let n=0;n<e.length;n+=1){const i=e[(r+n)%e.length];if(!t.has(i))return t.add(i),i}return e[r]},D=e=>se(e)%2===0?"female":"male",I=(e,s,t,r,n,i)=>{const o=s==="professor"?nt[r]:it[r],a=B(o,`${e}:${s}:name`,n),p=B(ot[r],`${e}:${s}:avatar`,i);return{role:s,name:a,gender:r,avatarUrl:p,message:t}},ct=e=>{const s=e.match(/at least (\d+) words?/i);if(s)return`${s[1]} words minimum`;const t=e.match(/(\d+)\s*-\s*(\d+) words?/i);return t?`${t[1]}-${t[2]} words`:""},pt=e=>{var o;const s=at(e.scenario),t=e.type,r=[];if(e.type==="academic-discussion"&&e.discussion){const a=new Set,p=new Set,l=D(`${e.id}:professor`),u=D(`${e.id}:student-a`),_=D(`${e.id}:student-b`);r.push(I(e.id,"professor",e.discussion.professor,l,a,p),I(e.id,"student",e.discussion.studentA,u,a,p),I(e.id,"student",e.discussion.studentB,_,a,p))}const n=((o=r.find(a=>a.role==="professor"))==null?void 0:o.message)??"",i=r.filter(a=>a.role==="student").map(a=>`${a.name}: ${a.message}`).join(`

`);return{id:e.id,title:e.title,category:e.category,examType:e.examType,sectionType:e.sectionType,promptType:t,scenario:e.scenario,discussionParticipants:r,instructions:s,question:n,passage:i,recommendedWordCount:ct(s),lastScore:null,lastCompletedAt:null}},lt=e=>({id:e.id,title:e.title,category:e.category,examType:e.examType,sectionType:e.sectionType,promptType:"legacy",scenario:`<p>${e.instructions}</p>`,discussionParticipants:[],instructions:e.instructions,question:e.question,passage:e.passage,recommendedWordCount:e.recommendedWordCount,lastScore:null,lastCompletedAt:null}),ut=e=>"scenario"in e?pt(e):lt(e),mt=()=>{const e=st();if(!A.existsSync(e))throw new Error(`Writing prompts directory not found: ${e}`);const s=A.readdirSync(e).filter(rt).sort();if(s.length===0)throw new Error(`No writing prompt JSON files found in ${e}`);return s.flatMap(t=>{const r=f.join(e,t),n=A.readFileSync(r,"utf8");try{const i=JSON.parse(n);return F(Le,i).map(ut)}catch(i){const o=i instanceof Error?i.message:"Unknown validation error";throw new Error(`Invalid writing prompt file "${t}": ${o}`)}})},dt=e=>{const s=new Set(e.prepare("SELECT name FROM pragma_table_info('prompts')").all().map(t=>t.name));s.has("prompt_type")||e.exec("ALTER TABLE prompts ADD COLUMN prompt_type TEXT NOT NULL DEFAULT 'legacy'"),s.has("scenario_html")||e.exec("ALTER TABLE prompts ADD COLUMN scenario_html TEXT NOT NULL DEFAULT ''"),s.has("discussion_json")||e.exec("ALTER TABLE prompts ADD COLUMN discussion_json TEXT NOT NULL DEFAULT '[]'")},gt=e=>{e.exec(`
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
  `),dt(e)},ft=e=>{const s=e.prepare(`
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
  `),t=mt();e.transaction(()=>{t.forEach(n=>{s.run({...n,discussionParticipantsJson:JSON.stringify(n.discussionParticipants)})})})()},yt=e=>{const s=f.join(e.getPath("userData"),"open-prep.db"),t=new de(s);return gt(t),ft(t),t};class ht{constructor(){O(this,"id","mock")}async evaluateWriting(s){const t=s.essayText.slice(0,Math.min(s.essayText.length,32));return{overallScore:4,overallMaxScore:6,summary:"Your response is organized and readable, but it still needs more precise vocabulary and stronger support for the main claim.",nextStep:"Add one concrete example and replace at least two informal phrases with more academic wording.",criterionScores:[{criterion:"organization",label:"Organization",score:5,maxScore:5,comment:"The response follows a clear structure and moves logically from the main claim to supporting points."},{criterion:"grammarAndMechanics",label:"Grammar & Mechanics",score:5,maxScore:5,comment:"Grammar is generally correct and sentence boundaries are controlled well throughout the response."},{criterion:"languageAccuracy",label:"Language Accuracy",score:3,maxScore:5,comment:"The language is understandable, but the vocabulary range is limited and several choices sound informal for TOEFL® writing."},{criterion:"developmentAndSupport",label:"Development & Support",score:2,maxScore:5,comment:"The response states a position, but it would benefit from more specific evidence and a fuller explanation of the reasoning."}],highlights:[{id:"mock-highlight-1",excerpt:t,replacement:"particularly",category:"idiomatic-word-choice",explanation:"This phrase can sound too conversational for an academic response. A more precise adverb keeps the tone formal.",alternatives:["particularly","notably","especially","significantly"],startOffset:0,endOffset:Math.min(6,s.essayText.length)}]}}}const Tt=()=>process.env.OPEN_PREP_AI_PROVIDER==="mock"?new ht:new He;class vt{constructor(s,t){O(this,"provider",Tt());this.promptCatalogService=s,this.attemptRepository=t}async submitAttempt(s){const t=this.promptCatalogService.getPromptDetails(s.promptId),r=this.attemptRepository.createAttempt(s,this.provider.id);try{const n=await this.provider.evaluateWriting({prompt:t,essayText:s.essayText});return this.attemptRepository.completeAttempt(r.id,n)}catch(n){throw this.attemptRepository.markAttemptFailed(r.id),n}}}const re=__dirname;process.env.APP_ROOT=f.join(re,"..");const{VITE_DEV_SERVER_URL:U}=process.env,k=f.join(process.env.APP_ROOT,"dist"),ne="OpenPrep";process.env.VITE_PUBLIC=U?f.join(process.env.APP_ROOT,"public"):k;let b=null;const G=()=>{const e=process.env.VITE_PUBLIC??k,s=f.join(e,"logo/logo_icon_only.svg");b=new m.BrowserWindow({width:1440,height:1024,minWidth:1200,minHeight:820,backgroundColor:"#f5f3ef",title:ne,icon:s,webPreferences:{preload:f.join(re,"preload.js"),contextIsolation:!0,nodeIntegration:!1}}),U?(b.loadURL(U),b.webContents.openDevTools({mode:"detach"})):b.loadFile(f.join(k,"index.html"))};m.app.whenReady().then(()=>{m.app.setName(ne);const e=yt(m.app),s=new et(e),t=new ze,r=new Ke(s),n=new vt(r,s);Re({codexReadinessService:t,promptCatalogService:r,attemptRepository:s,writingEvaluationService:n}),G(),m.app.on("activate",()=>{m.BrowserWindow.getAllWindows().length===0&&G()})});m.app.on("window-all-closed",()=>{process.platform!=="darwin"&&(m.app.quit(),b=null)});
