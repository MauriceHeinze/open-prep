import { contextBridge, ipcRenderer } from 'electron';

import type { OpenPrepApi } from '../src/shared/contracts/ipc-contracts';

const openPrepApi: OpenPrepApi = {
  listAiTools: () => ipcRenderer.invoke('ai-tools:list'),
  getAiToolAuthStatus: (providerId) => ipcRenderer.invoke('ai-tools:get-auth-status', providerId),
  startAiToolAuth: (input) => ipcRenderer.invoke('ai-tools:start-auth', input),
  listPromptCatalog: () => ipcRenderer.invoke('prompt-catalog:list'),
  getPromptDetails: (promptId) => ipcRenderer.invoke('prompt-catalog:get', promptId),
  submitWritingAttempt: (input) => ipcRenderer.invoke('writing:submit', input),
  getAttemptDetails: (attemptId) => ipcRenderer.invoke('attempts:get', attemptId),
};

contextBridge.exposeInMainWorld('openPrepApi', openPrepApi);
