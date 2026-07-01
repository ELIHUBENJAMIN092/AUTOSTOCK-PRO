import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [Sentry.replayIntegration()],
  tracesSampleRate: 0.1,
  enableLogs: true,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  sendDefaultPii: true,
  enabled: !!process.env.SENTRY_DSN,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
