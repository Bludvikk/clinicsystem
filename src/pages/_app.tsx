import '@/styles/globals.css'

import type { AppProps } from "next/app";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { trpc } from "../utils/trpc";

interface CustomAppProps extends AppProps {
  pageProps: {
    session?: Session;
  } & AppProps["pageProps"];
}

const CustomApp = ({ Component, pageProps }: CustomAppProps) => {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
      <ReactQueryDevtools initialIsOpen={false} />
    </SessionProvider>
  );
};

export default trpc.withTRPC(CustomApp);
