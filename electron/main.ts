import { app, BrowserWindow } from 'electron';
import path from 'node:path';

import { registerAppIpc } from './ipc/register-app-ipc';
import { AiToolService } from './services/ai/providers/switchboard/ai-tool-service';
import { PromptCatalogService } from './services/catalog/prompt-catalog-service';
import { AttemptRepository } from './services/persistence/attempt-repository';
import { createDatabase } from './services/persistence/database';
import { WritingEvaluationService } from './services/writing/writing-evaluation-service';

const directoryName = __dirname;

process.env.APP_ROOT = path.join(directoryName, '..');

const { VITE_DEV_SERVER_URL } = process.env;
const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');
const APP_NAME = 'OpenPrep';

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST;

let mainWindow: BrowserWindow | null = null;

const createMainWindow = (): void => {
  const publicDirectory = process.env.VITE_PUBLIC ?? RENDERER_DIST;
  const appIconPath = path.join(publicDirectory, 'logo/logo_icon_only.svg');

  mainWindow = new BrowserWindow({
    width: 1440,
    height: 1024,
    minWidth: 1200,
    minHeight: 820,
    backgroundColor: '#f5f3ef',
    title: APP_NAME,
    icon: appIconPath,
    webPreferences: {
      preload: path.join(directoryName, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    mainWindow.loadFile(path.join(RENDERER_DIST, 'index.html'));
  }
};

app.whenReady().then(() => {
  app.setName(APP_NAME);

  const database = createDatabase(app);
  const attemptRepository = new AttemptRepository(database);
  const aiToolService = new AiToolService();
  const promptCatalogService = new PromptCatalogService(attemptRepository);
  const writingEvaluationService = new WritingEvaluationService(
    promptCatalogService,
    attemptRepository,
  );

  registerAppIpc({
    aiToolService,
    promptCatalogService,
    attemptRepository,
    writingEvaluationService,
  });

  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    mainWindow = null;
  }
});
