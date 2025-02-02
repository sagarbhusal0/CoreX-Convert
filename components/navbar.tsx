import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import { BsGithub } from "react-icons/bs";
import { ModeToggle } from "./mode-toggle";

export default function Navbar({}): any {
  return (
    <nav className="fixed z-50 flex items-center justify-between w-full h-24 px-4 py-10 backdrop-blur-md bg-background bg-opacity-30 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
      <Link href="/">
        <Image
          alt="logo"
          className="mb-2 cursor-pointer w-35 dark:invert"
          src="/images/logo.png"
          height={100}
          width={170}
        />
      </Link>
      <div className="items-center hidden gap-2 md:flex">
        <ModeToggle />
       
        
      </div>
      <div className="block p-3 md:hidden ">
        <ModeToggle />
      </div>
    </nav>
  );
}
