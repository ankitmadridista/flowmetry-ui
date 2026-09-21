import { useNavigate } from "react-router-dom";
import { useTheme } from "../../utils/useTheme";

export default function PublicNavbar() {
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();

  // Redirect to login when a public user tries to access an app feature
  const handleFeatureClick = () => {
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between p-6 border-b border-border max-w-7xl mx-auto w-full">
      {/* Left side: Brand */}
      <span
        className="text-2xl font-heading font-bold text-heading cursor-pointer"
        onClick={() => navigate("/")}
      >
        Flowmetry
      </span>

      {/* Right side: Links + Actions */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-6 mr-2">
          <button
            onClick={handleFeatureClick}
            className="font-medium text-foreground hover:text-heading transition-colors"
          >
            Dashboard
          </button>
          <button
            onClick={handleFeatureClick}
            className="font-medium text-foreground hover:text-heading transition-colors"
          >
            Invoices
          </button>
          <button
            onClick={handleFeatureClick}
            className="font-medium text-foreground hover:text-heading transition-colors"
          >
            Customers
          </button>
          <button
            onClick={handleFeatureClick}
            className="font-medium text-foreground hover:text-heading transition-colors"
          >
            Security
          </button>
        </div>

        {/* Theme Toggle & Auth Buttons */}
        <div className="flex items-center gap-4 border-l border-border pl-4 md:pl-6">
          <button
            onClick={toggle}
            className="text-xl px-2 py-1 hover:opacity-80 transition-opacity"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <button
            onClick={() => navigate("/login")}
            className="hidden sm:block px-4 py-2 font-medium text-foreground hover:text-heading transition-colors"
          >
            Log in
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 font-medium bg-accent text-white rounded-md hover:bg-accent/90 transition-colors shadow-theme"
          >
            Sign up
          </button>
        </div>
      </div>
    </nav>
  );
}
