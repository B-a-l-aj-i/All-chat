import { Link } from "@tanstack/react-router";

const NAV_LINKS = [
  { label: "Product", href: "#product" },
  { label: "Solution", href: "#solution" },
  { label: "Support", href: "#support" },
  { label: "My Rooms", href: "#myRooms" },
] as const;

export default function Header() {
  return (
    <header className="w-full">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5">
          <span className="size-6 rounded-full bg-foreground" aria-hidden />
          <span className="text-xl font-bold tracking-tight text-foreground">All Chat</span>
        </Link>

        {/* Primary nav */}
        <nav className="hidden items-center gap-9 md:flex">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-[16px] font-medium text-foreground/80 transition-colors hover:text-foreground hover:bg-gray-50 p-2 rounded-2xl"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Account actions */}
        <div className="text-[16px] flex items-center gap-5">
          <a
            href="#login"
            className="hidden text-sm font-medium text-foreground/80 transition-colors hover:text-foreground sm:inline"
          >
            Log In
          </a>
          <a
            href="#signup"
            className="inline-flex h-10 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Sign Up
          </a>
        </div>
      </div>
    </header>
  );
}
