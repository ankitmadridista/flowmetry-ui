import { type ReactNode, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../utils/useTheme";

interface NavbarProps {
  navLinks: ReactNode;
  actionButtons: ReactNode;
  mobileMenuContent: ReactNode;
}

const SunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </svg>
);

const MoonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

export default function Navbar({
  navLinks,
  actionButtons,
  mobileMenuContent,
}: NavbarProps) {
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMenuOpen(false);
  }

  return (
    <nav className="flex items-center justify-between p-6 border-b border-border w-full bg-background relative z-50">
      {/* Left side: Brand ONLY */}
      <span
        className="text-2xl font-heading font-bold text-heading cursor-pointer"
        onClick={() => navigate("/")}
      >
        Flowmetry
      </span>

      {/* Right side: EVERYTHING ELSE (Links + Theme + Actions) */}
      <div className="hidden md:flex gap-6 items-center">
        {navLinks}

        {/* Subtle divider line between links and actions */}
        <div className="w-px h-6 bg-border mx-2"></div>

        <button
          onClick={toggle}
          className="p-2 text-foreground hover:text-heading transition-colors rounded-md hover:bg-code"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>

        {actionButtons}
      </div>

      {/* Mobile Hamburger & Theme */}
      <div className="flex md:hidden items-center gap-2">
        <button
          onClick={toggle}
          className="p-2 text-foreground hover:text-heading transition-colors rounded-md"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="p-2 text-foreground hover:text-heading focus:outline-none"
        >
          {menuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-background border-b border-border shadow-theme p-4 flex flex-col gap-4 md:hidden">
          {mobileMenuContent}
        </div>
      )}
    </nav>
  );
}
