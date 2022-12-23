import 'reflect-metadata';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import { DiProvider, useDependencyInjection } from '@ns3/react-di';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { Fragment, useEffect, useState } from 'react';
import { AppLayout } from 'react-demo/layout/app-layout';
import theme from '../src/theme';

export default function MyApp({ Component, pageProps }: AppProps) {
  const container = useDependencyInjection();
  const [ready, setReady] = useState(false); // workaround for router not being ready

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
    setReady(true);
  }, []);

  if (!ready) {
    return null;
  }

  return (
    <Fragment>
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
    </Fragment>
  );
}
