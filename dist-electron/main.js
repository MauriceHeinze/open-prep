"use strict";var ie=Object.defineProperty;var oe=(e,s,t)=>s in e?ie(e,s,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[s]=t;var A=(e,s,t)=>oe(e,typeof s!="symbol"?s+"":s,t);const g=require("electron"),m=require("node:path"),U=require("node:crypto"),ae=require("better-sqlite3"),x=require("node:fs"),ce=require("node:child_process"),M=require("node:os"),pe={lang:void 0,message:void 0,abortEarly:void 0,abortPipeEarly:void 0};function G(e){return pe}let R;function le(e){return R==null?void 0:R.get(e)}let C;function ue(e){return C==null?void 0:C.get(e)}let w;function me(e,s){var t;return(t=w==null?void 0:w.get(e))==null?void 0:t.get(s)}function b(e){var t,n;const s=typeof e;return s==="string"?`"${e}"`:s==="number"||s==="bigint"||s==="boolean"?`${e}`:s==="object"||s==="function"?(e&&((n=(t=Object.getPrototypeOf(e))==null?void 0:t.constructor)==null?void 0:n.name))??"null":s}function f(e,s,t,n,r){const a=r&&"input"in r?r.input:t.value,i=(r==null?void 0:r.expected)??e.expects??null,c=(r==null?void 0:r.received)??b(a),p={kind:e.kind,type:e.type,input:a,expected:i,received:c,message:`Invalid ${s}: ${i?`Expected ${i} but r`:"R"}eceived ${c}`,requirement:e.requirement,path:r==null?void 0:r.path,issues:r==null?void 0:r.issues,lang:n.lang,abortEarly:n.abortEarly,abortPipeEarly:n.abortPipeEarly},l=e.kind==="schema",u=(r==null?void 0:r.message)??e.message??me(e.reference,p.lang)??(l?ue(p.lang):null)??n.message??le(p.lang);u!==void 0&&(p.message=typeof u=="function"?u(p):u),l&&(t.typed=!1),t.issues?t.issues.push(p):t.issues=[p]}const J=new WeakMap;function T(e){let s=J.get(e);return s||(s={version:1,vendor:"valibot",validate(t){return e["~run"]({value:t},G())}},J.set(e,s)),s}function Y(e,s){const t=[...new Set(e)];return t.length>1?`(${t.join(` ${s} `)})`:t[0]??"never"}var de=class extends Error{constructor(e){super(e[0].message),this.name="ValiError",this.issues=e}};function P(e,s){return{kind:"validation",type:"max_value",reference:P,async:!1,expects:`<=${e instanceof Date?e.toJSON():b(e)}`,requirement:e,message:s,"~run"(t,n){return t.typed&&!(t.value<=this.requirement)&&f(this,"value",t,n,{received:t.value instanceof Date?t.value.toJSON():b(t.value)}),t}}}function z(e,s){return{kind:"validation",type:"min_length",reference:z,async:!1,expects:`>=${e}`,requirement:e,message:s,"~run"(t,n){return t.typed&&t.value.length<this.requirement&&f(this,"length",t,n,{received:`${t.value.length}`}),t}}}function _(e,s){return{kind:"validation",type:"min_value",reference:_,async:!1,expects:`>=${e instanceof Date?e.toJSON():b(e)}`,requirement:e,message:s,"~run"(t,n){return t.typed&&!(t.value>=this.requirement)&&f(this,"value",t,n,{received:t.value instanceof Date?t.value.toJSON():b(t.value)}),t}}}function ge(e,s,t){return typeof e.fallback=="function"?e.fallback(s,t):e.fallback}function X(e,s,t){return typeof e.default=="function"?e.default(s,t):e.default}function N(e,s){return{kind:"schema",type:"array",reference:N,expects:"Array",async:!1,item:e,message:s,get"~standard"(){return T(this)},"~run"(t,n){var a;const r=t.value;if(Array.isArray(r)){t.typed=!0,t.value=[];for(let i=0;i<r.length;i++){const c=r[i],p=this.item["~run"]({value:c},n);if(p.issues){const l={type:"array",origin:"value",input:r,key:i,value:c};for(const u of p.issues)u.path?u.path.unshift(l):u.path=[l],(a=t.issues)==null||a.push(u);if(t.issues||(t.issues=p.issues),n.abortEarly){t.typed=!1;break}}p.typed||(t.typed=!1),t.value.push(p.value)}}else f(this,"type",t,n);return t}}}function k(e,s){return{kind:"schema",type:"nullable",reference:k,expects:`(${e.expects} | null)`,async:!1,wrapped:e,default:s,get"~standard"(){return T(this)},"~run"(t,n){return t.value===null&&(this.default!==void 0&&(t.value=X(this,t,n)),t.value===null)?(t.typed=!0,t):this.wrapped["~run"](t,n)}}}function E(e){return{kind:"schema",type:"number",reference:E,expects:"number",async:!1,message:e,get"~standard"(){return T(this)},"~run"(s,t){return typeof s.value=="number"&&!isNaN(s.value)?s.typed=!0:f(this,"type",s,t),s}}}function y(e,s){return{kind:"schema",type:"object",reference:y,expects:"Object",async:!1,entries:e,message:s,get"~standard"(){return T(this)},"~run"(t,n){var a;const r=t.value;if(r&&typeof r=="object"){t.typed=!0,t.value={};for(const i in this.entries){const c=this.entries[i];if(i in r||(c.type==="exact_optional"||c.type==="optional"||c.type==="nullish")&&c.default!==void 0){const p=i in r?r[i]:X(c),l=c["~run"]({value:p},n);if(l.issues){const u={type:"object",origin:"value",input:r,key:i,value:p};for(const d of l.issues)d.path?d.path.unshift(u):d.path=[u],(a=t.issues)==null||a.push(d);if(t.issues||(t.issues=l.issues),n.abortEarly){t.typed=!1;break}}l.typed||(t.typed=!1),t.value[i]=l.value}else if(c.fallback!==void 0)t.value[i]=ge(c);else if(c.type!=="exact_optional"&&c.type!=="optional"&&c.type!=="nullish"&&(f(this,"key",t,n,{input:void 0,expected:`"${i}"`,path:[{type:"object",origin:"key",input:r,key:i,value:r[i]}]}),n.abortEarly))break}}else f(this,"type",t,n);return t}}}function L(e,s){return{kind:"schema",type:"optional",reference:L,expects:`(${e.expects} | undefined)`,async:!1,wrapped:e,default:s,get"~standard"(){return T(this)},"~run"(t,n){return t.value===void 0&&(this.default!==void 0&&(t.value=X(this,t,n)),t.value===void 0)?(t.typed=!0,t):this.wrapped["~run"](t,n)}}}function h(e,s){return{kind:"schema",type:"picklist",reference:h,expects:Y(e.map(b),"|"),async:!1,options:e,message:s,get"~standard"(){return T(this)},"~run"(t,n){return this.options.includes(t.value)?t.typed=!0:f(this,"type",t,n),t}}}function o(e){return{kind:"schema",type:"string",reference:o,expects:"string",async:!1,message:e,get"~standard"(){return T(this)},"~run"(s,t){return typeof s.value=="string"?s.typed=!0:f(this,"type",s,t),s}}}function H(e){let s;if(e)for(const t of e)if(s)for(const n of t.issues)s.push(n);else s=t.issues;return s}function K(e,s){return{kind:"schema",type:"union",reference:K,expects:Y(e.map(t=>t.expects),"|"),async:!1,options:e,message:s,get"~standard"(){return T(this)},"~run"(t,n){let r,a,i;for(const c of this.options){const p=c["~run"]({value:t.value},n);if(p.typed)if(p.issues)a?a.push(p):a=[p];else{r=p;break}else i?i.push(p):i=[p]}if(r)return r;if(a){if(a.length===1)return a[0];f(this,"type",t,n,{issues:H(a)}),t.typed=!0}else{if((i==null?void 0:i.length)===1)return i[0];f(this,"type",t,n,{issues:H(i)})}return t}}}function $(e,s,t){const n=e["~run"]({value:s},G());if(n.issues)throw new de(n.issues);return n.value}function S(...e){return{...e[0],pipe:e,get"~standard"(){return T(this)},"~run"(s,t){for(const n of e)if(n.kind!=="metadata"){if(s.issues&&(n.kind==="schema"||n.kind==="transformation")){s.typed=!1;break}(!s.issues||!t.abortEarly&&!t.abortPipeEarly)&&(s=n["~run"](s,t))}return s}}}const fe=["toefl","ielts","cambridge"],ye=["reading","listening","writing","speaking"],he=["organization","grammarAndMechanics","languageAccuracy","developmentAndSupport"],Q=h(fe),Z=h(ye),Te=h(he),ee=h(["academic-discussion","email","legacy"]),Ee=y({role:h(["professor","student"]),name:o(),gender:h(["female","male"]),avatarUrl:o(),message:o()}),ve=y({id:o(),title:o(),category:o(),examType:Q,sectionType:Z,lastScore:k(E()),lastCompletedAt:k(o())});({...ve.entries});const te={id:o(),title:o(),category:o(),examType:Q,sectionType:Z},_e=y({...te,type:L(ee,"legacy"),instructions:o(),question:o(),passage:o(),recommendedWordCount:o()}),Se=y({...te,type:h(["academic-discussion","email"]),scenario:o(),discussion:L(y({professor:o(),studentA:o(),studentB:o()}))}),xe=N(K([_e,Se])),be=y({promptId:o(),essayText:S(o(),z(50))}),Ne=({promptCatalogService:e,attemptRepository:s,writingEvaluationService:t})=>{g.ipcMain.handle("prompt-catalog:list",()=>e.listPromptCatalog()),g.ipcMain.handle("prompt-catalog:get",(n,r)=>e.getPromptDetails(r)),g.ipcMain.handle("writing:submit",(n,r)=>t.submitAttempt($(be,r))),g.ipcMain.handle("attempts:get",(n,r)=>s.getAttemptDetails(r))};class Oe{constructor(s){this.attemptRepository=s}listPromptCatalog(){return this.attemptRepository.listPromptSummaries()}getPromptDetails(s){return this.attemptRepository.getPromptDetails(s)}}const Pe=e=>({id:e.id,title:e.title,category:e.category,examType:e.exam_type,sectionType:e.section_type,lastScore:e.last_score,lastCompletedAt:e.last_completed_at}),Ae=(e,s)=>({id:e.id,title:e.title,category:e.category,examType:e.exam_type,sectionType:e.section_type,promptType:e.prompt_type,scenario:e.scenario_html,discussionParticipants:JSON.parse(e.discussion_json),instructions:e.instructions,question:e.question,passage:e.passage,recommendedWordCount:e.recommended_word_count,lastScore:(s==null?void 0:s.last_score)??null,lastCompletedAt:(s==null?void 0:s.last_completed_at)??null});class Le{constructor(s){this.database=s}listPromptSummaries(){return this.database.prepare(`
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
      `).all().map(Pe)}getPromptDetails(s){const t=this.database.prepare("SELECT * FROM prompts WHERE id = ?").get(s);if(!t)throw new Error(`Prompt not found: ${s}`);const n=this.database.prepare(`
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
      `).get(s);return Ae(t,n)}createAttempt(s,t){const n=this.getPromptDetails(s.promptId),r=U.randomUUID(),a=new Date().toISOString();return this.database.prepare(`
          INSERT INTO attempts (id, prompt_id, essay_text, submitted_at, provider_type, status)
          VALUES (?, ?, ?, ?, ?, 'pending')
        `).run(r,s.promptId,s.essayText,a,t),{id:r,prompt:n,essayText:s.essayText,submittedAt:a,providerType:t,status:"pending",evaluation:null}}completeAttempt(s,t){const n=U.randomUUID(),r=new Date().toISOString();return this.database.prepare("UPDATE attempts SET status = 'completed' WHERE id = ?").run(s),this.database.prepare(`
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
        `).run(n,s,t.overallScore,t.overallMaxScore,t.summary,t.nextStep,JSON.stringify(t),r),this.getAttemptDetails(s)}markAttemptFailed(s){this.database.prepare("UPDATE attempts SET status = 'failed' WHERE id = ?").run(s)}getAttemptDetails(s){const t=this.database.prepare("SELECT * FROM attempts WHERE id = ?").get(s);if(!t)throw new Error(`Attempt not found: ${s}`);const n=this.getPromptDetails(t.prompt_id),r=this.database.prepare("SELECT payload_json FROM evaluations WHERE attempt_id = ?").get(s);return{id:t.id,prompt:n,essayText:t.essay_text,submittedAt:t.submitted_at,providerType:t.provider_type,status:t.status,evaluation:r?JSON.parse(r.payload_json):null}}}const Re=()=>process.env.APP_ROOT??process.cwd(),Ce=()=>m.resolve(Re(),"prompts","writing"),we=e=>e.toLowerCase().endsWith(".json"),De={female:["Dr. Maya Patel","Dr. Elena Brooks","Dr. Nina Alvarez","Dr. Rachel Kim","Dr. Sonia Bennett","Dr. Priya Shah"],male:["Dr. Marcus Bennett","Dr. Daniel Cho","Dr. Adrian Foster","Dr. Leo Ramirez","Dr. Victor Hall","Dr. Simon Carter"]},Ie={female:["Ava","Nora","Jasmine","Lena","Tanya","Mila","Naomi","Sofia"],male:["Sam","Ethan","Leo","Noah","Owen","Mateo","Julian","Miles"]},Ue={female:["/avatars/uifaces/125.jpg","/avatars/uifaces/128.jpg","/avatars/uifaces/217.jpg","/avatars/uifaces/219.jpg","/avatars/uifaces/220.jpg","/avatars/uifaces/221.jpg"],male:["/avatars/uifaces/80.jpg","/avatars/uifaces/92.jpg","/avatars/uifaces/218.jpg","/avatars/uifaces/222.jpg"]},Me=e=>e.replace(/<li>/gi,"- ").replace(/<\/li>/gi,`
`).replace(/<\/p>/gi,`

`).replace(/<br\s*\/?>/gi,`
`).replace(/<[^>]+>/g," ").replace(/&rsquo;/g,"'").replace(/&lsquo;/g,"'").replace(/&ldquo;/g,'"').replace(/&rdquo;/g,'"').replace(/&amp;/g,"&").replace(/\s+\n/g,`
`).replace(/\n{3,}/g,`

`).replace(/[ \t]{2,}/g," ").trim(),se=e=>Array.from(e).reduce((s,t)=>(s*31+t.charCodeAt(0))%2147483647,0),V=(e,s,t)=>{const n=se(s)%e.length;for(let r=0;r<e.length;r+=1){const a=e[(n+r)%e.length];if(!t.has(a))return t.add(a),a}return e[n]},D=e=>se(e)%2===0?"female":"male",I=(e,s,t,n,r,a)=>{const i=s==="professor"?De[n]:Ie[n],c=V(i,`${e}:${s}:name`,r),p=V(Ue[n],`${e}:${s}:avatar`,a);return{role:s,name:c,gender:n,avatarUrl:p,message:t}},ke=e=>{const s=e.match(/at least (\d+) words?/i);if(s)return`${s[1]} words minimum`;const t=e.match(/(\d+)\s*-\s*(\d+) words?/i);return t?`${t[1]}-${t[2]} words`:""},je=e=>{var i;const s=Me(e.scenario),t=e.type,n=[];if(e.type==="academic-discussion"&&e.discussion){const c=new Set,p=new Set,l=D(`${e.id}:professor`),u=D(`${e.id}:student-a`),d=D(`${e.id}:student-b`);n.push(I(e.id,"professor",e.discussion.professor,l,c,p),I(e.id,"student",e.discussion.studentA,u,c,p),I(e.id,"student",e.discussion.studentB,d,c,p))}const r=((i=n.find(c=>c.role==="professor"))==null?void 0:i.message)??"",a=n.filter(c=>c.role==="student").map(c=>`${c.name}: ${c.message}`).join(`

`);return{id:e.id,title:e.title,category:e.category,examType:e.examType,sectionType:e.sectionType,promptType:t,scenario:e.scenario,discussionParticipants:n,instructions:s,question:r,passage:a,recommendedWordCount:ke(s),lastScore:null,lastCompletedAt:null}},Fe=e=>({id:e.id,title:e.title,category:e.category,examType:e.examType,sectionType:e.sectionType,promptType:"legacy",scenario:`<p>${e.instructions}</p>`,discussionParticipants:[],instructions:e.instructions,question:e.question,passage:e.passage,recommendedWordCount:e.recommendedWordCount,lastScore:null,lastCompletedAt:null}),Xe=e=>"scenario"in e?je(e):Fe(e),$e=()=>{const e=Ce();if(!x.existsSync(e))throw new Error(`Writing prompts directory not found: ${e}`);const s=x.readdirSync(e).filter(we).sort();if(s.length===0)throw new Error(`No writing prompt JSON files found in ${e}`);return s.flatMap(t=>{const n=m.join(e,t),r=x.readFileSync(n,"utf8");try{const a=JSON.parse(r);return $(xe,a).map(Xe)}catch(a){const i=a instanceof Error?a.message:"Unknown validation error";throw new Error(`Invalid writing prompt file "${t}": ${i}`)}})},We=e=>{const s=new Set(e.prepare("SELECT name FROM pragma_table_info('prompts')").all().map(t=>t.name));s.has("prompt_type")||e.exec("ALTER TABLE prompts ADD COLUMN prompt_type TEXT NOT NULL DEFAULT 'legacy'"),s.has("scenario_html")||e.exec("ALTER TABLE prompts ADD COLUMN scenario_html TEXT NOT NULL DEFAULT ''"),s.has("discussion_json")||e.exec("ALTER TABLE prompts ADD COLUMN discussion_json TEXT NOT NULL DEFAULT '[]'")},Be=e=>{e.exec(`
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
  `),We(e)},Je=e=>{const s=e.prepare(`
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
  `),t=$e();e.transaction(()=>{t.forEach(r=>{s.run({...r,discussionParticipantsJson:JSON.stringify(r.discussionParticipants)})})})()},He=e=>{const s=m.join(e.getPath("userData"),"open-prep.db"),t=new ae(s);return Be(t),Je(t),t},Ve=y({criterion:Te,label:o(),score:S(E(),_(0),P(5)),maxScore:S(E(),_(1),P(5)),comment:o()}),qe=y({id:o(),excerpt:o(),replacement:o(),category:h(["grammar-spelling","relevance","idiomatic-word-choice","elaboration"]),explanation:o(),alternatives:L(N(o()),[]),startOffset:S(E(),_(0)),endOffset:S(E(),_(0))}),Ge=y({overallScore:S(E(),_(0),P(6)),overallMaxScore:S(E(),_(1),P(6)),summary:o(),nextStep:o(),criterionScores:N(Ve),highlights:N(qe)}),Ye=()=>["Return valid JSON only.","Evaluate the writing using TOEFL®-style writing criteria.","Use this exact shape:","{",'  "overallScore": number,','  "overallMaxScore": 6,','  "summary": string,','  "nextStep": string,','  "criterionScores": [','    { "criterion": "organization" | "grammarAndMechanics" | "languageAccuracy" | "developmentAndSupport", "label": string, "score": number, "maxScore": 5, "comment": string }',"  ],",'  "highlights": [','    { "id": string, "excerpt": string, "replacement": string, "category": "grammar-spelling" | "relevance" | "idiomatic-word-choice" | "elaboration", "explanation": string, "alternatives": string[], "startOffset": number, "endOffset": number }',"  ]","}","If no useful highlight exists, return an empty highlights array."].join(`
`),ze=e=>e.replace(/<li>/gi,"- ").replace(/<\/li>/gi,`
`).replace(/<\/p>/gi,`

`).replace(/<br\s*\/?>/gi,`
`).replace(/<[^>]+>/g," ").replace(/\s+\n/g,`
`).replace(/\n{3,}/g,`

`).replace(/[ \t]{2,}/g," ").trim(),Ke=e=>{const s=[`Exam: ${e.prompt.examType.toUpperCase()}`,`Section: ${e.prompt.sectionType.toUpperCase()}`,`Category: ${e.prompt.category}`,`Prompt type: ${e.prompt.promptType}`,`Scenario: ${ze(e.prompt.scenario)}`];return e.prompt.discussionParticipants.length>0&&s.push("Discussion:",...e.prompt.discussionParticipants.map(t=>`${t.name} (${t.role}): ${t.message}`)),e.prompt.recommendedWordCount&&s.push(`Recommended length: ${e.prompt.recommendedWordCount}`),s},Qe=(e,s)=>[s.trim(),"",Ye(),"","Context:",...Ke(e),"","Student essay:",e.essayText,"","Keep the feedback concise, specific, and encouraging."].join(`
`),Ze=[m.join(M.homedir(),".local","bin"),m.join(M.homedir(),".npm-global","bin"),"/opt/homebrew/bin","/usr/local/bin"],et=e=>{const s=new Set;return e.filter(t=>!t||s.has(t)?!1:(s.add(t),!0))},tt=()=>{var s;const e=(s=process.env.OPEN_PREP_CODEX_PATH)==null?void 0:s.trim();return e&&e.length>0?e:"codex"},st=(e=process.env)=>{const s=(e.PATH??"").split(m.delimiter).filter(n=>n.length>0),t=et([...Ze,...s]).join(m.delimiter);return{...e,PATH:t}},nt=e=>["Codex CLI was not found.","Install Codex CLI or set OPEN_PREP_CODEX_PATH to its full executable path.",`PATH checked: ${e.PATH??""}`].join(" "),rt=()=>process.env.APP_ROOT??process.cwd(),it=()=>m.resolve(rt(),"prompts/system/codex/writing-evaluation.md"),ot=async()=>{const e=it();try{return await x.promises.readFile(e,"utf8")}catch{throw new Error(`Missing Codex system prompt file at ${e}. Create it before running writing evaluation.`)}},at=9e4,ct="gpt-5.4-mini",pt="low",lt=e=>{if(!e||typeof e!="object")return e;const s=e,t=(Array.isArray(s.highlights),s.highlights);return Array.isArray(t)?{...s,highlights:t.map(n=>{if(!n||typeof n!="object")return n;const r=n;return{...r,alternatives:Array.isArray(r.alternatives)?r.alternatives:[]}})}:s};class ut{constructor(){A(this,"id","codex")}async evaluateWriting(s){const t=m.join(M.tmpdir(),`open-prep-codex-${U.randomUUID()}.json`),n=await ot(),r=Qe(s,n),a=["exec","--skip-git-repo-check","--output-last-message",t,"--model",ct,"--config",`model_reasoning_effort="${pt}"`,"-"];await new Promise((p,l)=>{const u={...st(),APP_ROOT:process.env.APP_ROOT,VITE_PUBLIC:process.env.VITE_PUBLIC},d=ce.spawn(tt(),a,{env:u,stdio:["pipe","pipe","pipe"]});let W="";const B=setTimeout(()=>{d.kill("SIGTERM"),l(new Error("Codex evaluation timed out."))},at);d.stderr.on("data",v=>{W+=v.toString()}),d.on("error",v=>{clearTimeout(B),l(v.code==="ENOENT"?new Error(nt(u)):v)}),d.on("close",v=>{if(clearTimeout(B),v!==0){l(new Error(W||`Codex exited with code ${String(v)}.`));return}p()}),d.stdin.write(r),d.stdin.end()});const i=await x.promises.readFile(t,"utf8");await x.promises.rm(t,{force:!0});const c=lt(JSON.parse(i));return $(Ge,c)}}class mt{constructor(){A(this,"id","mock")}async evaluateWriting(s){const t=s.essayText.slice(0,Math.min(s.essayText.length,32));return{overallScore:4,overallMaxScore:6,summary:"Your response is organized and readable, but it still needs more precise vocabulary and stronger support for the main claim.",nextStep:"Add one concrete example and replace at least two informal phrases with more academic wording.",criterionScores:[{criterion:"organization",label:"Organization",score:5,maxScore:5,comment:"The response follows a clear structure and moves logically from the main claim to supporting points."},{criterion:"grammarAndMechanics",label:"Grammar & Mechanics",score:5,maxScore:5,comment:"Grammar is generally correct and sentence boundaries are controlled well throughout the response."},{criterion:"languageAccuracy",label:"Language Accuracy",score:3,maxScore:5,comment:"The language is understandable, but the vocabulary range is limited and several choices sound informal for TOEFL® writing."},{criterion:"developmentAndSupport",label:"Development & Support",score:2,maxScore:5,comment:"The response states a position, but it would benefit from more specific evidence and a fuller explanation of the reasoning."}],highlights:[{id:"mock-highlight-1",excerpt:t,replacement:"particularly",category:"idiomatic-word-choice",explanation:"This phrase can sound too conversational for an academic response. A more precise adverb keeps the tone formal.",alternatives:["particularly","notably","especially","significantly"],startOffset:0,endOffset:Math.min(6,s.essayText.length)}]}}}const dt=()=>process.env.OPEN_PREP_AI_PROVIDER==="mock"?new mt:new ut;class gt{constructor(s,t){A(this,"provider",dt());this.promptCatalogService=s,this.attemptRepository=t}async submitAttempt(s){const t=this.promptCatalogService.getPromptDetails(s.promptId),n=this.attemptRepository.createAttempt(s,this.provider.id);try{const r=await this.provider.evaluateWriting({prompt:t,essayText:s.essayText});return this.attemptRepository.completeAttempt(n.id,r)}catch(r){throw this.attemptRepository.markAttemptFailed(n.id),r}}}const ne=__dirname;process.env.APP_ROOT=m.join(ne,"..");const{VITE_DEV_SERVER_URL:j}=process.env,F=m.join(process.env.APP_ROOT,"dist"),re="Open Prep";process.env.VITE_PUBLIC=j?m.join(process.env.APP_ROOT,"public"):F;let O=null;const q=()=>{const e=process.env.VITE_PUBLIC??F,s=m.join(e,"logo/logo_icon_only.svg");O=new g.BrowserWindow({width:1440,height:1024,minWidth:1200,minHeight:820,backgroundColor:"#f5f3ef",title:re,icon:s,webPreferences:{preload:m.join(ne,"preload.js"),contextIsolation:!0,nodeIntegration:!1}}),j?(O.loadURL(j),O.webContents.openDevTools({mode:"detach"})):O.loadFile(m.join(F,"index.html"))};g.app.whenReady().then(()=>{g.app.setName(re);const e=He(g.app),s=new Le(e),t=new Oe(s),n=new gt(t,s);Ne({promptCatalogService:t,attemptRepository:s,writingEvaluationService:n}),q(),g.app.on("activate",()=>{g.BrowserWindow.getAllWindows().length===0&&q()})});g.app.on("window-all-closed",()=>{process.platform!=="darwin"&&(g.app.quit(),O=null)});
