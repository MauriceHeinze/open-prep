import { randomUUID } from 'node:crypto';

import type Database from 'better-sqlite3';

import type { AiProviderType } from '../../../src/shared/domain/ai/provider-types';
import type {
  SubmitWritingAttemptInput,
  WritingAttemptDetails,
  WritingEvaluation,
} from '../../../src/shared/domain/evaluations/evaluation-types';
import type {
  PromptDetails,
  PromptDiscussionParticipant,
  PromptSummary,
  PromptType,
} from '../../../src/shared/domain/prompts/prompt-types';

type PromptRow = {
  id: string;
  title: string;
  category: string;
  exam_type: 'toefl' | 'ielts' | 'cambridge';
  section_type: 'reading' | 'listening' | 'writing' | 'speaking';
  prompt_type: PromptType;
  scenario_html: string;
  discussion_json: string;
  instructions: string;
  question: string;
  passage: string;
  recommended_word_count: string;
};

type PromptSummaryRow = {
  id: string;
  title: string;
  category: string;
  exam_type: PromptRow['exam_type'];
  section_type: PromptRow['section_type'];
  last_score: number | null;
  last_completed_at: string | null;
};

type AttemptRow = {
  id: string;
  prompt_id: string;
  essay_text: string;
  submitted_at: string;
  provider_type: AiProviderType;
  status: 'pending' | 'completed' | 'failed';
};

type EvaluationRow = {
  payload_json: string;
};

const mapPromptSummary = (row: PromptSummaryRow): PromptSummary => ({
  id: row.id,
  title: row.title,
  category: row.category,
  examType: row.exam_type,
  sectionType: row.section_type,
  lastScore: row.last_score,
  lastCompletedAt: row.last_completed_at,
});

const mapPromptDetails = (row: PromptRow, latestSummary?: PromptSummaryRow): PromptDetails => ({
  id: row.id,
  title: row.title,
  category: row.category,
  examType: row.exam_type,
  sectionType: row.section_type,
  promptType: row.prompt_type,
  scenario: row.scenario_html,
  discussionParticipants: JSON.parse(row.discussion_json) as PromptDiscussionParticipant[],
  instructions: row.instructions,
  question: row.question,
  passage: row.passage,
  recommendedWordCount: row.recommended_word_count,
  lastScore: latestSummary?.last_score ?? null,
  lastCompletedAt: latestSummary?.last_completed_at ?? null,
});

export class AttemptRepository {
  public constructor(private readonly database: Database.Database) {}

  public listPromptSummaries(): PromptSummary[] {
    const rows = this.database
      .prepare<[], PromptSummaryRow>(`
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
      `)
      .all();

    return rows.map(mapPromptSummary);
  }

  public getPromptDetails(promptId: string): PromptDetails {
    const promptRow = this.database
      .prepare<[string], PromptRow>('SELECT * FROM prompts WHERE id = ?')
      .get(promptId);

    if (!promptRow) {
      throw new Error(`Prompt not found: ${promptId}`);
    }

    const latestSummary = this.database
      .prepare<[string], PromptSummaryRow>(`
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
      `)
      .get(promptId);

    return mapPromptDetails(promptRow, latestSummary);
  }

  public createAttempt(
    input: SubmitWritingAttemptInput,
    providerType: AiProviderType,
  ): WritingAttemptDetails {
    const prompt = this.getPromptDetails(input.promptId);
    const attemptId = randomUUID();
    const submittedAt = new Date().toISOString();

    this.database
      .prepare(
        `
          INSERT INTO attempts (id, prompt_id, essay_text, submitted_at, provider_type, status)
          VALUES (?, ?, ?, ?, ?, 'pending')
        `,
      )
      .run(attemptId, input.promptId, input.essayText, submittedAt, providerType);

    return {
      id: attemptId,
      prompt,
      essayText: input.essayText,
      submittedAt,
      providerType,
      status: 'pending',
      evaluation: null,
    };
  }

  public completeAttempt(attemptId: string, evaluation: WritingEvaluation): WritingAttemptDetails {
    const evaluationId = randomUUID();
    const createdAt = new Date().toISOString();

    this.database
      .prepare(`UPDATE attempts SET status = 'completed' WHERE id = ?`)
      .run(attemptId);

    this.database
      .prepare(
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
        `,
      )
      .run(
        evaluationId,
        attemptId,
        evaluation.overallScore,
        evaluation.overallMaxScore,
        evaluation.summary,
        evaluation.nextStep,
        JSON.stringify(evaluation),
        createdAt,
      );

    return this.getAttemptDetails(attemptId);
  }

  public markAttemptFailed(attemptId: string): void {
    this.database
      .prepare(`UPDATE attempts SET status = 'failed' WHERE id = ?`)
      .run(attemptId);
  }

  public getAttemptDetails(attemptId: string): WritingAttemptDetails {
    const attempt = this.database
      .prepare<[string], AttemptRow>('SELECT * FROM attempts WHERE id = ?')
      .get(attemptId);

    if (!attempt) {
      throw new Error(`Attempt not found: ${attemptId}`);
    }

    const prompt = this.getPromptDetails(attempt.prompt_id);
    const evaluationRow = this.database
      .prepare<[string], EvaluationRow>('SELECT payload_json FROM evaluations WHERE attempt_id = ?')
      .get(attemptId);

    return {
      id: attempt.id,
      prompt,
      essayText: attempt.essay_text,
      submittedAt: attempt.submitted_at,
      providerType: attempt.provider_type,
      status: attempt.status,
      evaluation: evaluationRow
        ? (JSON.parse(evaluationRow.payload_json) as WritingEvaluation)
        : null,
    };
  }
}
