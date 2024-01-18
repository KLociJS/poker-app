import Image from "next/image";
import Link from "next/link";
import logo from "../../../../public/logo.svg";
import Links from "./links/Links";
import Style from "./nav.module.css";

const Nav = () => {
  return (
    <nav className={Style.navbar}>
      <Link href='/' passHref className={Style.logo}>
        <Image src={logo} alt='logo' />
      </Link>
      <Links />
    </nav>
  );
};

export default Nav;
