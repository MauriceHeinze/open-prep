import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { OpenPrepApi } from '@shared/contracts/ipc-contracts';
import type { AiToolSummary } from '@shared/domain/ai/ai-tool-types';

import { AiToolPickerPage, SELECTED_AI_TOOL_STORAGE_KEY } from './AiToolPickerPage';

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean })
  .IS_REACT_ACT_ENVIRONMENT = true;

const createOpenPrepApiMock = (
  overrides: Partial<OpenPrepApi> = {},
): OpenPrepApi => ({
  listAiTools: vi.fn().mockResolvedValue([
    {
      id: 'codex',
      name: 'Codex',
      type: 'agent',
      available: true,
      capabilities: ['chat', 'health-check'],
      models: ['gpt-5-codex'],
      defaultModel: 'gpt-5-codex',
      authStatus: {
        authSupported: true,
        isAuthenticated: true,
        status: 'authenticated',
      },
    },
  ]),
  getAiToolAuthStatus: vi.fn(),
  startAiToolAuth: vi.fn().mockResolvedValue({
    authSupported: true,
    isAuthenticated: true,
    status: 'authenticated',
  }),
  listPromptCatalog: vi.fn(),
  getPromptDetails: vi.fn(),
  submitWritingAttempt: vi.fn(),
  getAttemptDetails: vi.fn(),
  ...overrides,
});

const createTool = (
  overrides: Partial<AiToolSummary> & Pick<AiToolSummary, 'id' | 'name'>,
): AiToolSummary => ({
  type: 'agent',
  available: true,
  capabilities: ['chat'],
  models: [],
  defaultModel: null,
  authStatus: {
    authSupported: true,
    isAuthenticated: true,
    status: 'authenticated',
  },
  ...overrides,
});

const renderToolPickerPage = async (): Promise<Root> => {
  const rootElement = document.createElement('div');
  document.body.append(rootElement);
  const root = createRoot(rootElement);

  await act(async () => {
    root.render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<AiToolPickerPage />} />
          <Route path="/catalog" element={<div>Prompt catalog</div>} />
        </Routes>
      </MemoryRouter>,
    );
  });

  return root;
};

describe('AiToolPickerPage', () => {
  beforeEach(() => {
    const storage = new Map<string, string>();

    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: {
        clear: vi.fn(() => storage.clear()),
        getItem: vi.fn((key: string) => storage.get(key) ?? null),
        removeItem: vi.fn((key: string) => storage.delete(key)),
        setItem: vi.fn((key: string, value: string) => storage.set(key, value)),
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
    document.body.innerHTML = '';
  });

  it('shows the split-screen connection copy and fixed provider options', async () => {
    window.openPrepApi = createOpenPrepApiMock();

    const root = await renderToolPickerPage();

    expect(document.body.textContent).toContain('Connect an AI assistant');
    expect(document.body.textContent).toContain(
      'OpenPrep uses an AI tool installed on your computer to evaluate your writing.',
    );
    expect(document.body.textContent).toContain('Connect Claude');
    expect(document.body.textContent).toContain('Connect ChatGPT');
    expect(document.body.textContent).toContain('Connect OpenCode');
    expect(document.body.textContent).toContain('Connect Ollama');
    expect(document.body.textContent).toContain('Practice TOEFL Writing with AI feedback');
    expect(document.body.textContent).toContain('TOEFL-style prompts');

    act(() => root.unmount());
  });

  it('starts provider auth when an available tool needs sign-in', async () => {
    const startAiToolAuth = vi.fn().mockResolvedValue({
      authSupported: true,
      isAuthenticated: false,
      status: 'unknown',
    });
    window.openPrepApi = createOpenPrepApiMock({
      listAiTools: vi.fn().mockResolvedValue([
        createTool({
          id: 'codex',
          name: 'Codex',
          authStatus: {
            authSupported: true,
            isAuthenticated: false,
            status: 'unauthenticated',
            message: 'Login required',
          },
        }),
      ]),
      startAiToolAuth,
    });

    const root = await renderToolPickerPage();
    const chatGptButton = Array.from(document.querySelectorAll('button')).find(
      (button) => button.textContent === 'Connect ChatGPT',
    );

    await act(async () => {
      chatGptButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(startAiToolAuth).toHaveBeenCalledWith({ providerId: 'codex' });

    act(() => root.unmount());
  });

  it('disables unavailable providers and shows the not detected status', async () => {
    window.openPrepApi = createOpenPrepApiMock({
      listAiTools: vi.fn().mockResolvedValue([
        createTool({
          id: 'codex',
          name: 'Codex',
        }),
      ]),
    });

    const root = await renderToolPickerPage();
    const ollamaButton = Array.from(document.querySelectorAll('button')).find(
      (button) => button.textContent === 'Connect Ollama',
    );

    expect(ollamaButton).toBeInstanceOf(HTMLButtonElement);
    expect((ollamaButton as HTMLButtonElement | undefined)?.disabled).toBe(true);
    expect(document.body.textContent).toContain('Not detected on your device.');
    expect(document.body.textContent).toContain('Recommended');

    act(() => root.unmount());
  });

  it('only marks Claude and ChatGPT as recommended when available', async () => {
    window.openPrepApi = createOpenPrepApiMock({
      listAiTools: vi.fn().mockResolvedValue([
        createTool({
          id: 'claude-code',
          name: 'Claude Code',
        }),
        createTool({
          id: 'codex',
          name: 'Codex',
        }),
        createTool({
          id: 'opencode',
          name: 'OpenCode',
        }),
        createTool({
          id: 'ollama',
          name: 'Ollama',
        }),
      ]),
    });

    const root = await renderToolPickerPage();
    const recommendedLabels = Array.from(document.querySelectorAll('.tool-picker__status'))
      .filter((status) => status.textContent === 'Recommended');

    expect(recommendedLabels).toHaveLength(2);
    expect(document.body.textContent).not.toContain('Not detected on your device.');

    act(() => root.unmount());
  });

  it('persists the selected provider and opens the catalog', async () => {
    window.openPrepApi = createOpenPrepApiMock();

    const root = await renderToolPickerPage();
    const selectButton = Array.from(document.querySelectorAll('button')).find(
      (button) => button.textContent === 'Connect ChatGPT',
    );

    await act(async () => {
      selectButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(window.localStorage.getItem(SELECTED_AI_TOOL_STORAGE_KEY)).toBe('codex');
    expect(document.body.textContent).toContain('Prompt catalog');

    act(() => root.unmount());
  });
});
