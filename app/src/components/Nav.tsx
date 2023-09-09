import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const Nav = () => {
  const router = useRouter();

  const [arduinoStatus, setArduinoStatus] = React.useState(false);

  return (
    <nav className="flex items-center bg-gray-800 p-4 text-white">
      <div className="text-xl font-bold">Sprayer</div>
      <div className="w-6" />
      <Link href="/">
        <div
          className={`mx-4 cursor-pointer rounded-lg px-4 py-2 hover:bg-slate-500 ${
            router.pathname === "/" ? "underline" : ""
          }`}
        >
          Control Panel
        </div>
      </Link>
      <Link href="/area-config">
        <div
          className={`mx-4 cursor-pointer rounded-lg px-4 py-2 hover:bg-slate-500 ${
            router.pathname === "/area-config" ? "underline" : ""
          }`}
        >
          Area Configuration
        </div>
      </Link>
      <Link href="/pattern-config">
        <div
          className={`mx-4 cursor-pointer rounded-lg px-4 py-2 hover:bg-slate-500 ${
            router.pathname === "/pattern-config" ? "underline" : ""
          }`}
        >
          Experiment Configuration
        </div>
      </Link>
      <div className="flex flex-row items-center">
        Arduino status
        <div className="w-2" />
        <div
          className={`inline-block h-2 w-2 rounded-full ${
            arduinoStatus ? "bg-green-500" : "bg-red-500"
          }`}
        />
      </div>
    </nav>
  );
};

export { Nav };
