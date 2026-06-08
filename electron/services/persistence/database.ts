import path from 'node:path';

import Database from 'better-sqlite3';
import type { App } from 'electron';

import { loadWritingPromptsFromFiles } from '../catalog/writing-prompt-loader';

const ensurePromptColumns = (database: Database.Database): void => {
  const existingColumns = new Set(
    database
      .prepare<[], { name: string }>("SELECT name FROM pragma_table_info('prompts')")
      .all()
      .map((column) => column.name),
  );

  if (!existingColumns.has('prompt_type')) {
    database.exec("ALTER TABLE prompts ADD COLUMN prompt_type TEXT NOT NULL DEFAULT 'legacy'");
  }

  if (!existingColumns.has('scenario_html')) {
    database.exec("ALTER TABLE prompts ADD COLUMN scenario_html TEXT NOT NULL DEFAULT ''");
  }

  if (!existingColumns.has('discussion_json')) {
    database.exec("ALTER TABLE prompts ADD COLUMN discussion_json TEXT NOT NULL DEFAULT '[]'");
  }
};

const createTables = (database: Database.Database): void => {
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

const seedPrompts = (database: Database.Database): void => {
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
        discussionParticipantsJson: JSON.stringify(prompt.discussionParticipants),
      });
    });
  });

  insertMany();
};

export const createDatabase = (app: App): Database.Database => {
  const databasePath = path.join(app.getPath('userData'), 'open-prep.db');
  const database = new Database(databasePath);

  createTables(database);
  seedPrompts(database);

  return database;
};
