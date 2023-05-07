import { type AppType } from "next/dist/shared/lib/utils";
import { Footer } from "~/components/Footer";
import { Nav } from "~/components/Nav";

import "~/styles/globals.css";
import { api } from "~/utils/api";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className="flex h-screen flex-col">
      <Nav />
      <div className="h-full flex-1 overflow-scroll">
        <Component {...pageProps} />
        <Footer />
      </div>
    </div>
  );
};

export default api.withTRPC(MyApp);
