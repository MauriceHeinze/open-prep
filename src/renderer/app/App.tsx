import { RouterProvider } from 'react-router-dom';

import { appRouter } from '@renderer/app/router';

export const App = (): JSX.Element => <RouterProvider router={appRouter} />;
