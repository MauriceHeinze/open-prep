/// <reference types="vite/client" />

import type { OpenPrepApi } from '@shared/contracts/ipc-contracts';

declare global {
  interface Window {
    openPrepApi: OpenPrepApi;
  }
}

export {};
