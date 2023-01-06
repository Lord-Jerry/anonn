import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import { Analytics } from '@vercel/analytics/react';

import '../styles/globals.css';
import Head from 'next/head';
import { useForegroundNotification, useRefreshNotificationToken } from 'hooks/useNotification';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  useRefreshNotificationToken();
  useForegroundNotification();
  return (
    <QueryClientProvider client={queryClient}>
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no"
        />
      </Head>
      <Component {...pageProps} />
      <Analytics />
    </QueryClientProvider>
  );
}
