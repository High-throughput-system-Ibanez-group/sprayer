import { type AppType } from "next/dist/shared/lib/utils";
import { Footer } from "~/components/Footer";
import { Nav } from "~/components/Nav";

import "~/styles/globals.css";
import { api } from "~/utils/api";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Nav />
      <Component {...pageProps} />
      <Footer />
    </div>
  );
};

export default api.withTRPC(MyApp);
