import { Codex } from '@openai/codex-sdk';
import * as v from 'valibot';

import type { AiProvider, WritingEvaluationRequest } from '../../core/ai-provider';
import type { WritingEvaluation } from '../../../../../src/shared/domain/evaluations/evaluation-types';
import { writingEvaluationSchema } from '../../../../../src/shared/schemas/evaluation-schemas';

import { buildCodexPrompt } from './codex-command-builder';
import { writingEvaluationOutputSchema } from './codex-output-schema';
import { loadCodexSystemPrompt } from './codex-system-prompt';

const CODEX_MODEL = 'gpt-5.4-mini';
const CODEX_REASONING_EFFORT = 'low';
const DEFAULT_CODEX_TIMEOUT_MS = 300_000;

export const resolveCodexTimeoutMs = (
  environment: Record<string, string | undefined> = process.env,
): number => {
  const configuredTimeoutMs = Number(environment.OPEN_PREP_CODEX_TIMEOUT_MS);

  return Number.isFinite(configuredTimeoutMs) && configuredTimeoutMs > 0
    ? configuredTimeoutMs
    : DEFAULT_CODEX_TIMEOUT_MS;
};

const isValidOffset = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0;

const resolveHighlightOffsets = (
  essayText: string,
  highlight: Record<string, unknown>,
): Pick<Record<string, number>, 'startOffset' | 'endOffset'> | null => {
  if (isValidOffset(highlight.startOffset) && isValidOffset(highlight.endOffset)) {
    return {
      startOffset: highlight.startOffset,
      endOffset: Math.max(highlight.startOffset, highlight.endOffset),
    };
  }

  if (typeof highlight.excerpt !== 'string' || highlight.excerpt.trim().length === 0) {
    return null;
  }

  const startOffset = essayText.indexOf(highlight.excerpt);

  if (startOffset < 0) {
    return null;
  }

  return {
    startOffset,
    endOffset: startOffset + highlight.excerpt.length,
  };
};

export const normalizeEvaluationPayload = (payload: unknown, essayText: string): unknown => {
  if (!payload || typeof payload !== 'object') {
    return payload;
  }

  const evaluation = payload as Record<string, unknown>;
  const highlights = Array.isArray(evaluation.highlights)
    ? evaluation.highlights
    : evaluation.highlights;

  if (!Array.isArray(highlights)) {
    return evaluation;
  }

  return {
    ...evaluation,
    highlights: highlights.flatMap((highlight) => {
      if (!highlight || typeof highlight !== 'object') {
        return [];
      }

      const highlightRecord = highlight as Record<string, unknown>;
      const offsets = resolveHighlightOffsets(essayText, highlightRecord);

      if (!offsets) {
        return [];
      }

      return [{
        ...highlightRecord,
        alternatives: Array.isArray(highlightRecord.alternatives)
          ? highlightRecord.alternatives
          : [],
        ...offsets,
      }];
    }),
  };
};

export class CodexProvider implements AiProvider {
  public readonly id = 'codex' as const;

  public async evaluateWriting(request: WritingEvaluationRequest): Promise<WritingEvaluation> {
    const systemPrompt = await loadCodexSystemPrompt();
    const prompt = buildCodexPrompt(request, systemPrompt);
    const codex = new Codex();
    const thread = codex.startThread({
      model: CODEX_MODEL,
      modelReasoningEffort: CODEX_REASONING_EFFORT,
      skipGitRepoCheck: true,
    });
    const timeoutMs = resolveCodexTimeoutMs();
    const abortController = new AbortController();
    const timeout = setTimeout(() => abortController.abort(), timeoutMs);

    try {
      const result = await thread.run(prompt, {
        outputSchema: writingEvaluationOutputSchema,
        signal: abortController.signal,
      });
      const parsed = normalizeEvaluationPayload(
        JSON.parse(result.finalResponse) as unknown,
        request.essayText,
      );

      return v.parse(writingEvaluationSchema, parsed);
    } catch (error) {
      if (abortController.signal.aborted) {
        throw new Error(`Codex evaluation timed out after ${String(timeoutMs)}ms.`);
      }

      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }
}
