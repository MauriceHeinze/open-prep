import { ipcMain } from 'electron';
import * as v from 'valibot';

import type { PromptCatalogService } from '../services/catalog/prompt-catalog-service';
import type { AttemptRepository } from '../services/persistence/attempt-repository';
import type { WritingEvaluationService } from '../services/writing/writing-evaluation-service';
import type { AiToolService } from '../services/ai/providers/switchboard/ai-tool-service';
import { submitWritingAttemptInputSchema } from '../../src/shared/schemas/prompt-schemas';
import type { SwitchboardProviderType } from '../../src/shared/domain/ai/provider-types';

type RegisterAppIpcDependencies = {
  aiToolService: AiToolService;
  promptCatalogService: PromptCatalogService;
  attemptRepository: AttemptRepository;
  writingEvaluationService: WritingEvaluationService;
};

export const registerAppIpc = ({
  aiToolService,
  promptCatalogService,
  attemptRepository,
  writingEvaluationService,
}: RegisterAppIpcDependencies): void => {
  ipcMain.handle('ai-tools:list', () => aiToolService.listTools());
  ipcMain.handle('ai-tools:get-auth-status', (_event, providerId: SwitchboardProviderType) =>
    aiToolService.getAuthStatus(providerId),
  );
  ipcMain.handle('ai-tools:start-auth', (_event, payload: { providerId: SwitchboardProviderType }) =>
    aiToolService.startAuth(payload.providerId),
  );
  ipcMain.handle('prompt-catalog:list', () => promptCatalogService.listPromptCatalog());
  ipcMain.handle('prompt-catalog:get', (_event, promptId: string) =>
    promptCatalogService.getPromptDetails(promptId),
  );
  ipcMain.handle('writing:submit', (_event, payload: unknown) =>
    writingEvaluationService.submitAttempt(v.parse(submitWritingAttemptInputSchema, payload)),
  );
  ipcMain.handle('attempts:get', (_event, attemptId: string) =>
    attemptRepository.getAttemptDetails(attemptId),
  );
};
