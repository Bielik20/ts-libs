import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import { HttpInterceptors } from '@ns3/http-client';
import { DiProvider, useDependencyInjection } from '@ns3/react-di';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { AppLayout } from 'react-demo/layout/app-layout';
import { DelayInterceptor } from 'react-demo/shared/delay.interceptor';
import theme from '../src/theme';

export default function MyApp({ Component, pageProps }: AppProps) {
  const container = useDependencyInjection([HttpInterceptors.provide(DelayInterceptor)]);
  const router = useRouter();

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  if (!router.isReady) {
    return null;
  }

  return (
    <React.Fragment>
      <Head>
        <title>My page</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <DiProvider value={container}>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <AppLayout>
            <Component {...pageProps} />
          </AppLayout>
        </ThemeProvider>
      </DiProvider>
    </React.Fragment>
  );
}
