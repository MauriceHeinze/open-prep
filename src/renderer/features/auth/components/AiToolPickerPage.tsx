import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AppLogo } from '@renderer/components/AppLogo';
import { resolvePublicAssetUrl } from '@renderer/lib/resolve-public-asset-url';
import type { AiToolSummary } from '@shared/domain/ai/ai-tool-types';
import type { AiProviderType, SwitchboardProviderType } from '@shared/domain/ai/provider-types';

export const SELECTED_AI_TOOL_STORAGE_KEY = 'openPrep:selectedAiToolId';

type ProviderOption = {
  id: SwitchboardProviderType;
  label: string;
  logoPath: string;
};

const providerOptions: ProviderOption[] = [
  { id: 'codex', label: 'Connect ChatGPT', logoPath: '/provider_logos/chatgpt.png' },
  { id: 'claude-code', label: 'Connect Claude', logoPath: '/provider_logos/claude.png' },
  { id: 'opencode', label: 'Connect OpenCode', logoPath: '/provider_logos/opencode.png' },
  { id: 'ollama', label: 'Connect Ollama', logoPath: '/provider_logos/ollama.png' },
];

const getFriendlyErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return 'Local AI tools could not be loaded. Please try again.';
};

const isSwitchboardProvider = (providerId: AiProviderType): providerId is SwitchboardProviderType =>
  providerId !== 'mock';

const isSelectable = (tool: AiToolSummary): boolean =>
  tool.available && tool.authStatus.isAuthenticated;

const isRecommendedProvider = (providerId: SwitchboardProviderType): boolean =>
  providerId === 'claude-code' || providerId === 'codex';

const createUnavailableTool = (option: ProviderOption): AiToolSummary => ({
  id: option.id,
  name: option.label,
  type: 'unknown',
  available: false,
  capabilities: [],
  models: [],
  defaultModel: null,
  authStatus: {
    authSupported: false,
    isAuthenticated: false,
    status: 'unknown',
    message: 'Not detected on your device.',
  },
});

export const AiToolPickerPage = (): JSX.Element => {
  const navigate = useNavigate();
  const [tools, setTools] = useState<AiToolSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [authenticatingProviderId, setAuthenticatingProviderId] = useState<AiProviderType | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const toolById = useMemo(
    () => new Map(tools.map((tool) => [tool.id, tool])),
    [tools],
  );

  const loadTools = async (): Promise<AiToolSummary[]> => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const discoveredTools = await window.openPrepApi.listAiTools();
      setTools(discoveredTools);
      return discoveredTools;
    } catch (error) {
      setErrorMessage(getFriendlyErrorMessage(error));
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTools();
  }, []);

  const selectTool = (tool: AiToolSummary): void => {
    window.localStorage.setItem(SELECTED_AI_TOOL_STORAGE_KEY, tool.id);
    navigate('/catalog', { replace: true });
  };

  const handleProviderClick = async (option: ProviderOption, tool: AiToolSummary): Promise<void> => {
    if (!tool.available) {
      return;
    }

    if (isSelectable(tool)) {
      selectTool(tool);
      return;
    }

    if (!isSwitchboardProvider(option.id)) {
      return;
    }

    setAuthenticatingProviderId(option.id);
    setErrorMessage(null);

    try {
      const authStatus = await window.openPrepApi.startAiToolAuth({ providerId: option.id });
      const discoveredTools = await loadTools();
      const updatedTool = discoveredTools.find((candidate) => candidate.id === option.id);

      if (authStatus.isAuthenticated || (updatedTool && isSelectable(updatedTool))) {
        selectTool(updatedTool ?? {
          ...tool,
          authStatus,
        });
      }
    } catch (error) {
      setErrorMessage(getFriendlyErrorMessage(error));
    } finally {
      setAuthenticatingProviderId(null);
    }
  };

  return (
    <main className="app-page app-page--tool-picker">
      <section className="tool-picker__setup" aria-labelledby="tool-picker-title">
        <div className="tool-picker__brand">
          <AppLogo />
        </div>

        <div className="tool-picker__intro">
          <h1 id="tool-picker-title">Connect an AI assistant</h1>
          <p>
            OpenPrep uses an AI tool installed on your computer to evaluate your writing.
            Choose the one you want to use.
          </p>
        </div>

        {errorMessage ? (
          <Alert className="tool-picker__alert" variant="destructive">
            <AlertTitle>AI tool setup failed</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : null}

        <div className="tool-picker__grid" aria-busy={isLoading}>
          {providerOptions.map((option) => {
            const tool = toolById.get(option.id) ?? createUnavailableTool(option);
            const isAuthenticating = authenticatingProviderId === option.id;
            const isUnavailable = !tool.available;
            const statusText = isUnavailable
              ? 'Not detected on your device.'
              : isRecommendedProvider(option.id)
                ? 'Recommended'
                : null;

            return (
              <div key={option.id} className="tool-picker__provider">
                <button
                  type="button"
                  className="tool-picker__provider-button"
                  disabled={isUnavailable || isLoading || isAuthenticating}
                  onClick={() => {
                    handleProviderClick(option, tool);
                  }}
                >
                  <img
                    className={`provider-logo provider-logo--${option.id}`}
                    src={resolvePublicAssetUrl(option.logoPath)}
                    alt=""
                    aria-hidden="true"
                  />
                  <span>{isAuthenticating ? 'Connecting...' : option.label}</span>
                </button>
                {statusText ? (
                  <p
                    className={isUnavailable
                      ? 'tool-picker__status is-unavailable'
                      : 'tool-picker__status'}
                  >
                    <span aria-hidden="true" />
                    {statusText}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>
      <aside className="tool-picker__benefits" aria-label="OpenPrep writing feedback benefits">
        <div className="tool-picker__benefit-panel">
          <h2>Practice TOEFL® Writing with AI feedback</h2>
          <p>Get instant feedback on structure, clarity, grammar, and argument quality.</p>
          <ul>
            <li>TOEFL®-style prompts</li>
            <li>Personalized writing feedback</li>
            <li>Improve structure, grammar, and clarity</li>
          </ul>
        </div>
      </aside>
    </main>
  );
};
