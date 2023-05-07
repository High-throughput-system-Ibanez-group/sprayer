import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const Nav = () => {
  const router = useRouter();

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
          Pattern Configuration
        </div>
      </Link>
    </nav>
  );
};

export { Nav };
