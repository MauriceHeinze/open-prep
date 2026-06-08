import { useEffect, useState } from 'react';

import type { PromptSummary } from '@shared/domain/prompts/prompt-types';

type UsePromptCatalogState = {
  prompts: PromptSummary[];
  isLoading: boolean;
  errorMessage: string | null;
};

export const usePromptCatalog = (): UsePromptCatalogState => {
  const [state, setState] = useState<UsePromptCatalogState>({
    prompts: [],
    isLoading: true,
    errorMessage: null,
  });

  useEffect(() => {
    let isCancelled = false;

    window.openPrepApi
      .listPromptCatalog()
      .then((prompts) => {
        if (!isCancelled) {
          setState({
            prompts,
            isLoading: false,
            errorMessage: null,
          });
        }
      })
      .catch((error: Error) => {
        if (!isCancelled) {
          setState({
            prompts: [],
            isLoading: false,
            errorMessage: error.message,
          });
        }
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  return state;
};
