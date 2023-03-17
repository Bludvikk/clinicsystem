// ** React Imports
import { ReactNode } from "react";

// ** Next Imports
import Head from "next/head";
import { Router } from "next/router";
import type { NextPage } from "next";
import type { AppProps } from "next/app";

import { queryClient, trpc } from "@/utils/trpc";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClientProvider } from "@tanstack/react-query";

// ** Loader Import
import Nprogress from "nprogress";

// ** Emotion Imports
import { CacheProvider } from "@emotion/react";
import type { EmotionCache } from "@emotion/cache";

// ** Config Imports
import themeConfig from "src/configs/themeConfig";

// ** Third Party Import
import { Toaster } from "react-hot-toast";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// ** Component Imports
import UserLayout from "src/layouts/UserLayout";
import ThemeComponent from "src/@core/theme/ThemeComponent";
import WindowWrapper from "src/@core/components/window-wrapper";

// ** Spinner Import
import Spinner from "src/@core/components/spinner";

// ** Contexts
import {
  SettingsConsumer,
  SettingsProvider,
} from "src/@core/context/settingsContext";

// ** Styled Components
import ReactHotToast from "src/@core/styles/libs/react-hot-toast";

// ** Utils Imports
import { createEmotionCache } from "src/@core/utils/create-emotion-cache";

// ** Prismjs Styles
import "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";

// ** React Perfect Scrollbar Style
import "react-perfect-scrollbar/dist/css/styles.css";

// ** Global css styles
import "@/styles/globals.css";

import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

// ** Extend App Props with Emotion
type ExtendedAppProps = CustomAppProps & {
  Component: NextPage;
  emotionCache: EmotionCache;
};

interface CustomAppProps extends AppProps {
  pageProps: {
    session?: Session;
  } & AppProps["pageProps"];
}

const clientSideEmotionCache = createEmotionCache();

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on("routeChangeStart", () => {
    Nprogress.start();
  });
  Router.events.on("routeChangeError", () => {
    Nprogress.done();
  });
  Router.events.on("routeChangeComplete", () => {
    Nprogress.done();
  });
}

const CustomApp = ({
  Component,
  pageProps,
  emotionCache,
}: ExtendedAppProps) => {
  emotionCache = clientSideEmotionCache;

  const contentHeightFixed = Component.contentHeightFixed ?? false;

  const getLayout =
    Component.getLayout ??
    ((page) => (
      <UserLayout contentHeightFixed={contentHeightFixed}>{page}</UserLayout>
    ));

  const setConfig = Component.setConfig ?? undefined;

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>{`${themeConfig.templateName}`}</title>
        <meta
          name="description"
          content={`${themeConfig.templateName} – Better Way to Manage your Business and Access your data Anytime, Anywhere – Web Application for monitoring Sales & Inventory.`}
        />
        <meta
          name="keywords"
          content="Material Design, MUI, Admin Template, React Admin Template"
        />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>

      <SettingsProvider {...(setConfig ? { pageSettings: setConfig() } : {})}>
        <SettingsConsumer>
          {({ settings }) => {
            return (
              <ThemeComponent settings={settings}>
                <WindowWrapper>
                  <QueryClientProvider client={queryClient}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <SessionProvider session={pageProps.session}>
                        {getLayout(<Component {...pageProps} />)}
                        <ReactQueryDevtools initialIsOpen={false} />
                      </SessionProvider>
                    </LocalizationProvider>
                  </QueryClientProvider>
                </WindowWrapper>
                <ReactHotToast>
                  <Toaster
                    position={settings.toastPosition}
                    toastOptions={{ className: "react-hot-toast" }}
                  />
                </ReactHotToast>
              </ThemeComponent>
            );
          }}
        </SettingsConsumer>
      </SettingsProvider>
    </CacheProvider>
  );
};

export default trpc.withTRPC(CustomApp);
