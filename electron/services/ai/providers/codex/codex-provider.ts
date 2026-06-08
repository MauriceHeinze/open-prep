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
} from './codex-cli-environment';
import { loadCodexSystemPrompt } from './codex-system-prompt';

const CODEX_TIMEOUT_MS = 90_000;
const CODEX_MODEL = 'gpt-5.4-mini';
const CODEX_REASONING_EFFORT = 'low';

const normalizeEvaluationPayload = (payload: unknown): unknown => {
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
    highlights: highlights.map((highlight) => {
      if (!highlight || typeof highlight !== 'object') {
        return highlight;
      }

      const highlightRecord = highlight as Record<string, unknown>;

      return {
        ...highlightRecord,
        alternatives: Array.isArray(highlightRecord.alternatives)
          ? highlightRecord.alternatives
          : [],
      };
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
      const timeout = setTimeout(() => {
        child.kill('SIGTERM');
        reject(new Error('Codex evaluation timed out.'));
      }, CODEX_TIMEOUT_MS);

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

    const parsed = normalizeEvaluationPayload(JSON.parse(raw) as unknown);

    return v.parse(writingEvaluationSchema, parsed);
  }
}
