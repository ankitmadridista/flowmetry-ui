import { type ReactNode, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../utils/useTheme";

interface BaseNavbarProps {
  navLinks: ReactNode;
  actionButtons: ReactNode;
  mobileMenuContent: ReactNode;
}

// 1. Clean SVG Icons
const SunIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="4"></circle>
    <path d="M12 2v2"></path>
    <path d="M12 20v2"></path>
    <path d="m4.93 4.93 1.41 1.41"></path>
    <path d="m17.66 17.66 1.41 1.41"></path>
    <path d="M2 12h2"></path>
    <path d="M20 12h2"></path>
    <path d="m6.34 17.66-1.41 1.41"></path>
    <path d="m19.07 4.93-1.41 1.41"></path>
  </svg>
);

const MoonIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
  </svg>
);

const MenuIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="4" x2="20" y1="12" y2="12"></line>
    <line x1="4" x2="20" y1="6" y2="6"></line>
    <line x1="4" x2="20" y1="18" y2="18"></line>
  </svg>
);

const XIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6 6 18"></path>
    <path d="m6 6 12 12"></path>
  </svg>
);

export default function BaseNavbar({
  navLinks,
  actionButtons,
  mobileMenuContent,
}: BaseNavbarProps) {
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Close mobile menu on route change
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMenuOpen(false);
  }

  return (
    <nav className="flex items-center justify-between p-6 border-b border-border w-full bg-background relative z-50">
      <div className="flex items-center gap-8">
        <span
          className="text-2xl font-heading font-bold text-heading cursor-pointer tracking-tight"
          onClick={() => navigate("/")}
        >
          Flowmetry
        </span>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6 items-center">{navLinks}</div>
      </div>

      {/* Desktop Actions */}
      <div className="hidden md:flex gap-4 items-center">
        {/* 2. Using the SVG Icons */}
        <button
          onClick={toggle}
          className="p-2 text-foreground hover:text-heading transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>
        {actionButtons}
      </div>

      {/* Mobile Hamburger */}
      <div className="flex md:hidden items-center gap-2">
        <button
          onClick={toggle}
          className="p-2 text-foreground hover:text-heading transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="p-2 text-foreground hover:text-heading transition-colors focus:outline-none"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <XIcon /> : <MenuIcon />}
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
