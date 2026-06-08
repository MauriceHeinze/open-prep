import { useEffect, useState } from 'react';

import type { PromptDetails } from '@shared/domain/prompts/prompt-types';

type UsePromptDetailsState = {
  prompt: PromptDetails | null;
  isLoading: boolean;
  errorMessage: string | null;
};

export const usePromptDetails = (promptId: string | undefined): UsePromptDetailsState => {
  const [state, setState] = useState<UsePromptDetailsState>({
    prompt: null,
    isLoading: true,
    errorMessage: null,
  });

  useEffect(() => {
    if (!promptId) {
      setState({
        prompt: null,
        isLoading: false,
        errorMessage: 'Prompt id is missing.',
      });
      return undefined;
    }

    let isCancelled = false;

    window.openPrepApi
      .getPromptDetails(promptId)
      .then((prompt) => {
        if (!isCancelled) {
          setState({
            prompt,
            isLoading: false,
            errorMessage: null,
          });
        }
      })
      .catch((error: Error) => {
        if (!isCancelled) {
          setState({
            prompt: null,
            isLoading: false,
            errorMessage: error.message,
          });
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [promptId]);

  return state;
};
