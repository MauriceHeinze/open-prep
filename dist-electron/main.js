"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
const electron = require("electron");
const path = require("node:path");
const node_crypto = require("node:crypto");
const Database = require("better-sqlite3");
const fs = require("node:fs");
const node_child_process = require("node:child_process");
const os = require("node:os");
const DEFAULT_CONFIG = {
  lang: void 0,
  message: void 0,
  abortEarly: void 0,
  abortPipeEarly: void 0
};
// @__NO_SIDE_EFFECTS__
function getGlobalConfig(config$1) {
  return DEFAULT_CONFIG;
}
let store$3;
// @__NO_SIDE_EFFECTS__
function getGlobalMessage(lang) {
  return store$3 == null ? void 0 : store$3.get(lang);
}
let store$2;
// @__NO_SIDE_EFFECTS__
function getSchemaMessage(lang) {
  return store$2 == null ? void 0 : store$2.get(lang);
}
let store$1;
// @__NO_SIDE_EFFECTS__
function getSpecificMessage(reference, lang) {
  var _a;
  return (_a = store$1 == null ? void 0 : store$1.get(reference)) == null ? void 0 : _a.get(lang);
}
// @__NO_SIDE_EFFECTS__
function _stringify(input) {
  var _a, _b;
  const type = typeof input;
  if (type === "string") return `"${input}"`;
  if (type === "number" || type === "bigint" || type === "boolean") return `${input}`;
  if (type === "object" || type === "function") return (input && ((_b = (_a = Object.getPrototypeOf(input)) == null ? void 0 : _a.constructor) == null ? void 0 : _b.name)) ?? "null";
  return type;
}
function _addIssue(context, label, dataset, config$1, other) {
  const input = other && "input" in other ? other.input : dataset.value;
  const expected = (other == null ? void 0 : other.expected) ?? context.expects ?? null;
  const received = (other == null ? void 0 : other.received) ?? /* @__PURE__ */ _stringify(input);
  const issue = {
    kind: context.kind,
    type: context.type,
    input,
    expected,
    received,
    message: `Invalid ${label}: ${expected ? `Expected ${expected} but r` : "R"}eceived ${received}`,
    requirement: context.requirement,
    path: other == null ? void 0 : other.path,
    issues: other == null ? void 0 : other.issues,
    lang: config$1.lang,
    abortEarly: config$1.abortEarly,
    abortPipeEarly: config$1.abortPipeEarly
  };
  const isSchema = context.kind === "schema";
  const message$1 = (other == null ? void 0 : other.message) ?? context.message ?? /* @__PURE__ */ getSpecificMessage(context.reference, issue.lang) ?? (isSchema ? /* @__PURE__ */ getSchemaMessage(issue.lang) : null) ?? config$1.message ?? /* @__PURE__ */ getGlobalMessage(issue.lang);
  if (message$1 !== void 0) issue.message = typeof message$1 === "function" ? message$1(issue) : message$1;
  if (isSchema) dataset.typed = false;
  if (dataset.issues) dataset.issues.push(issue);
  else dataset.issues = [issue];
}
const _standardCache = /* @__PURE__ */ new WeakMap();
// @__NO_SIDE_EFFECTS__
function _getStandardProps(context) {
  let cached = _standardCache.get(context);
  if (!cached) {
    cached = {
      version: 1,
      vendor: "valibot",
      validate(value$1) {
        return context["~run"]({ value: value$1 }, /* @__PURE__ */ getGlobalConfig());
      }
    };
    _standardCache.set(context, cached);
  }
  return cached;
}
// @__NO_SIDE_EFFECTS__
function _joinExpects(values$1, separator) {
  const list = [...new Set(values$1)];
  if (list.length > 1) return `(${list.join(` ${separator} `)})`;
  return list[0] ?? "never";
}
var ValiError = class extends Error {
  /**
  * Creates a Valibot error with useful information.
  *
  * @param issues The error issues.
  */
  constructor(issues) {
    super(issues[0].message);
    this.name = "ValiError";
    this.issues = issues;
  }
};
// @__NO_SIDE_EFFECTS__
function maxValue(requirement, message$1) {
  return {
    kind: "validation",
    type: "max_value",
    reference: maxValue,
    async: false,
    expects: `<=${requirement instanceof Date ? requirement.toJSON() : /* @__PURE__ */ _stringify(requirement)}`,
    requirement,
    message: message$1,
    "~run"(dataset, config$1) {
      if (dataset.typed && !(dataset.value <= this.requirement)) _addIssue(this, "value", dataset, config$1, { received: dataset.value instanceof Date ? dataset.value.toJSON() : /* @__PURE__ */ _stringify(dataset.value) });
      return dataset;
    }
  };
}
// @__NO_SIDE_EFFECTS__
function minLength(requirement, message$1) {
  return {
    kind: "validation",
    type: "min_length",
    reference: minLength,
    async: false,
    expects: `>=${requirement}`,
    requirement,
    message: message$1,
    "~run"(dataset, config$1) {
      if (dataset.typed && dataset.value.length < this.requirement) _addIssue(this, "length", dataset, config$1, { received: `${dataset.value.length}` });
      return dataset;
    }
  };
}
// @__NO_SIDE_EFFECTS__
function minValue(requirement, message$1) {
  return {
    kind: "validation",
    type: "min_value",
    reference: minValue,
    async: false,
    expects: `>=${requirement instanceof Date ? requirement.toJSON() : /* @__PURE__ */ _stringify(requirement)}`,
    requirement,
    message: message$1,
    "~run"(dataset, config$1) {
      if (dataset.typed && !(dataset.value >= this.requirement)) _addIssue(this, "value", dataset, config$1, { received: dataset.value instanceof Date ? dataset.value.toJSON() : /* @__PURE__ */ _stringify(dataset.value) });
      return dataset;
    }
  };
}
// @__NO_SIDE_EFFECTS__
function getFallback(schema, dataset, config$1) {
  return typeof schema.fallback === "function" ? schema.fallback(dataset, config$1) : schema.fallback;
}
// @__NO_SIDE_EFFECTS__
function getDefault(schema, dataset, config$1) {
  return typeof schema.default === "function" ? schema.default(dataset, config$1) : schema.default;
}
// @__NO_SIDE_EFFECTS__
function array(item, message$1) {
  return {
    kind: "schema",
    type: "array",
    reference: array,
    expects: "Array",
    async: false,
    item,
    message: message$1,
    get "~standard"() {
      return /* @__PURE__ */ _getStandardProps(this);
    },
    "~run"(dataset, config$1) {
      var _a;
      const input = dataset.value;
      if (Array.isArray(input)) {
        dataset.typed = true;
        dataset.value = [];
        for (let key = 0; key < input.length; key++) {
          const value$1 = input[key];
          const itemDataset = this.item["~run"]({ value: value$1 }, config$1);
          if (itemDataset.issues) {
            const pathItem = {
              type: "array",
              origin: "value",
              input,
              key,
              value: value$1
            };
            for (const issue of itemDataset.issues) {
              if (issue.path) issue.path.unshift(pathItem);
              else issue.path = [pathItem];
              (_a = dataset.issues) == null ? void 0 : _a.push(issue);
            }
            if (!dataset.issues) dataset.issues = itemDataset.issues;
            if (config$1.abortEarly) {
              dataset.typed = false;
              break;
            }
          }
          if (!itemDataset.typed) dataset.typed = false;
          dataset.value.push(itemDataset.value);
        }
      } else _addIssue(this, "type", dataset, config$1);
      return dataset;
    }
  };
}
// @__NO_SIDE_EFFECTS__
function nullable(wrapped, default_) {
  return {
    kind: "schema",
    type: "nullable",
    reference: nullable,
    expects: `(${wrapped.expects} | null)`,
    async: false,
    wrapped,
    default: default_,
    get "~standard"() {
      return /* @__PURE__ */ _getStandardProps(this);
    },
    "~run"(dataset, config$1) {
      if (dataset.value === null) {
        if (this.default !== void 0) dataset.value = /* @__PURE__ */ getDefault(this, dataset, config$1);
        if (dataset.value === null) {
          dataset.typed = true;
          return dataset;
        }
      }
      return this.wrapped["~run"](dataset, config$1);
    }
  };
}
// @__NO_SIDE_EFFECTS__
function number(message$1) {
  return {
    kind: "schema",
    type: "number",
    reference: number,
    expects: "number",
    async: false,
    message: message$1,
    get "~standard"() {
      return /* @__PURE__ */ _getStandardProps(this);
    },
    "~run"(dataset, config$1) {
      if (typeof dataset.value === "number" && !isNaN(dataset.value)) dataset.typed = true;
      else _addIssue(this, "type", dataset, config$1);
      return dataset;
    }
  };
}
// @__NO_SIDE_EFFECTS__
function object(entries$1, message$1) {
  return {
    kind: "schema",
    type: "object",
    reference: object,
    expects: "Object",
    async: false,
    entries: entries$1,
    message: message$1,
    get "~standard"() {
      return /* @__PURE__ */ _getStandardProps(this);
    },
    "~run"(dataset, config$1) {
      var _a;
      const input = dataset.value;
      if (input && typeof input === "object") {
        dataset.typed = true;
        dataset.value = {};
        for (const key in this.entries) {
          const valueSchema = this.entries[key];
          if (key in input || (valueSchema.type === "exact_optional" || valueSchema.type === "optional" || valueSchema.type === "nullish") && valueSchema.default !== void 0) {
            const value$1 = key in input ? input[key] : /* @__PURE__ */ getDefault(valueSchema);
            const valueDataset = valueSchema["~run"]({ value: value$1 }, config$1);
            if (valueDataset.issues) {
              const pathItem = {
                type: "object",
                origin: "value",
                input,
                key,
                value: value$1
              };
              for (const issue of valueDataset.issues) {
                if (issue.path) issue.path.unshift(pathItem);
                else issue.path = [pathItem];
                (_a = dataset.issues) == null ? void 0 : _a.push(issue);
              }
              if (!dataset.issues) dataset.issues = valueDataset.issues;
              if (config$1.abortEarly) {
                dataset.typed = false;
                break;
              }
            }
            if (!valueDataset.typed) dataset.typed = false;
            dataset.value[key] = valueDataset.value;
          } else if (valueSchema.fallback !== void 0) dataset.value[key] = /* @__PURE__ */ getFallback(valueSchema);
          else if (valueSchema.type !== "exact_optional" && valueSchema.type !== "optional" && valueSchema.type !== "nullish") {
            _addIssue(this, "key", dataset, config$1, {
              input: void 0,
              expected: `"${key}"`,
              path: [{
                type: "object",
                origin: "key",
                input,
                key,
                value: input[key]
              }]
            });
            if (config$1.abortEarly) break;
          }
        }
      } else _addIssue(this, "type", dataset, config$1);
      return dataset;
    }
  };
}
// @__NO_SIDE_EFFECTS__
function optional(wrapped, default_) {
  return {
    kind: "schema",
    type: "optional",
    reference: optional,
    expects: `(${wrapped.expects} | undefined)`,
    async: false,
    wrapped,
    default: default_,
    get "~standard"() {
      return /* @__PURE__ */ _getStandardProps(this);
    },
    "~run"(dataset, config$1) {
      if (dataset.value === void 0) {
        if (this.default !== void 0) dataset.value = /* @__PURE__ */ getDefault(this, dataset, config$1);
        if (dataset.value === void 0) {
          dataset.typed = true;
          return dataset;
        }
      }
      return this.wrapped["~run"](dataset, config$1);
    }
  };
}
// @__NO_SIDE_EFFECTS__
function picklist(options, message$1) {
  return {
    kind: "schema",
    type: "picklist",
    reference: picklist,
    expects: /* @__PURE__ */ _joinExpects(options.map(_stringify), "|"),
    async: false,
    options,
    message: message$1,
    get "~standard"() {
      return /* @__PURE__ */ _getStandardProps(this);
    },
    "~run"(dataset, config$1) {
      if (this.options.includes(dataset.value)) dataset.typed = true;
      else _addIssue(this, "type", dataset, config$1);
      return dataset;
    }
  };
}
// @__NO_SIDE_EFFECTS__
function string(message$1) {
  return {
    kind: "schema",
    type: "string",
    reference: string,
    expects: "string",
    async: false,
    message: message$1,
    get "~standard"() {
      return /* @__PURE__ */ _getStandardProps(this);
    },
    "~run"(dataset, config$1) {
      if (typeof dataset.value === "string") dataset.typed = true;
      else _addIssue(this, "type", dataset, config$1);
      return dataset;
    }
  };
}
// @__NO_SIDE_EFFECTS__
function _subIssues(datasets) {
  let issues;
  if (datasets) for (const dataset of datasets) if (issues) for (const issue of dataset.issues) issues.push(issue);
  else issues = dataset.issues;
  return issues;
}
// @__NO_SIDE_EFFECTS__
function union(options, message$1) {
  return {
    kind: "schema",
    type: "union",
    reference: union,
    expects: /* @__PURE__ */ _joinExpects(options.map((option) => option.expects), "|"),
    async: false,
    options,
    message: message$1,
    get "~standard"() {
      return /* @__PURE__ */ _getStandardProps(this);
    },
    "~run"(dataset, config$1) {
      let validDataset;
      let typedDatasets;
      let untypedDatasets;
      for (const schema of this.options) {
        const optionDataset = schema["~run"]({ value: dataset.value }, config$1);
        if (optionDataset.typed) if (optionDataset.issues) if (typedDatasets) typedDatasets.push(optionDataset);
        else typedDatasets = [optionDataset];
        else {
          validDataset = optionDataset;
          break;
        }
        else if (untypedDatasets) untypedDatasets.push(optionDataset);
        else untypedDatasets = [optionDataset];
      }
      if (validDataset) return validDataset;
      if (typedDatasets) {
        if (typedDatasets.length === 1) return typedDatasets[0];
        _addIssue(this, "type", dataset, config$1, { issues: /* @__PURE__ */ _subIssues(typedDatasets) });
        dataset.typed = true;
      } else if ((untypedDatasets == null ? void 0 : untypedDatasets.length) === 1) return untypedDatasets[0];
      else _addIssue(this, "type", dataset, config$1, { issues: /* @__PURE__ */ _subIssues(untypedDatasets) });
      return dataset;
    }
  };
}
function parse(schema, input, config$1) {
  const dataset = schema["~run"]({ value: input }, /* @__PURE__ */ getGlobalConfig());
  if (dataset.issues) throw new ValiError(dataset.issues);
  return dataset.value;
}
// @__NO_SIDE_EFFECTS__
function pipe(...pipe$1) {
  return {
    ...pipe$1[0],
    pipe: pipe$1,
    get "~standard"() {
      return /* @__PURE__ */ _getStandardProps(this);
    },
    "~run"(dataset, config$1) {
      for (const item of pipe$1) if (item.kind !== "metadata") {
        if (dataset.issues && (item.kind === "schema" || item.kind === "transformation")) {
          dataset.typed = false;
          break;
        }
        if (!dataset.issues || !config$1.abortEarly && !config$1.abortPipeEarly) dataset = item["~run"](dataset, config$1);
      }
      return dataset;
    }
  };
}
const examTypes = ["toefl", "ielts", "cambridge"];
const sectionTypes = ["reading", "listening", "writing", "speaking"];
const writingCriterionKeys = [
  "organization",
  "grammarAndMechanics",
  "languageAccuracy",
  "developmentAndSupport"
];
const examTypeSchema = /* @__PURE__ */ picklist(examTypes);
const sectionTypeSchema = /* @__PURE__ */ picklist(sectionTypes);
const writingCriterionKeySchema = /* @__PURE__ */ picklist(writingCriterionKeys);
const promptTypeSchema = /* @__PURE__ */ picklist(["academic-discussion", "email", "legacy"]);
const promptDiscussionParticipantSchema = /* @__PURE__ */ object({
  role: /* @__PURE__ */ picklist(["professor", "student"]),
  name: /* @__PURE__ */ string(),
  gender: /* @__PURE__ */ picklist(["female", "male"]),
  avatarUrl: /* @__PURE__ */ string(),
  message: /* @__PURE__ */ string()
});
const promptSummarySchema = /* @__PURE__ */ object({
  id: /* @__PURE__ */ string(),
  title: /* @__PURE__ */ string(),
  category: /* @__PURE__ */ string(),
  examType: examTypeSchema,
  sectionType: sectionTypeSchema,
  lastScore: /* @__PURE__ */ nullable(/* @__PURE__ */ number()),
  lastCompletedAt: /* @__PURE__ */ nullable(/* @__PURE__ */ string())
});
/* @__PURE__ */ object({
  ...promptSummarySchema.entries,
  promptType: promptTypeSchema,
  scenario: /* @__PURE__ */ string(),
  discussionParticipants: /* @__PURE__ */ array(promptDiscussionParticipantSchema),
  instructions: /* @__PURE__ */ string(),
  question: /* @__PURE__ */ string(),
  passage: /* @__PURE__ */ string(),
  recommendedWordCount: /* @__PURE__ */ string()
});
const storedPromptBaseSchema = {
  id: /* @__PURE__ */ string(),
  title: /* @__PURE__ */ string(),
  category: /* @__PURE__ */ string(),
  examType: examTypeSchema,
  sectionType: sectionTypeSchema
};
const legacyStoredPromptSchema = /* @__PURE__ */ object({
  ...storedPromptBaseSchema,
  type: /* @__PURE__ */ optional(promptTypeSchema, "legacy"),
  instructions: /* @__PURE__ */ string(),
  question: /* @__PURE__ */ string(),
  passage: /* @__PURE__ */ string(),
  recommendedWordCount: /* @__PURE__ */ string()
});
const scenarioStoredPromptSchema = /* @__PURE__ */ object({
  ...storedPromptBaseSchema,
  type: /* @__PURE__ */ picklist(["academic-discussion", "email"]),
  scenario: /* @__PURE__ */ string(),
  discussion: /* @__PURE__ */ optional(
    /* @__PURE__ */ object({
      professor: /* @__PURE__ */ string(),
      studentA: /* @__PURE__ */ string(),
      studentB: /* @__PURE__ */ string()
    })
  )
});
const storedPromptFileSchema = /* @__PURE__ */ array(
  /* @__PURE__ */ union([legacyStoredPromptSchema, scenarioStoredPromptSchema])
);
const submitWritingAttemptInputSchema = /* @__PURE__ */ object({
  promptId: /* @__PURE__ */ string(),
  essayText: /* @__PURE__ */ pipe(/* @__PURE__ */ string(), /* @__PURE__ */ minLength(50))
});
const registerAppIpc = ({
  promptCatalogService,
  attemptRepository,
  writingEvaluationService
}) => {
  electron.ipcMain.handle("prompt-catalog:list", () => promptCatalogService.listPromptCatalog());
  electron.ipcMain.handle(
    "prompt-catalog:get",
    (_event, promptId) => promptCatalogService.getPromptDetails(promptId)
  );
  electron.ipcMain.handle(
    "writing:submit",
    (_event, payload) => writingEvaluationService.submitAttempt(parse(submitWritingAttemptInputSchema, payload))
  );
  electron.ipcMain.handle(
    "attempts:get",
    (_event, attemptId) => attemptRepository.getAttemptDetails(attemptId)
  );
};
class PromptCatalogService {
  constructor(attemptRepository) {
    this.attemptRepository = attemptRepository;
  }
  listPromptCatalog() {
    return this.attemptRepository.listPromptSummaries();
  }
  getPromptDetails(promptId) {
    return this.attemptRepository.getPromptDetails(promptId);
  }
}
const mapPromptSummary = (row) => ({
  id: row.id,
  title: row.title,
  category: row.category,
  examType: row.exam_type,
  sectionType: row.section_type,
  lastScore: row.last_score,
  lastCompletedAt: row.last_completed_at
});
const mapPromptDetails = (row, latestSummary) => ({
  id: row.id,
  title: row.title,
  category: row.category,
  examType: row.exam_type,
  sectionType: row.section_type,
  promptType: row.prompt_type,
  scenario: row.scenario_html,
  discussionParticipants: JSON.parse(row.discussion_json),
  instructions: row.instructions,
  question: row.question,
  passage: row.passage,
  recommendedWordCount: row.recommended_word_count,
  lastScore: (latestSummary == null ? void 0 : latestSummary.last_score) ?? null,
  lastCompletedAt: (latestSummary == null ? void 0 : latestSummary.last_completed_at) ?? null
});
class AttemptRepository {
  constructor(database) {
    this.database = database;
  }
  listPromptSummaries() {
    const rows = this.database.prepare(`
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
      `).all();
    return rows.map(mapPromptSummary);
  }
  getPromptDetails(promptId) {
    const promptRow = this.database.prepare("SELECT * FROM prompts WHERE id = ?").get(promptId);
    if (!promptRow) {
      throw new Error(`Prompt not found: ${promptId}`);
    }
    const latestSummary = this.database.prepare(`
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
      `).get(promptId);
    return mapPromptDetails(promptRow, latestSummary);
  }
  createAttempt(input, providerType) {
    const prompt = this.getPromptDetails(input.promptId);
    const attemptId = node_crypto.randomUUID();
    const submittedAt = (/* @__PURE__ */ new Date()).toISOString();
    this.database.prepare(
      `
          INSERT INTO attempts (id, prompt_id, essay_text, submitted_at, provider_type, status)
          VALUES (?, ?, ?, ?, ?, 'pending')
        `
    ).run(attemptId, input.promptId, input.essayText, submittedAt, providerType);
    return {
      id: attemptId,
      prompt,
      essayText: input.essayText,
      submittedAt,
      providerType,
      status: "pending",
      evaluation: null
    };
  }
  completeAttempt(attemptId, evaluation) {
    const evaluationId = node_crypto.randomUUID();
    const createdAt = (/* @__PURE__ */ new Date()).toISOString();
    this.database.prepare(`UPDATE attempts SET status = 'completed' WHERE id = ?`).run(attemptId);
    this.database.prepare(
      `
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
        `
    ).run(
      evaluationId,
      attemptId,
      evaluation.overallScore,
      evaluation.overallMaxScore,
      evaluation.summary,
      evaluation.nextStep,
      JSON.stringify(evaluation),
      createdAt
    );
    return this.getAttemptDetails(attemptId);
  }
  markAttemptFailed(attemptId) {
    this.database.prepare(`UPDATE attempts SET status = 'failed' WHERE id = ?`).run(attemptId);
  }
  getAttemptDetails(attemptId) {
    const attempt = this.database.prepare("SELECT * FROM attempts WHERE id = ?").get(attemptId);
    if (!attempt) {
      throw new Error(`Attempt not found: ${attemptId}`);
    }
    const prompt = this.getPromptDetails(attempt.prompt_id);
    const evaluationRow = this.database.prepare("SELECT payload_json FROM evaluations WHERE attempt_id = ?").get(attemptId);
    return {
      id: attempt.id,
      prompt,
      essayText: attempt.essay_text,
      submittedAt: attempt.submitted_at,
      providerType: attempt.provider_type,
      status: attempt.status,
      evaluation: evaluationRow ? JSON.parse(evaluationRow.payload_json) : null
    };
  }
}
const getAppRoot$1 = () => process.env.APP_ROOT ?? process.cwd();
const resolveWritingPromptsDirectory = () => path.resolve(getAppRoot$1(), "prompts", "writing");
const isJsonFile = (fileName) => fileName.toLowerCase().endsWith(".json");
const professorNames = {
  female: [
    "Dr. Maya Patel",
    "Dr. Elena Brooks",
    "Dr. Nina Alvarez",
    "Dr. Rachel Kim",
    "Dr. Sonia Bennett",
    "Dr. Priya Shah"
  ],
  male: [
    "Dr. Marcus Bennett",
    "Dr. Daniel Cho",
    "Dr. Adrian Foster",
    "Dr. Leo Ramirez",
    "Dr. Victor Hall",
    "Dr. Simon Carter"
  ]
};
const studentNames = {
  female: ["Ava", "Nora", "Jasmine", "Lena", "Tanya", "Mila", "Naomi", "Sofia"],
  male: ["Sam", "Ethan", "Leo", "Noah", "Owen", "Mateo", "Julian", "Miles"]
};
const avatarUrls = {
  female: [
    "/avatars/uifaces/125.jpg",
    "/avatars/uifaces/128.jpg",
    "/avatars/uifaces/217.jpg",
    "/avatars/uifaces/219.jpg",
    "/avatars/uifaces/220.jpg",
    "/avatars/uifaces/221.jpg"
  ],
  male: [
    "/avatars/uifaces/80.jpg",
    "/avatars/uifaces/92.jpg",
    "/avatars/uifaces/218.jpg",
    "/avatars/uifaces/222.jpg"
  ]
};
const stripHtml$1 = (value) => value.replace(/<li>/gi, "- ").replace(/<\/li>/gi, "\n").replace(/<\/p>/gi, "\n\n").replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, " ").replace(/&rsquo;/g, "'").replace(/&lsquo;/g, "'").replace(/&ldquo;/g, '"').replace(/&rdquo;/g, '"').replace(/&amp;/g, "&").replace(/\s+\n/g, "\n").replace(/\n{3,}/g, "\n\n").replace(/[ \t]{2,}/g, " ").trim();
const hashString = (value) => Array.from(value).reduce(
  (hash, character) => (hash * 31 + character.charCodeAt(0)) % 2147483647,
  0
);
const pickDeterministicUnique = (values, seed, usedValues) => {
  const startIndex = hashString(seed) % values.length;
  for (let offset = 0; offset < values.length; offset += 1) {
    const value = values[(startIndex + offset) % values.length];
    if (!usedValues.has(value)) {
      usedValues.add(value);
      return value;
    }
  }
  return values[startIndex];
};
const pickGender = (seed) => hashString(seed) % 2 === 0 ? "female" : "male";
const buildParticipant = (promptId, role, message, gender, usedNames, usedAvatarUrls) => {
  const namePool = role === "professor" ? professorNames[gender] : studentNames[gender];
  const name = pickDeterministicUnique(namePool, `${promptId}:${role}:name`, usedNames);
  const avatarUrl = pickDeterministicUnique(
    avatarUrls[gender],
    `${promptId}:${role}:avatar`,
    usedAvatarUrls
  );
  return {
    role,
    name,
    gender,
    avatarUrl,
    message
  };
};
const extractRecommendedWordCount = (scenarioText) => {
  const atLeastMatch = scenarioText.match(/at least (\d+) words?/i);
  if (atLeastMatch) {
    return `${atLeastMatch[1]} words minimum`;
  }
  const rangeMatch = scenarioText.match(/(\d+)\s*-\s*(\d+) words?/i);
  if (rangeMatch) {
    return `${rangeMatch[1]}-${rangeMatch[2]} words`;
  }
  return "";
};
const normalizeScenarioPrompt = (prompt) => {
  var _a;
  const scenarioText = stripHtml$1(prompt.scenario);
  const promptType = prompt.type;
  const discussionParticipants = [];
  if (prompt.type === "academic-discussion" && prompt.discussion) {
    const usedNames = /* @__PURE__ */ new Set();
    const usedAvatarUrls = /* @__PURE__ */ new Set();
    const professorGender = pickGender(`${prompt.id}:professor`);
    const studentAGender = pickGender(`${prompt.id}:student-a`);
    const studentBGender = pickGender(`${prompt.id}:student-b`);
    discussionParticipants.push(
      buildParticipant(
        prompt.id,
        "professor",
        prompt.discussion.professor,
        professorGender,
        usedNames,
        usedAvatarUrls
      ),
      buildParticipant(
        prompt.id,
        "student",
        prompt.discussion.studentA,
        studentAGender,
        usedNames,
        usedAvatarUrls
      ),
      buildParticipant(
        prompt.id,
        "student",
        prompt.discussion.studentB,
        studentBGender,
        usedNames,
        usedAvatarUrls
      )
    );
  }
  const professorPrompt = ((_a = discussionParticipants.find((participant) => participant.role === "professor")) == null ? void 0 : _a.message) ?? "";
  const studentDiscussion = discussionParticipants.filter((participant) => participant.role === "student").map((participant) => `${participant.name}: ${participant.message}`).join("\n\n");
  return {
    id: prompt.id,
    title: prompt.title,
    category: prompt.category,
    examType: prompt.examType,
    sectionType: prompt.sectionType,
    promptType,
    scenario: prompt.scenario,
    discussionParticipants,
    instructions: scenarioText,
    question: professorPrompt,
    passage: studentDiscussion,
    recommendedWordCount: extractRecommendedWordCount(scenarioText),
    lastScore: null,
    lastCompletedAt: null
  };
};
const normalizeLegacyPrompt = (prompt) => ({
  id: prompt.id,
  title: prompt.title,
  category: prompt.category,
  examType: prompt.examType,
  sectionType: prompt.sectionType,
  promptType: "legacy",
  scenario: `<p>${prompt.instructions}</p>`,
  discussionParticipants: [],
  instructions: prompt.instructions,
  question: prompt.question,
  passage: prompt.passage,
  recommendedWordCount: prompt.recommendedWordCount,
  lastScore: null,
  lastCompletedAt: null
});
const normalizePrompt = (prompt) => "scenario" in prompt ? normalizeScenarioPrompt(prompt) : normalizeLegacyPrompt(prompt);
const loadWritingPromptsFromFiles = () => {
  const writingPromptsDirectory = resolveWritingPromptsDirectory();
  if (!fs.existsSync(writingPromptsDirectory)) {
    throw new Error(`Writing prompts directory not found: ${writingPromptsDirectory}`);
  }
  const fileNames = fs.readdirSync(writingPromptsDirectory).filter(isJsonFile).sort();
  if (fileNames.length === 0) {
    throw new Error(`No writing prompt JSON files found in ${writingPromptsDirectory}`);
  }
  return fileNames.flatMap((fileName) => {
    const filePath = path.join(writingPromptsDirectory, fileName);
    const fileContents = fs.readFileSync(filePath, "utf8");
    try {
      const parsedContents = JSON.parse(fileContents);
      return parse(storedPromptFileSchema, parsedContents).map(normalizePrompt);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown validation error";
      throw new Error(`Invalid writing prompt file "${fileName}": ${message}`);
    }
  });
};
const ensurePromptColumns = (database) => {
  const existingColumns = new Set(
    database.prepare("SELECT name FROM pragma_table_info('prompts')").all().map((column) => column.name)
  );
  if (!existingColumns.has("prompt_type")) {
    database.exec("ALTER TABLE prompts ADD COLUMN prompt_type TEXT NOT NULL DEFAULT 'legacy'");
  }
  if (!existingColumns.has("scenario_html")) {
    database.exec("ALTER TABLE prompts ADD COLUMN scenario_html TEXT NOT NULL DEFAULT ''");
  }
  if (!existingColumns.has("discussion_json")) {
    database.exec("ALTER TABLE prompts ADD COLUMN discussion_json TEXT NOT NULL DEFAULT '[]'");
  }
};
const createTables = (database) => {
  database.exec(`
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
  `);
  ensurePromptColumns(database);
};
const seedPrompts = (database) => {
  const upsertStatement = database.prepare(`
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
  `);
  const prompts = loadWritingPromptsFromFiles();
  const insertMany = database.transaction(() => {
    prompts.forEach((prompt) => {
      upsertStatement.run({
        ...prompt,
        discussionParticipantsJson: JSON.stringify(prompt.discussionParticipants)
      });
    });
  });
  insertMany();
};
const createDatabase = (app) => {
  const databasePath = path.join(app.getPath("userData"), "open-prep.db");
  const database = new Database(databasePath);
  createTables(database);
  seedPrompts(database);
  return database;
};
const writingCriterionScoreSchema = /* @__PURE__ */ object({
  criterion: writingCriterionKeySchema,
  label: /* @__PURE__ */ string(),
  score: /* @__PURE__ */ pipe(/* @__PURE__ */ number(), /* @__PURE__ */ minValue(0), /* @__PURE__ */ maxValue(5)),
  maxScore: /* @__PURE__ */ pipe(/* @__PURE__ */ number(), /* @__PURE__ */ minValue(1), /* @__PURE__ */ maxValue(5)),
  comment: /* @__PURE__ */ string()
});
const writingHighlightSchema = /* @__PURE__ */ object({
  id: /* @__PURE__ */ string(),
  excerpt: /* @__PURE__ */ string(),
  replacement: /* @__PURE__ */ string(),
  category: /* @__PURE__ */ picklist([
    "grammar-spelling",
    "relevance",
    "idiomatic-word-choice",
    "elaboration"
  ]),
  explanation: /* @__PURE__ */ string(),
  alternatives: /* @__PURE__ */ optional(/* @__PURE__ */ array(/* @__PURE__ */ string()), []),
  startOffset: /* @__PURE__ */ pipe(/* @__PURE__ */ number(), /* @__PURE__ */ minValue(0)),
  endOffset: /* @__PURE__ */ pipe(/* @__PURE__ */ number(), /* @__PURE__ */ minValue(0))
});
const writingEvaluationSchema = /* @__PURE__ */ object({
  overallScore: /* @__PURE__ */ pipe(/* @__PURE__ */ number(), /* @__PURE__ */ minValue(0), /* @__PURE__ */ maxValue(6)),
  overallMaxScore: /* @__PURE__ */ pipe(/* @__PURE__ */ number(), /* @__PURE__ */ minValue(1), /* @__PURE__ */ maxValue(6)),
  summary: /* @__PURE__ */ string(),
  nextStep: /* @__PURE__ */ string(),
  criterionScores: /* @__PURE__ */ array(writingCriterionScoreSchema),
  highlights: /* @__PURE__ */ array(writingHighlightSchema)
});
const buildRubricDefinition = () => [
  "Return valid JSON only.",
  "Evaluate the writing using TOEFL®-style writing criteria.",
  "Use this exact shape:",
  "{",
  '  "overallScore": number,',
  '  "overallMaxScore": 6,',
  '  "summary": string,',
  '  "nextStep": string,',
  '  "criterionScores": [',
  '    { "criterion": "organization" | "grammarAndMechanics" | "languageAccuracy" | "developmentAndSupport", "label": string, "score": number, "maxScore": 5, "comment": string }',
  "  ],",
  '  "highlights": [',
  '    { "id": string, "excerpt": string, "replacement": string, "category": "grammar-spelling" | "relevance" | "idiomatic-word-choice" | "elaboration", "explanation": string, "alternatives": string[], "startOffset": number, "endOffset": number }',
  "  ]",
  "}",
  "If no useful highlight exists, return an empty highlights array."
].join("\n");
const stripHtml = (value) => value.replace(/<li>/gi, "- ").replace(/<\/li>/gi, "\n").replace(/<\/p>/gi, "\n\n").replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, " ").replace(/\s+\n/g, "\n").replace(/\n{3,}/g, "\n\n").replace(/[ \t]{2,}/g, " ").trim();
const buildPromptContext = (request) => {
  const context = [
    `Exam: ${request.prompt.examType.toUpperCase()}`,
    `Section: ${request.prompt.sectionType.toUpperCase()}`,
    `Category: ${request.prompt.category}`,
    `Prompt type: ${request.prompt.promptType}`,
    `Scenario: ${stripHtml(request.prompt.scenario)}`
  ];
  if (request.prompt.discussionParticipants.length > 0) {
    context.push(
      "Discussion:",
      ...request.prompt.discussionParticipants.map(
        (participant) => `${participant.name} (${participant.role}): ${participant.message}`
      )
    );
  }
  if (request.prompt.recommendedWordCount) {
    context.push(`Recommended length: ${request.prompt.recommendedWordCount}`);
  }
  return context;
};
const buildCodexPrompt = (request, systemPrompt) => [
  systemPrompt.trim(),
  "",
  buildRubricDefinition(),
  "",
  "Context:",
  ...buildPromptContext(request),
  "",
  "Student essay:",
  request.essayText,
  "",
  "Keep the feedback concise, specific, and encouraging."
].join("\n");
const codexPathDirectories = [
  path.join(os.homedir(), ".local", "bin"),
  path.join(os.homedir(), ".npm-global", "bin"),
  "/opt/homebrew/bin",
  "/usr/local/bin"
];
const uniquePathEntries = (entries) => {
  const seenEntries = /* @__PURE__ */ new Set();
  return entries.filter((entry) => {
    if (!entry || seenEntries.has(entry)) {
      return false;
    }
    seenEntries.add(entry);
    return true;
  });
};
const resolveCodexCommand = () => {
  var _a;
  const configuredCommand = (_a = process.env.OPEN_PREP_CODEX_PATH) == null ? void 0 : _a.trim();
  return configuredCommand && configuredCommand.length > 0 ? configuredCommand : "codex";
};
const buildCodexEnvironment = (environment = process.env) => {
  const existingPathEntries = (environment.PATH ?? "").split(path.delimiter).filter((entry) => entry.length > 0);
  const PATH = uniquePathEntries([...codexPathDirectories, ...existingPathEntries]).join(
    path.delimiter
  );
  return {
    ...environment,
    PATH
  };
};
const buildCodexNotFoundMessage = (environment) => [
  "Codex CLI was not found.",
  "Install Codex CLI or set OPEN_PREP_CODEX_PATH to its full executable path.",
  `PATH checked: ${environment.PATH ?? ""}`
].join(" ");
const getAppRoot = () => process.env.APP_ROOT ?? process.cwd();
const getCodexSystemPromptPath = () => path.resolve(getAppRoot(), "prompts/system/codex/writing-evaluation.md");
const loadCodexSystemPrompt = async () => {
  const systemPromptFilePath = getCodexSystemPromptPath();
  try {
    return await fs.promises.readFile(systemPromptFilePath, "utf8");
  } catch (error) {
    throw new Error(
      `Missing Codex system prompt file at ${systemPromptFilePath}. Create it before running writing evaluation.`
    );
  }
};
const CODEX_TIMEOUT_MS = 9e4;
const CODEX_MODEL = "gpt-5.4-mini";
const CODEX_REASONING_EFFORT = "low";
const normalizeEvaluationPayload = (payload) => {
  if (!payload || typeof payload !== "object") {
    return payload;
  }
  const evaluation = payload;
  const highlights = Array.isArray(evaluation.highlights) ? evaluation.highlights : evaluation.highlights;
  if (!Array.isArray(highlights)) {
    return evaluation;
  }
  return {
    ...evaluation,
    highlights: highlights.map((highlight) => {
      if (!highlight || typeof highlight !== "object") {
        return highlight;
      }
      const highlightRecord = highlight;
      return {
        ...highlightRecord,
        alternatives: Array.isArray(highlightRecord.alternatives) ? highlightRecord.alternatives : []
      };
    })
  };
};
class CodexProvider {
  constructor() {
    __publicField(this, "id", "codex");
  }
  async evaluateWriting(request) {
    const outputFilePath = path.join(os.tmpdir(), `open-prep-codex-${node_crypto.randomUUID()}.json`);
    const systemPrompt = await loadCodexSystemPrompt();
    const prompt = buildCodexPrompt(request, systemPrompt);
    const args = [
      "exec",
      "--skip-git-repo-check",
      "--output-last-message",
      outputFilePath,
      "--model",
      CODEX_MODEL,
      "--config",
      `model_reasoning_effort="${CODEX_REASONING_EFFORT}"`,
      "-"
    ];
    await new Promise((resolve, reject) => {
      const codexEnvironment = {
        ...buildCodexEnvironment(),
        APP_ROOT: process.env.APP_ROOT,
        VITE_PUBLIC: process.env.VITE_PUBLIC
      };
      const child = node_child_process.spawn(resolveCodexCommand(), args, {
        env: codexEnvironment,
        stdio: ["pipe", "pipe", "pipe"]
      });
      let stderr = "";
      const timeout = setTimeout(() => {
        child.kill("SIGTERM");
        reject(new Error("Codex evaluation timed out."));
      }, CODEX_TIMEOUT_MS);
      child.stderr.on("data", (chunk) => {
        stderr += chunk.toString();
      });
      child.on("error", (error) => {
        clearTimeout(timeout);
        reject(
          error.code === "ENOENT" ? new Error(buildCodexNotFoundMessage(codexEnvironment)) : error
        );
      });
      child.on("close", (code) => {
        clearTimeout(timeout);
        if (code !== 0) {
          reject(new Error(stderr || `Codex exited with code ${String(code)}.`));
          return;
        }
        resolve();
      });
      child.stdin.write(prompt);
      child.stdin.end();
    });
    const raw = await fs.promises.readFile(outputFilePath, "utf8");
    await fs.promises.rm(outputFilePath, { force: true });
    const parsed = normalizeEvaluationPayload(JSON.parse(raw));
    return parse(writingEvaluationSchema, parsed);
  }
}
class MockProvider {
  constructor() {
    __publicField(this, "id", "mock");
  }
  async evaluateWriting(request) {
    const excerpt = request.essayText.slice(0, Math.min(request.essayText.length, 32));
    return {
      overallScore: 4,
      overallMaxScore: 6,
      summary: "Your response is organized and readable, but it still needs more precise vocabulary and stronger support for the main claim.",
      nextStep: "Add one concrete example and replace at least two informal phrases with more academic wording.",
      criterionScores: [
        {
          criterion: "organization",
          label: "Organization",
          score: 5,
          maxScore: 5,
          comment: "The response follows a clear structure and moves logically from the main claim to supporting points."
        },
        {
          criterion: "grammarAndMechanics",
          label: "Grammar & Mechanics",
          score: 5,
          maxScore: 5,
          comment: "Grammar is generally correct and sentence boundaries are controlled well throughout the response."
        },
        {
          criterion: "languageAccuracy",
          label: "Language Accuracy",
          score: 3,
          maxScore: 5,
          comment: "The language is understandable, but the vocabulary range is limited and several choices sound informal for TOEFL® writing."
        },
        {
          criterion: "developmentAndSupport",
          label: "Development & Support",
          score: 2,
          maxScore: 5,
          comment: "The response states a position, but it would benefit from more specific evidence and a fuller explanation of the reasoning."
        }
      ],
      highlights: [
        {
          id: "mock-highlight-1",
          excerpt,
          replacement: "particularly",
          category: "idiomatic-word-choice",
          explanation: "This phrase can sound too conversational for an academic response. A more precise adverb keeps the tone formal.",
          alternatives: ["particularly", "notably", "especially", "significantly"],
          startOffset: 0,
          endOffset: Math.min(6, request.essayText.length)
        }
      ]
    };
  }
}
const createAiProvider = () => {
  const provider = process.env.OPEN_PREP_AI_PROVIDER;
  if (provider === "mock") {
    return new MockProvider();
  }
  return new CodexProvider();
};
class WritingEvaluationService {
  constructor(promptCatalogService, attemptRepository) {
    __publicField(this, "provider", createAiProvider());
    this.promptCatalogService = promptCatalogService;
    this.attemptRepository = attemptRepository;
  }
  async submitAttempt(input) {
    const prompt = this.promptCatalogService.getPromptDetails(input.promptId);
    const pendingAttempt = this.attemptRepository.createAttempt(input, this.provider.id);
    try {
      const evaluation = await this.provider.evaluateWriting({
        prompt,
        essayText: input.essayText
      });
      return this.attemptRepository.completeAttempt(pendingAttempt.id, evaluation);
    } catch (error) {
      this.attemptRepository.markAttemptFailed(pendingAttempt.id);
      throw error;
    }
  }
}
const directoryName = __dirname;
process.env.APP_ROOT = path.join(directoryName, "..");
const { VITE_DEV_SERVER_URL } = process.env;
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
const APP_NAME = "Open Prep";
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let mainWindow = null;
const createMainWindow = () => {
  const publicDirectory = process.env.VITE_PUBLIC ?? RENDERER_DIST;
  const appIconPath = path.join(publicDirectory, "logo/logo_icon_only.svg");
  mainWindow = new electron.BrowserWindow({
    width: 1440,
    height: 1024,
    minWidth: 1200,
    minHeight: 820,
    backgroundColor: "#f5f3ef",
    title: APP_NAME,
    icon: appIconPath,
    webPreferences: {
      preload: path.join(directoryName, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  if (VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools({ mode: "detach" });
  } else {
    mainWindow.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
};
electron.app.whenReady().then(() => {
  electron.app.setName(APP_NAME);
  const database = createDatabase(electron.app);
  const attemptRepository = new AttemptRepository(database);
  const promptCatalogService = new PromptCatalogService(attemptRepository);
  const writingEvaluationService = new WritingEvaluationService(
    promptCatalogService,
    attemptRepository
  );
  registerAppIpc({
    promptCatalogService,
    attemptRepository,
    writingEvaluationService
  });
  createMainWindow();
  electron.app.on("activate", () => {
    if (electron.BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
    mainWindow = null;
  }
});
