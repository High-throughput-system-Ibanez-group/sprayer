import { type NextPage } from "next";
import Head from "next/head";
import { Moves } from "~/components/control-panel/Moves";
import { Settings } from "~/components/control-panel/Settings";
import { WorkingSpace } from "~/components/control-panel/WorkingSpace";
import { Zeroing } from "~/components/control-panel/Zeroing";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>IST Project</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-1 flex-col items-center">
        <div className="h-12" />
        <Zeroing />
        <div className="h-6" />
        <Settings />
        <div className="h-6" />
        <Moves />
        <div className="h-6" />
        <WorkingSpace />
        <div className="h-4" />
      </main>
    </>
  );
};

export default Home;
