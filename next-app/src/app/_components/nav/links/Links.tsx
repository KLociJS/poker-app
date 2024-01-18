"use client";

import { ROUTES } from "@/app/_constants/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Style from "../nav.module.css";

const Links = () => {
  const pathname = usePathname();

  const links = [
    // { href: ROUTES.HOME, label: "Home" },
    // { href: ROUTES.LOGIN, label: "Login" },
    // { href: ROUTES.SIGNUP, label: "Sign Up" },
    { href: ROUTES.DASHBOARD, label: "Dashboard" },
  ];
  return (
    <div className={Style["link-container"]}>
      {links.map(({ href, label }) => (
        <Link
          key={`${href}${label}`}
          href={href}
          className={`${Style.link} ${pathname === href ? Style.active : ""}`}
        >
          {label}
        </Link>
      ))}
    </div>
  );
};

export default Links;
