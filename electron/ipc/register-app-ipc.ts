import { ipcMain } from 'electron';
import * as v from 'valibot';

import type { PromptCatalogService } from '../services/catalog/prompt-catalog-service';
import type { AttemptRepository } from '../services/persistence/attempt-repository';
import type { WritingEvaluationService } from '../services/writing/writing-evaluation-service';
import { submitWritingAttemptInputSchema } from '../../src/shared/schemas/prompt-schemas';

type RegisterAppIpcDependencies = {
  promptCatalogService: PromptCatalogService;
  attemptRepository: AttemptRepository;
  writingEvaluationService: WritingEvaluationService;
};

export const registerAppIpc = ({
  promptCatalogService,
  attemptRepository,
  writingEvaluationService,
}: RegisterAppIpcDependencies): void => {
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
