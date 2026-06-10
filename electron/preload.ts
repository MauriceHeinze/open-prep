import { contextBridge, ipcRenderer } from 'electron';

import type { OpenPrepApi } from '../src/shared/contracts/ipc-contracts';

const openPrepApi: OpenPrepApi = {
  getCodexAuthStatus: () => ipcRenderer.invoke('codex-auth:get-status'),
  signInWithChatGpt: () => ipcRenderer.invoke('codex-auth:sign-in'),
  listPromptCatalog: () => ipcRenderer.invoke('prompt-catalog:list'),
  getPromptDetails: (promptId) => ipcRenderer.invoke('prompt-catalog:get', promptId),
  submitWritingAttempt: (input) => ipcRenderer.invoke('writing:submit', input),
  getAttemptDetails: (attemptId) => ipcRenderer.invoke('attempts:get', attemptId),
};

contextBridge.exposeInMainWorld('openPrepApi', openPrepApi);
