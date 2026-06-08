import { useEffect, useState } from 'react';

import type { WritingAttemptDetails } from '@shared/domain/evaluations/evaluation-types';

type UseAttemptDetailsState = {
  attempt: WritingAttemptDetails | null;
  isLoading: boolean;
  errorMessage: string | null;
};

export const useAttemptDetails = (attemptId: string | undefined): UseAttemptDetailsState => {
  const [state, setState] = useState<UseAttemptDetailsState>({
    attempt: null,
    isLoading: true,
    errorMessage: null,
  });

  useEffect(() => {
    if (!attemptId) {
      setState({
        attempt: null,
        isLoading: false,
        errorMessage: 'Attempt id is missing.',
      });
      return undefined;
    }

    let isCancelled = false;

    window.openPrepApi
      .getAttemptDetails(attemptId)
      .then((attempt) => {
        if (!isCancelled) {
          setState({
            attempt,
            isLoading: false,
            errorMessage: null,
          });
        }
      })
      .catch((error: Error) => {
        if (!isCancelled) {
          setState({
            attempt: null,
            isLoading: false,
            errorMessage: error.message,
          });
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [attemptId]);

  return state;
};
