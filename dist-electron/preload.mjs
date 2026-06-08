"use strict";
const electron = require("electron");
const openPrepApi = {
  listPromptCatalog: () => electron.ipcRenderer.invoke("prompt-catalog:list"),
  getPromptDetails: (promptId) => electron.ipcRenderer.invoke("prompt-catalog:get", promptId),
  submitWritingAttempt: (input) => electron.ipcRenderer.invoke("writing:submit", input),
  getAttemptDetails: (attemptId) => electron.ipcRenderer.invoke("attempts:get", attemptId)
};
electron.contextBridge.exposeInMainWorld("openPrepApi", openPrepApi);
