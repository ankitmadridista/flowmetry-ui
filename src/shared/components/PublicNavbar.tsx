import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export default function PublicNavbar() {
  const navigate = useNavigate();

  const handleFeatureClick = () => navigate("/login");

  const links = (
    <>
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
    </>
  );

  const actions = (
    <>
      <button
        onClick={() => navigate("/login")}
        className="px-4 py-2 font-medium text-foreground hover:text-heading transition-colors"
      >
        Log in
      </button>
      <button
        onClick={() => navigate("/login")}
        className="px-4 py-2 font-medium bg-accent text-white rounded-md hover:bg-accent/90 transition-colors shadow-theme"
      >
        Sign up
      </button>
    </>
  );

  const mobileContent = (
    <>
      {links}
      <hr className="border-border my-2" />
      {actions}
    </>
  );

  return (
    <Navbar
      navLinks={links}
      actionButtons={actions}
      mobileMenuContent={mobileContent}
    />
  );
}
