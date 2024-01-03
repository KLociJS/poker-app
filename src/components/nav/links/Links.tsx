import { routes } from "@/common/constants";
import Link from "next/link";

const Links = () => {
  const links = [
    { href: routes.HOME, label: "Home" },
    { href: routes.LOGIN, label: "Login" },
    { href: routes.SIGNUP, label: "Sign Up" },
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
