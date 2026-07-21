import { Link } from "@tanstack/react-router";

import { Logo } from "./logo";
import { Button } from "@all-chat/ui/components/button";

const NAV_LINKS = [
  { label: "Product", href: "#product" },
  { label: "Solution", href: "#solution" },
  { label: "Support", href: "#support" },
  { label: "My Rooms", href: "my-rooms" },
] as const;

export default function Header() {
  return (
    <header className="w-full">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5">
          <Logo className="size-7 text-foreground" />
          <span className="text-xl  tracking-tight text-foreground">
            all chat
          </span>
        </Link>

        {/* Primary nav */}
        <nav className="hidden items-center gap-9 md:flex">
          {NAV_LINKS.map(({ label, href }) => (
            <a key={label} href={href}>
              <Button className="rounded-2xl cursor-pointer" variant="ghost">
                {label}
              </Button>
            </a>
          ))}
        </nav>

        {/* Account actions */}
        <div className="text-[14px] flex items-center gap-2">
          <a href="#login">
            <Button variant="default" className="rounded-2xl cursor-pointer">
              Log In
            </Button>
          </a>
          <a href="#signup">
            <Button variant="ghost" className="rounded-2xl cursor-pointer">
              Sign Up
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
}
