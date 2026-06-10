import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AppLogo } from '@renderer/components/AppLogo';

const getFriendlyErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return 'ChatGPT sign-in could not be completed. Please try again.';
};

export const ChatGptSignInPage = (): JSX.Element => {
  const navigate = useNavigate();
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

        if (status.isAuthenticated) {
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
  }, [navigate]);

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
        <Card className="signin-panel__surface border-border/80 bg-card shadow-[var(--shadow)]">
          <CardContent className="grid gap-8 p-10">
            <div className="grid gap-4">
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-primary">
                AI evaluation setup
              </p>
              <div className="grid gap-3">
                <h1 className="text-4xl font-bold tracking-tight text-foreground">
                  Sign in with ChatGPT
                </h1>
                <p className="max-w-[560px] text-lg leading-8 text-muted-foreground">
                  OpenPrep uses OpenAI Codex to evaluate your writing. Sign in with ChatGPT to
                  enable AI feedback.
                </p>
              </div>
            </div>
            {errorMessage ? (
              <Alert variant="destructive">
                <AlertTitle>Sign-in failed</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            ) : null}
            <div className="flex flex-wrap items-center gap-4">
              <Button
                className="h-12 rounded-2xl px-6 text-base"
                type="button"
                disabled={isCheckingStatus || isSigningIn}
                onClick={handleSignIn}
              >
                {isSigningIn ? 'Opening ChatGPT...' : 'Continue with ChatGPT'}
                <HugeiconsIcon icon={ArrowRight02Icon} strokeWidth={2.2} data-icon="inline-end" />
              </Button>
              <p className="text-sm text-muted-foreground">
                {isCheckingStatus
                  ? 'Checking your local Codex session...'
                  : 'You only need to do this once on this device.'}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};
