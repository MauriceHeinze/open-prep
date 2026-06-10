import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AppLogo } from '@renderer/components/AppLogo';

export const shouldForceShowSignInScreen = (): boolean =>
  import.meta.env.DEV && import.meta.env.VITE_OPEN_PREP_SHOW_SIGN_IN === 'true';

const getFriendlyErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return 'ChatGPT sign-in could not be completed. Please try again.';
};

export const ChatGptSignInPage = (): JSX.Element => {
  const navigate = useNavigate();
  const forceShowSignInScreen = shouldForceShowSignInScreen();
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    window.openPrepApi
      .getCodexAuthStatus()
      .then((status) => {
        if (!isMounted) {
          return;
        }

        if (status.isAuthenticated && !forceShowSignInScreen) {
          navigate('/catalog', { replace: true });
        }
      })
      .catch((error: unknown) => {
        if (isMounted) {
          setErrorMessage(getFriendlyErrorMessage(error));
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsCheckingStatus(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [forceShowSignInScreen, navigate]);

  const handleSignIn = async (): Promise<void> => {
    setErrorMessage(null);
    setIsSigningIn(true);

    try {
      const status = await window.openPrepApi.signInWithChatGpt();

      if (status.isAuthenticated) {
        navigate('/catalog', { replace: true });
        return;
      }

      setErrorMessage('ChatGPT sign-in did not finish. Please try again.');
    } catch (error) {
      setErrorMessage(getFriendlyErrorMessage(error));
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <main className="app-page app-page--signin">
      <section className="signin-panel">
        <div className="signin-panel__brand">
          <AppLogo />
        </div>
        <div className="signin-panel__content">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Sign in with ChatGPT
          </h1>
          <p className="max-w-[460px] text-base leading-7 text-muted-foreground">
            Connect your local Codex session so OpenPrep can evaluate writing with your ChatGPT
            account.
          </p>
        </div>
        {errorMessage ? (
          <Alert className="max-w-[520px]" variant="destructive">
            <AlertTitle>Sign-in failed</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : null}
        <div className="signin-panel__actions">
          <Button
            className="h-11 rounded-md px-5 text-base"
            type="button"
            disabled={isCheckingStatus || isSigningIn}
            onClick={handleSignIn}
          >
            {isSigningIn ? 'Opening ChatGPT...' : 'Continue with ChatGPT'}
            <HugeiconsIcon icon={ArrowRight02Icon} strokeWidth={2.2} data-icon="inline-end" />
          </Button>
          <p className="text-sm text-muted-foreground">
            {isCheckingStatus ? 'Checking Codex session...' : 'One-time setup on this device.'}
          </p>
        </div>
      </section>
    </main>
  );
};
