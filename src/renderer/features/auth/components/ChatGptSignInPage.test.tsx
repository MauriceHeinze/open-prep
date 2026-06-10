import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { OpenPrepApi } from '@shared/contracts/ipc-contracts';

import { ChatGptSignInPage } from './ChatGptSignInPage';

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean })
  .IS_REACT_ACT_ENVIRONMENT = true;

const createOpenPrepApiMock = (
  overrides: Partial<OpenPrepApi> = {},
): OpenPrepApi => ({
  getCodexAuthStatus: vi.fn().mockResolvedValue({ isAuthenticated: false }),
  signInWithChatGpt: vi.fn().mockResolvedValue({ isAuthenticated: true }),
  listPromptCatalog: vi.fn(),
  getPromptDetails: vi.fn(),
  submitWritingAttempt: vi.fn(),
  getAttemptDetails: vi.fn(),
  ...overrides,
});

const renderSignInPage = async (): Promise<Root> => {
  const rootElement = document.createElement('div');
  document.body.append(rootElement);
  const root = createRoot(rootElement);

  await act(async () => {
    root.render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<ChatGptSignInPage />} />
          <Route path="/catalog" element={<div>Prompt catalog</div>} />
        </Routes>
      </MemoryRouter>,
    );
  });

  return root;
};

describe('ChatGptSignInPage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    document.body.innerHTML = '';
  });

  it('shows the ChatGPT sign-in screen when Codex is not ready', async () => {
    window.openPrepApi = createOpenPrepApiMock();

    const root = await renderSignInPage();

    expect(document.body.textContent).toContain('Sign in with ChatGPT');
    expect(document.body.textContent).toContain('Connect your local Codex session');

    act(() => root.unmount());
  });

  it('keeps the sign-in screen visible in dev when the force flag is enabled', async () => {
    vi.stubEnv('VITE_OPEN_PREP_SHOW_SIGN_IN', 'true');
    window.openPrepApi = createOpenPrepApiMock({
      getCodexAuthStatus: vi.fn().mockResolvedValue({ isAuthenticated: true }),
    });

    const root = await renderSignInPage();

    expect(document.body.textContent).toContain('Sign in with ChatGPT');
    expect(document.body.textContent).not.toContain('Prompt catalog');

    act(() => root.unmount());
  });

  it('navigates to the prompt catalog after sign-in succeeds', async () => {
    const signInWithChatGpt = vi.fn().mockResolvedValue({ isAuthenticated: true });
    window.openPrepApi = createOpenPrepApiMock({ signInWithChatGpt });

    const root = await renderSignInPage();
    const button = document.querySelector('button');

    expect(button).not.toBeNull();

    await act(async () => {
      button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(signInWithChatGpt).toHaveBeenCalled();
    expect(document.body.textContent).toContain('Prompt catalog');

    act(() => root.unmount());
  });
});
