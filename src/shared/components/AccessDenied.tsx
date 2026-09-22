import { useNavigate } from "react-router-dom";

export default function AccessDenied() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-3 text-center">
      <span className="text-5xl">🔒</span>
      <h2 className="text-heading font-heading font-semibold m-0 text-2xl">
        Access Restricted
      </h2>
      <p className="text-foreground/60 m-0">
        You don't have permission to view this page.
      </p>
      <button
        className="px-4 py-2 mt-2 font-medium bg-accent text-white rounded-md hover:bg-accent/90 transition-colors shadow-theme"
        onClick={() => navigate(-1)}
      >
        Go Back
      </button>
    </div>
  );
}
