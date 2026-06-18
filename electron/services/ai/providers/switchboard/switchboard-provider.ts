import * as v from 'valibot';
import { connect, type ProviderId } from 'switchboard-ai-sdk';

import type { AiProvider, WritingEvaluationRequest } from '../../core/ai-provider';
import type { WritingEvaluation } from '../../../../../src/shared/domain/evaluations/evaluation-types';
import type { SwitchboardProviderType } from '../../../../../src/shared/domain/ai/provider-types';
import { writingEvaluationSchema } from '../../../../../src/shared/schemas/evaluation-schemas';

import { buildSwitchboardPrompt } from './switchboard-command-builder';
import { loadSwitchboardSystemPrompt } from './switchboard-system-prompt';

const DEFAULT_SWITCHBOARD_TIMEOUT_MS = 300_000;

export const resolveSwitchboardTimeoutMs = (
  environment: Record<string, string | undefined> = process.env,
): number => {
  const configuredTimeoutMs = Number(environment.OPEN_PREP_AI_TIMEOUT_MS);

  return Number.isFinite(configuredTimeoutMs) && configuredTimeoutMs > 0
    ? configuredTimeoutMs
    : DEFAULT_SWITCHBOARD_TIMEOUT_MS;
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

export class SwitchboardProvider implements AiProvider {
  public constructor(public readonly id: SwitchboardProviderType) {}

  public async evaluateWriting(request: WritingEvaluationRequest): Promise<WritingEvaluation> {
    const systemPrompt = await loadSwitchboardSystemPrompt();
    const prompt = buildSwitchboardPrompt(request, systemPrompt);
    const tool = await connect(this.id as ProviderId);
    const timeoutMs = resolveSwitchboardTimeoutMs();
    const abortController = new AbortController();
    const timeout = setTimeout(() => abortController.abort(), timeoutMs);

    try {
      const result = await tool.chat(
        {
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        },
        {
          signal: abortController.signal,
          timeoutMs,
        },
      );
      const parsed = normalizeEvaluationPayload(
        JSON.parse(result.message.content) as unknown,
        request.essayText,
      );

      return v.parse(writingEvaluationSchema, parsed);
    } catch (error) {
      if (abortController.signal.aborted) {
        throw new Error(`AI evaluation timed out after ${String(timeoutMs)}ms.`);
      }

      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }
}
