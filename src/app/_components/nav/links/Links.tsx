import { ROUTES } from "@/app/_constants/constants";
import Link from "next/link";

const Links = () => {
  const links = [
    { href: ROUTES.HOME, label: "Home" },
    //{ href: routes.LOGIN, label: "Login" },
    //{ href: routes.SIGNUP, label: "Sign Up" },
    { href: ROUTES.DASHBOARD, label: "Dashboard" },
  ];
  return (
    <ul>
      {links.map(({ href, label }) => (
        <li key={`${href}${label}`}>
          <Link href={href}>{label}</Link>
        </li>
      ))}
    </ul>
  );
};

export default Links;
