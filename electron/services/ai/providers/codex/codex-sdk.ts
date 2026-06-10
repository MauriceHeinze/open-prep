import { createRequire } from 'node:module';
import path from 'node:path';

import type { Codex } from '@openai/codex-sdk';

const CODEX_BINARY_NAME = process.platform === 'win32' ? 'codex.exe' : 'codex';
const CODEX_PLATFORM_PACKAGES = {
  'darwin:arm64': {
    packageName: '@openai/codex-darwin-arm64',
    targetTriple: 'aarch64-apple-darwin',
  },
  'darwin:x64': {
    packageName: '@openai/codex-darwin-x64',
    targetTriple: 'x86_64-apple-darwin',
  },
  'linux:arm64': {
    packageName: '@openai/codex-linux-arm64',
    targetTriple: 'aarch64-unknown-linux-musl',
  },
  'linux:x64': {
    packageName: '@openai/codex-linux-x64',
    targetTriple: 'x86_64-unknown-linux-musl',
  },
  'win32:arm64': {
    packageName: '@openai/codex-win32-arm64',
    targetTriple: 'aarch64-pc-windows-msvc',
  },
  'win32:x64': {
    packageName: '@openai/codex-win32-x64',
    targetTriple: 'x86_64-pc-windows-msvc',
  },
} as const;

type CodexPlatformKey = keyof typeof CODEX_PLATFORM_PACKAGES;

const moduleRequire = createRequire(import.meta.url);

export const resolveAsarUnpackedPath = (filePath: string): string =>
  filePath.replace(`${path.sep}app.asar${path.sep}`, `${path.sep}app.asar.unpacked${path.sep}`);

export const resolvePackagedCodexPaths = (): { executablePath: string; pathDirectory: string } | null => {
  const platformKey = `${process.platform}:${process.arch}` as CodexPlatformKey;
  const platformPackage = CODEX_PLATFORM_PACKAGES[platformKey];

  if (!platformPackage) {
    return null;
  }

  try {
    const packageJsonPath = moduleRequire.resolve(`${platformPackage.packageName}/package.json`);
    const packageRoot = resolveAsarUnpackedPath(path.dirname(packageJsonPath));
    const vendorRoot = path.join(packageRoot, 'vendor', platformPackage.targetTriple);

    return {
      executablePath: path.join(vendorRoot, 'bin', CODEX_BINARY_NAME),
      pathDirectory: path.join(vendorRoot, 'codex-path'),
    };
  } catch {
    return null;
  }
};

export const createCodexClient = async (): Promise<Codex> => {
  const { Codex } = await import('@openai/codex-sdk');
  const packagedCodexPaths = resolvePackagedCodexPaths();

  if (packagedCodexPaths?.executablePath.includes(`${path.sep}app.asar.unpacked${path.sep}`)) {
    return new Codex({
      codexPathOverride: packagedCodexPaths.executablePath,
      env: {
        ...process.env,
        PATH: [
          packagedCodexPaths.pathDirectory,
          process.env.PATH,
        ].filter(Boolean).join(path.delimiter),
      },
    });
  }

  return new Codex();
};
