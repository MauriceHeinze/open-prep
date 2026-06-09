import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import * as v from 'valibot';

import type { AiProvider, WritingEvaluationRequest } from '../../core/ai-provider';
import type { WritingEvaluation } from '../../../../../src/shared/domain/evaluations/evaluation-types';
import { writingEvaluationSchema } from '../../../../../src/shared/schemas/evaluation-schemas';

import { buildCodexPrompt } from './codex-command-builder';
import {
  buildCodexEnvironment,
  buildCodexNotFoundMessage,
  resolveCodexCommand,
  resolveCodexTimeoutMs,
} from './codex-cli-environment';
import { loadCodexSystemPrompt } from './codex-system-prompt';

const CODEX_MODEL = 'gpt-5.4-mini';
const CODEX_REASONING_EFFORT = 'low';

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
    const outputFilePath = path.join(os.tmpdir(), `open-prep-codex-${randomUUID()}.json`);
    const systemPrompt = await loadCodexSystemPrompt();
    const prompt = buildCodexPrompt(request, systemPrompt);

    const args = [
      'exec',
      '--skip-git-repo-check',
      '--output-last-message',
      outputFilePath,
      '--model',
      CODEX_MODEL,
      '--config',
      `model_reasoning_effort="${CODEX_REASONING_EFFORT}"`,
      '-',
    ];

    await new Promise<void>((resolve, reject) => {
      const codexEnvironment: NodeJS.ProcessEnv = {
        ...buildCodexEnvironment(),
        APP_ROOT: process.env.APP_ROOT,
        VITE_PUBLIC: process.env.VITE_PUBLIC,
      };
      const child = spawn(resolveCodexCommand(), args, {
        env: codexEnvironment,
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      let stderr = '';
      const timeoutMs = resolveCodexTimeoutMs(codexEnvironment);
      const timeout = setTimeout(() => {
        child.kill('SIGTERM');
        const diagnostic = stderr.trim();

        reject(
          new Error(
            diagnostic.length > 0
              ? `Codex evaluation timed out after ${String(timeoutMs)}ms. ${diagnostic}`
              : `Codex evaluation timed out after ${String(timeoutMs)}ms.`,
          ),
        );
      }, timeoutMs);

      child.stderr.on('data', (chunk: Buffer) => {
        stderr += chunk.toString();
      });

      child.on('error', (error: NodeJS.ErrnoException) => {
        clearTimeout(timeout);
        reject(
          error.code === 'ENOENT' ? new Error(buildCodexNotFoundMessage(codexEnvironment)) : error,
        );
      });

      child.on('close', (code) => {
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

    const raw = await fs.readFile(outputFilePath, 'utf8');
    await fs.rm(outputFilePath, { force: true });

    const parsed = normalizeEvaluationPayload(JSON.parse(raw) as unknown, request.essayText);

    return v.parse(writingEvaluationSchema, parsed);
  }
}
