import { createBrowserRouter, createHashRouter } from 'react-router-dom';

import { WritingEvaluationPage } from '@renderer/features/evaluation/components/WritingEvaluationPage';
import { PromptCatalogPage } from '@renderer/features/prompts/components/PromptCatalogPage';
import { WritingSubmissionPage } from '@renderer/features/submission/components/WritingSubmissionPage';

const routes = [
  {
    path: '/',
    element: <PromptCatalogPage />,
  },
  {
    path: '/prompts/:promptId',
    element: <WritingSubmissionPage />,
  },
  {
    path: '/attempts/:attemptId',
    element: <WritingEvaluationPage />,
  },
];

const createAppRouter = (): ReturnType<typeof createBrowserRouter> => {
  if (window.location.protocol === 'file:') {
    return createHashRouter(routes);
  }

  return createBrowserRouter(routes);
};

export const appRouter = createAppRouter();
