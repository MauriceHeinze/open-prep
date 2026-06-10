/// <reference types="vite/client" />

import type { OpenPrepApi } from '@shared/contracts/ipc-contracts';

declare global {
  interface ImportMetaEnv {
    readonly VITE_OPEN_PREP_SHOW_SIGN_IN?: string;
  }

  interface Window {
    openPrepApi: OpenPrepApi;
  }
}

export {};
