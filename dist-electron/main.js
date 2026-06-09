"use strict";var ae=Object.defineProperty;var ce=(e,s,t)=>s in e?ae(e,s,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[s]=t;var A=(e,s,t)=>ce(e,typeof s!="symbol"?s+"":s,t);const f=require("electron"),m=require("node:path"),k=require("node:crypto"),pe=require("better-sqlite3"),O=require("node:fs"),le=require("node:child_process"),j=require("node:os"),ue={lang:void 0,message:void 0,abortEarly:void 0,abortPipeEarly:void 0};function z(e){return ue}let w;function me(e){return w==null?void 0:w.get(e)}let D;function de(e){return D==null?void 0:D.get(e)}let I;function fe(e,s){var t;return(t=I==null?void 0:I.get(e))==null?void 0:t.get(s)}function S(e){var t,n;const s=typeof e;return s==="string"?`"${e}"`:s==="number"||s==="bigint"||s==="boolean"?`${e}`:s==="object"||s==="function"?(e&&((n=(t=Object.getPrototypeOf(e))==null?void 0:t.constructor)==null?void 0:n.name))??"null":s}function g(e,s,t,n,r){const o=r&&"input"in r?r.input:t.value,i=(r==null?void 0:r.expected)??e.expects??null,c=(r==null?void 0:r.received)??S(o),p={kind:e.kind,type:e.type,input:o,expected:i,received:c,message:`Invalid ${s}: ${i?`Expected ${i} but r`:"R"}eceived ${c}`,requirement:e.requirement,path:r==null?void 0:r.path,issues:r==null?void 0:r.issues,lang:n.lang,abortEarly:n.abortEarly,abortPipeEarly:n.abortPipeEarly},u=e.kind==="schema",l=(r==null?void 0:r.message)??e.message??fe(e.reference,p.lang)??(u?de(p.lang):null)??n.message??me(p.lang);l!==void 0&&(p.message=typeof l=="function"?l(p):l),u&&(t.typed=!1),t.issues?t.issues.push(p):t.issues=[p]}const H=new WeakMap;function E(e){let s=H.get(e);return s||(s={version:1,vendor:"valibot",validate(t){return e["~run"]({value:t},z())}},H.set(e,s)),s}function K(e,s){const t=[...new Set(e)];return t.length>1?`(${t.join(` ${s} `)})`:t[0]??"never"}var ge=class extends Error{constructor(e){super(e[0].message),this.name="ValiError",this.issues=e}};function P(e,s){return{kind:"validation",type:"max_value",reference:P,async:!1,expects:`<=${e instanceof Date?e.toJSON():S(e)}`,requirement:e,message:s,"~run"(t,n){return t.typed&&!(t.value<=this.requirement)&&g(this,"value",t,n,{received:t.value instanceof Date?t.value.toJSON():S(t.value)}),t}}}function Q(e,s){return{kind:"validation",type:"min_length",reference:Q,async:!1,expects:`>=${e}`,requirement:e,message:s,"~run"(t,n){return t.typed&&t.value.length<this.requirement&&g(this,"length",t,n,{received:`${t.value.length}`}),t}}}function _(e,s){return{kind:"validation",type:"min_value",reference:_,async:!1,expects:`>=${e instanceof Date?e.toJSON():S(e)}`,requirement:e,message:s,"~run"(t,n){return t.typed&&!(t.value>=this.requirement)&&g(this,"value",t,n,{received:t.value instanceof Date?t.value.toJSON():S(t.value)}),t}}}function ye(e,s,t){return typeof e.fallback=="function"?e.fallback(s,t):e.fallback}function W(e,s,t){return typeof e.default=="function"?e.default(s,t):e.default}function b(e,s){return{kind:"schema",type:"array",reference:b,expects:"Array",async:!1,item:e,message:s,get"~standard"(){return E(this)},"~run"(t,n){var o;const r=t.value;if(Array.isArray(r)){t.typed=!0,t.value=[];for(let i=0;i<r.length;i++){const c=r[i],p=this.item["~run"]({value:c},n);if(p.issues){const u={type:"array",origin:"value",input:r,key:i,value:c};for(const l of p.issues)l.path?l.path.unshift(u):l.path=[u],(o=t.issues)==null||o.push(l);if(t.issues||(t.issues=p.issues),n.abortEarly){t.typed=!1;break}}p.typed||(t.typed=!1),t.value.push(p.value)}}else g(this,"type",t,n);return t}}}function F(e,s){return{kind:"schema",type:"nullable",reference:F,expects:`(${e.expects} | null)`,async:!1,wrapped:e,default:s,get"~standard"(){return E(this)},"~run"(t,n){return t.value===null&&(this.default!==void 0&&(t.value=W(this,t,n)),t.value===null)?(t.typed=!0,t):this.wrapped["~run"](t,n)}}}function v(e){return{kind:"schema",type:"number",reference:v,expects:"number",async:!1,message:e,get"~standard"(){return E(this)},"~run"(s,t){return typeof s.value=="number"&&!isNaN(s.value)?s.typed=!0:g(this,"type",s,t),s}}}function y(e,s){return{kind:"schema",type:"object",reference:y,expects:"Object",async:!1,entries:e,message:s,get"~standard"(){return E(this)},"~run"(t,n){var o;const r=t.value;if(r&&typeof r=="object"){t.typed=!0,t.value={};for(const i in this.entries){const c=this.entries[i];if(i in r||(c.type==="exact_optional"||c.type==="optional"||c.type==="nullish")&&c.default!==void 0){const p=i in r?r[i]:W(c),u=c["~run"]({value:p},n);if(u.issues){const l={type:"object",origin:"value",input:r,key:i,value:p};for(const d of u.issues)d.path?d.path.unshift(l):d.path=[l],(o=t.issues)==null||o.push(d);if(t.issues||(t.issues=u.issues),n.abortEarly){t.typed=!1;break}}u.typed||(t.typed=!1),t.value[i]=u.value}else if(c.fallback!==void 0)t.value[i]=ye(c);else if(c.type!=="exact_optional"&&c.type!=="optional"&&c.type!=="nullish"&&(g(this,"key",t,n,{input:void 0,expected:`"${i}"`,path:[{type:"object",origin:"key",input:r,key:i,value:r[i]}]}),n.abortEarly))break}}else g(this,"type",t,n);return t}}}function L(e,s){return{kind:"schema",type:"optional",reference:L,expects:`(${e.expects} | undefined)`,async:!1,wrapped:e,default:s,get"~standard"(){return E(this)},"~run"(t,n){return t.value===void 0&&(this.default!==void 0&&(t.value=W(this,t,n)),t.value===void 0)?(t.typed=!0,t):this.wrapped["~run"](t,n)}}}function T(e,s){return{kind:"schema",type:"picklist",reference:T,expects:K(e.map(S),"|"),async:!1,options:e,message:s,get"~standard"(){return E(this)},"~run"(t,n){return this.options.includes(t.value)?t.typed=!0:g(this,"type",t,n),t}}}function a(e){return{kind:"schema",type:"string",reference:a,expects:"string",async:!1,message:e,get"~standard"(){return E(this)},"~run"(s,t){return typeof s.value=="string"?s.typed=!0:g(this,"type",s,t),s}}}function V(e){let s;if(e)for(const t of e)if(s)for(const n of t.issues)s.push(n);else s=t.issues;return s}function Z(e,s){return{kind:"schema",type:"union",reference:Z,expects:K(e.map(t=>t.expects),"|"),async:!1,options:e,message:s,get"~standard"(){return E(this)},"~run"(t,n){let r,o,i;for(const c of this.options){const p=c["~run"]({value:t.value},n);if(p.typed)if(p.issues)o?o.push(p):o=[p];else{r=p;break}else i?i.push(p):i=[p]}if(r)return r;if(o){if(o.length===1)return o[0];g(this,"type",t,n,{issues:V(o)}),t.typed=!0}else{if((i==null?void 0:i.length)===1)return i[0];g(this,"type",t,n,{issues:V(i)})}return t}}}function B(e,s,t){const n=e["~run"]({value:s},z());if(n.issues)throw new ge(n.issues);return n.value}function x(...e){return{...e[0],pipe:e,get"~standard"(){return E(this)},"~run"(s,t){for(const n of e)if(n.kind!=="metadata"){if(s.issues&&(n.kind==="schema"||n.kind==="transformation")){s.typed=!1;break}(!s.issues||!t.abortEarly&&!t.abortPipeEarly)&&(s=n["~run"](s,t))}return s}}}const he=["toefl","ielts","cambridge"],Te=["reading","listening","writing","speaking"],Ee=["organization","grammarAndMechanics","languageAccuracy","developmentAndSupport"],ee=T(he),te=T(Te),ve=T(Ee),se=T(["academic-discussion","email","legacy"]),_e=y({role:T(["professor","student"]),name:a(),gender:T(["female","male"]),avatarUrl:a(),message:a()}),xe=y({id:a(),title:a(),category:a(),examType:ee,sectionType:te,lastScore:F(v()),lastCompletedAt:F(a())});({...xe.entries});const ne={id:a(),title:a(),category:a(),examType:ee,sectionType:te},Oe=y({...ne,type:L(se,"legacy"),instructions:a(),question:a(),passage:a(),recommendedWordCount:a()}),Se=y({...ne,type:T(["academic-discussion","email"]),scenario:a(),discussion:L(y({professor:a(),studentA:a(),studentB:a()}))}),be=b(Z([Oe,Se])),Ne=y({promptId:a(),essayText:x(a(),Q(50))}),Pe=({promptCatalogService:e,attemptRepository:s,writingEvaluationService:t})=>{f.ipcMain.handle("prompt-catalog:list",()=>e.listPromptCatalog()),f.ipcMain.handle("prompt-catalog:get",(n,r)=>e.getPromptDetails(r)),f.ipcMain.handle("writing:submit",(n,r)=>t.submitAttempt(B(Ne,r))),f.ipcMain.handle("attempts:get",(n,r)=>s.getAttemptDetails(r))};class Ae{constructor(s){this.attemptRepository=s}listPromptCatalog(){return this.attemptRepository.listPromptSummaries()}getPromptDetails(s){return this.attemptRepository.getPromptDetails(s)}}const Le=e=>({id:e.id,title:e.title,category:e.category,examType:e.exam_type,sectionType:e.section_type,lastScore:e.last_score,lastCompletedAt:e.last_completed_at}),Re=(e,s)=>({id:e.id,title:e.title,category:e.category,examType:e.exam_type,sectionType:e.section_type,promptType:e.prompt_type,scenario:e.scenario_html,discussionParticipants:JSON.parse(e.discussion_json),instructions:e.instructions,question:e.question,passage:e.passage,recommendedWordCount:e.recommended_word_count,lastScore:(s==null?void 0:s.last_score)??null,lastCompletedAt:(s==null?void 0:s.last_completed_at)??null});class Ce{constructor(s){this.database=s}listPromptSummaries(){return this.database.prepare(`
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
      `).all().map(Le)}getPromptDetails(s){const t=this.database.prepare("SELECT * FROM prompts WHERE id = ?").get(s);if(!t)throw new Error(`Prompt not found: ${s}`);const n=this.database.prepare(`
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
      `).get(s);return Re(t,n)}createAttempt(s,t){const n=this.getPromptDetails(s.promptId),r=k.randomUUID(),o=new Date().toISOString();return this.database.prepare(`
          INSERT INTO attempts (id, prompt_id, essay_text, submitted_at, provider_type, status)
          VALUES (?, ?, ?, ?, ?, 'pending')
        `).run(r,s.promptId,s.essayText,o,t),{id:r,prompt:n,essayText:s.essayText,submittedAt:o,providerType:t,status:"pending",evaluation:null}}completeAttempt(s,t){const n=k.randomUUID(),r=new Date().toISOString();return this.database.prepare("UPDATE attempts SET status = 'completed' WHERE id = ?").run(s),this.database.prepare(`
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
        `).run(n,s,t.overallScore,t.overallMaxScore,t.summary,t.nextStep,JSON.stringify(t),r),this.getAttemptDetails(s)}markAttemptFailed(s){this.database.prepare("UPDATE attempts SET status = 'failed' WHERE id = ?").run(s)}getAttemptDetails(s){const t=this.database.prepare("SELECT * FROM attempts WHERE id = ?").get(s);if(!t)throw new Error(`Attempt not found: ${s}`);const n=this.getPromptDetails(t.prompt_id),r=this.database.prepare("SELECT payload_json FROM evaluations WHERE attempt_id = ?").get(s);return{id:t.id,prompt:n,essayText:t.essay_text,submittedAt:t.submitted_at,providerType:t.provider_type,status:t.status,evaluation:r?JSON.parse(r.payload_json):null}}}const we=()=>process.env.APP_ROOT??process.cwd(),De=()=>m.resolve(we(),"prompts","writing"),Ie=e=>e.toLowerCase().endsWith(".json"),Ue={female:["Dr. Maya Patel","Dr. Elena Brooks","Dr. Nina Alvarez","Dr. Rachel Kim","Dr. Sonia Bennett","Dr. Priya Shah"],male:["Dr. Marcus Bennett","Dr. Daniel Cho","Dr. Adrian Foster","Dr. Leo Ramirez","Dr. Victor Hall","Dr. Simon Carter"]},Me={female:["Ava","Nora","Jasmine","Lena","Tanya","Mila","Naomi","Sofia"],male:["Sam","Ethan","Leo","Noah","Owen","Mateo","Julian","Miles"]},ke={female:["/avatars/uifaces/125.jpg","/avatars/uifaces/128.jpg","/avatars/uifaces/217.jpg","/avatars/uifaces/219.jpg","/avatars/uifaces/220.jpg","/avatars/uifaces/221.jpg"],male:["/avatars/uifaces/80.jpg","/avatars/uifaces/92.jpg","/avatars/uifaces/218.jpg","/avatars/uifaces/222.jpg"]},je=e=>e.replace(/<li>/gi,"- ").replace(/<\/li>/gi,`
`).replace(/<\/p>/gi,`

`).replace(/<br\s*\/?>/gi,`
`).replace(/<[^>]+>/g," ").replace(/&rsquo;/g,"'").replace(/&lsquo;/g,"'").replace(/&ldquo;/g,'"').replace(/&rdquo;/g,'"').replace(/&amp;/g,"&").replace(/\s+\n/g,`
`).replace(/\n{3,}/g,`

`).replace(/[ \t]{2,}/g," ").trim(),re=e=>Array.from(e).reduce((s,t)=>(s*31+t.charCodeAt(0))%2147483647,0),G=(e,s,t)=>{const n=re(s)%e.length;for(let r=0;r<e.length;r+=1){const o=e[(n+r)%e.length];if(!t.has(o))return t.add(o),o}return e[n]},U=e=>re(e)%2===0?"female":"male",M=(e,s,t,n,r,o)=>{const i=s==="professor"?Ue[n]:Me[n],c=G(i,`${e}:${s}:name`,r),p=G(ke[n],`${e}:${s}:avatar`,o);return{role:s,name:c,gender:n,avatarUrl:p,message:t}},Fe=e=>{const s=e.match(/at least (\d+) words?/i);if(s)return`${s[1]} words minimum`;const t=e.match(/(\d+)\s*-\s*(\d+) words?/i);return t?`${t[1]}-${t[2]} words`:""},$e=e=>{var i;const s=je(e.scenario),t=e.type,n=[];if(e.type==="academic-discussion"&&e.discussion){const c=new Set,p=new Set,u=U(`${e.id}:professor`),l=U(`${e.id}:student-a`),d=U(`${e.id}:student-b`);n.push(M(e.id,"professor",e.discussion.professor,u,c,p),M(e.id,"student",e.discussion.studentA,l,c,p),M(e.id,"student",e.discussion.studentB,d,c,p))}const r=((i=n.find(c=>c.role==="professor"))==null?void 0:i.message)??"",o=n.filter(c=>c.role==="student").map(c=>`${c.name}: ${c.message}`).join(`

`);return{id:e.id,title:e.title,category:e.category,examType:e.examType,sectionType:e.sectionType,promptType:t,scenario:e.scenario,discussionParticipants:n,instructions:s,question:r,passage:o,recommendedWordCount:Fe(s),lastScore:null,lastCompletedAt:null}},Xe=e=>({id:e.id,title:e.title,category:e.category,examType:e.examType,sectionType:e.sectionType,promptType:"legacy",scenario:`<p>${e.instructions}</p>`,discussionParticipants:[],instructions:e.instructions,question:e.question,passage:e.passage,recommendedWordCount:e.recommendedWordCount,lastScore:null,lastCompletedAt:null}),We=e=>"scenario"in e?$e(e):Xe(e),Be=()=>{const e=De();if(!O.existsSync(e))throw new Error(`Writing prompts directory not found: ${e}`);const s=O.readdirSync(e).filter(Ie).sort();if(s.length===0)throw new Error(`No writing prompt JSON files found in ${e}`);return s.flatMap(t=>{const n=m.join(e,t),r=O.readFileSync(n,"utf8");try{const o=JSON.parse(r);return B(be,o).map(We)}catch(o){const i=o instanceof Error?o.message:"Unknown validation error";throw new Error(`Invalid writing prompt file "${t}": ${i}`)}})},Je=e=>{const s=new Set(e.prepare("SELECT name FROM pragma_table_info('prompts')").all().map(t=>t.name));s.has("prompt_type")||e.exec("ALTER TABLE prompts ADD COLUMN prompt_type TEXT NOT NULL DEFAULT 'legacy'"),s.has("scenario_html")||e.exec("ALTER TABLE prompts ADD COLUMN scenario_html TEXT NOT NULL DEFAULT ''"),s.has("discussion_json")||e.exec("ALTER TABLE prompts ADD COLUMN discussion_json TEXT NOT NULL DEFAULT '[]'")},He=e=>{e.exec(`
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
  `),Je(e)},Ve=e=>{const s=e.prepare(`
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
  `),t=Be();e.transaction(()=>{t.forEach(r=>{s.run({...r,discussionParticipantsJson:JSON.stringify(r.discussionParticipants)})})})()},Ge=e=>{const s=m.join(e.getPath("userData"),"open-prep.db"),t=new pe(s);return He(t),Ve(t),t},Ye=y({criterion:ve,label:a(),score:x(v(),_(0),P(5)),maxScore:x(v(),_(1),P(5)),comment:a()}),qe=y({id:a(),excerpt:a(),replacement:a(),category:T(["grammar-spelling","relevance","idiomatic-word-choice","elaboration"]),explanation:a(),alternatives:L(b(a()),[]),startOffset:x(v(),_(0)),endOffset:x(v(),_(0))}),ze=y({overallScore:x(v(),_(0),P(6)),overallMaxScore:x(v(),_(1),P(6)),summary:a(),nextStep:a(),criterionScores:b(Ye),highlights:b(qe)}),Ke=()=>["Return valid JSON only.","Evaluate the writing using TOEFL®-style writing criteria.","Use this exact shape:","{",'  "overallScore": number,','  "overallMaxScore": 6,','  "summary": string,','  "nextStep": string,','  "criterionScores": [','    { "criterion": "organization" | "grammarAndMechanics" | "languageAccuracy" | "developmentAndSupport", "label": string, "score": number, "maxScore": 5, "comment": string }',"  ],",'  "highlights": [','    { "id": string, "excerpt": string, "replacement": string, "category": "grammar-spelling" | "relevance" | "idiomatic-word-choice" | "elaboration", "explanation": string, "alternatives": string[], "startOffset": number, "endOffset": number }',"  ]","}","If no useful highlight exists, return an empty highlights array.","Every highlight must include startOffset and endOffset from the student essay. Omit highlights when exact offsets are unclear."].join(`
`),Qe=e=>e.replace(/<li>/gi,"- ").replace(/<\/li>/gi,`
`).replace(/<\/p>/gi,`

`).replace(/<br\s*\/?>/gi,`
`).replace(/<[^>]+>/g," ").replace(/\s+\n/g,`
`).replace(/\n{3,}/g,`

`).replace(/[ \t]{2,}/g," ").trim(),Ze=e=>{const s=[`Exam: ${e.prompt.examType.toUpperCase()}`,`Section: ${e.prompt.sectionType.toUpperCase()}`,`Category: ${e.prompt.category}`,`Prompt type: ${e.prompt.promptType}`,`Scenario: ${Qe(e.prompt.scenario)}`];return e.prompt.discussionParticipants.length>0&&s.push("Discussion:",...e.prompt.discussionParticipants.map(t=>`${t.name} (${t.role}): ${t.message}`)),e.prompt.recommendedWordCount&&s.push(`Recommended length: ${e.prompt.recommendedWordCount}`),s},et=(e,s)=>[s.trim(),"",Ke(),"","Context:",...Ze(e),"","Student essay:",e.essayText,"","Keep the feedback concise, specific, and encouraging."].join(`
`),tt=[m.join(j.homedir(),".local","bin"),m.join(j.homedir(),".npm-global","bin"),"/opt/homebrew/bin","/usr/local/bin"],st=e=>{const s=new Set;return e.filter(t=>!t||s.has(t)?!1:(s.add(t),!0))},nt=()=>{var s;const e=(s=process.env.OPEN_PREP_CODEX_PATH)==null?void 0:s.trim();return e&&e.length>0?e:"codex"},rt=(e=process.env)=>{const t=Number(e.OPEN_PREP_CODEX_TIMEOUT_MS);return Number.isFinite(t)&&t>0?t:3e5},it=(e=process.env)=>{const s=(e.PATH??"").split(m.delimiter).filter(n=>n.length>0),t=st([...tt,...s]).join(m.delimiter);return{...e,PATH:t}},ot=e=>["Codex CLI was not found.","Install Codex CLI or set OPEN_PREP_CODEX_PATH to its full executable path.",`PATH checked: ${e.PATH??""}`].join(" "),at=()=>process.env.APP_ROOT??process.cwd(),ct=()=>m.resolve(at(),"prompts/system/codex/writing-evaluation.md"),pt=async()=>{const e=ct();try{return await O.promises.readFile(e,"utf8")}catch{throw new Error(`Missing Codex system prompt file at ${e}. Create it before running writing evaluation.`)}},lt="gpt-5.4-mini",ut="low",Y=e=>typeof e=="number"&&Number.isFinite(e)&&e>=0,mt=(e,s)=>{if(Y(s.startOffset)&&Y(s.endOffset))return{startOffset:s.startOffset,endOffset:Math.max(s.startOffset,s.endOffset)};if(typeof s.excerpt!="string"||s.excerpt.trim().length===0)return null;const t=e.indexOf(s.excerpt);return t<0?null:{startOffset:t,endOffset:t+s.excerpt.length}},dt=(e,s)=>{if(!e||typeof e!="object")return e;const t=e,n=(Array.isArray(t.highlights),t.highlights);return Array.isArray(n)?{...t,highlights:n.flatMap(r=>{if(!r||typeof r!="object")return[];const o=r,i=mt(s,o);return i?[{...o,alternatives:Array.isArray(o.alternatives)?o.alternatives:[],...i}]:[]})}:t};class ft{constructor(){A(this,"id","codex")}async evaluateWriting(s){const t=m.join(j.tmpdir(),`open-prep-codex-${k.randomUUID()}.json`),n=await pt(),r=et(s,n),o=["exec","--skip-git-repo-check","--output-last-message",t,"--model",lt,"--config",`model_reasoning_effort="${ut}"`,"-"];await new Promise((p,u)=>{const l={...it(),APP_ROOT:process.env.APP_ROOT,VITE_PUBLIC:process.env.VITE_PUBLIC},d=le.spawn(nt(),o,{env:l,stdio:["pipe","pipe","pipe"]});let R="";const C=rt(l),J=setTimeout(()=>{d.kill("SIGTERM");const h=R.trim();u(new Error(h.length>0?`Codex evaluation timed out after ${String(C)}ms. ${h}`:`Codex evaluation timed out after ${String(C)}ms.`))},C);d.stderr.on("data",h=>{R+=h.toString()}),d.on("error",h=>{clearTimeout(J),u(h.code==="ENOENT"?new Error(ot(l)):h)}),d.on("close",h=>{if(clearTimeout(J),h!==0){u(new Error(R||`Codex exited with code ${String(h)}.`));return}p()}),d.stdin.write(r),d.stdin.end()});const i=await O.promises.readFile(t,"utf8");await O.promises.rm(t,{force:!0});const c=dt(JSON.parse(i),s.essayText);return B(ze,c)}}class gt{constructor(){A(this,"id","mock")}async evaluateWriting(s){const t=s.essayText.slice(0,Math.min(s.essayText.length,32));return{overallScore:4,overallMaxScore:6,summary:"Your response is organized and readable, but it still needs more precise vocabulary and stronger support for the main claim.",nextStep:"Add one concrete example and replace at least two informal phrases with more academic wording.",criterionScores:[{criterion:"organization",label:"Organization",score:5,maxScore:5,comment:"The response follows a clear structure and moves logically from the main claim to supporting points."},{criterion:"grammarAndMechanics",label:"Grammar & Mechanics",score:5,maxScore:5,comment:"Grammar is generally correct and sentence boundaries are controlled well throughout the response."},{criterion:"languageAccuracy",label:"Language Accuracy",score:3,maxScore:5,comment:"The language is understandable, but the vocabulary range is limited and several choices sound informal for TOEFL® writing."},{criterion:"developmentAndSupport",label:"Development & Support",score:2,maxScore:5,comment:"The response states a position, but it would benefit from more specific evidence and a fuller explanation of the reasoning."}],highlights:[{id:"mock-highlight-1",excerpt:t,replacement:"particularly",category:"idiomatic-word-choice",explanation:"This phrase can sound too conversational for an academic response. A more precise adverb keeps the tone formal.",alternatives:["particularly","notably","especially","significantly"],startOffset:0,endOffset:Math.min(6,s.essayText.length)}]}}}const yt=()=>process.env.OPEN_PREP_AI_PROVIDER==="mock"?new gt:new ft;class ht{constructor(s,t){A(this,"provider",yt());this.promptCatalogService=s,this.attemptRepository=t}async submitAttempt(s){const t=this.promptCatalogService.getPromptDetails(s.promptId),n=this.attemptRepository.createAttempt(s,this.provider.id);try{const r=await this.provider.evaluateWriting({prompt:t,essayText:s.essayText});return this.attemptRepository.completeAttempt(n.id,r)}catch(r){throw this.attemptRepository.markAttemptFailed(n.id),r}}}const ie=__dirname;process.env.APP_ROOT=m.join(ie,"..");const{VITE_DEV_SERVER_URL:$}=process.env,X=m.join(process.env.APP_ROOT,"dist"),oe="OpenPrep";process.env.VITE_PUBLIC=$?m.join(process.env.APP_ROOT,"public"):X;let N=null;const q=()=>{const e=process.env.VITE_PUBLIC??X,s=m.join(e,"logo/logo_icon_only.svg");N=new f.BrowserWindow({width:1440,height:1024,minWidth:1200,minHeight:820,backgroundColor:"#f5f3ef",title:oe,icon:s,webPreferences:{preload:m.join(ie,"preload.js"),contextIsolation:!0,nodeIntegration:!1}}),$?(N.loadURL($),N.webContents.openDevTools({mode:"detach"})):N.loadFile(m.join(X,"index.html"))};f.app.whenReady().then(()=>{f.app.setName(oe);const e=Ge(f.app),s=new Ce(e),t=new Ae(s),n=new ht(t,s);Pe({promptCatalogService:t,attemptRepository:s,writingEvaluationService:n}),q(),f.app.on("activate",()=>{f.BrowserWindow.getAllWindows().length===0&&q()})});f.app.on("window-all-closed",()=>{process.platform!=="darwin"&&(f.app.quit(),N=null)});
