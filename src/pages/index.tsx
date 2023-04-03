import { NextPage } from "next";
import BlankLayout from "@/@core/layouts/BlankLayout";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";
import Spinner from "src/@core/components/spinner";

const IndexPage: NextPage = () => {
  const router = useRouter();
  const { status } = useSession();

  const redirect = () => {
    if (status === "authenticated") return router.push("/dashboard");
    else return router.push("/login");
  };

  useEffect(() => {
    redirect();
  }, []);

  return <Spinner />;
};

IndexPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;

export default IndexPage;
