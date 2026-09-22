import { useState } from "react";
import { createCustomer } from "../api/customers.api";

interface Props {
  onClose: () => void;
  onCreated: (id: string) => void;
}

export default function CreateCustomerModal({
  onClose,
  onCreated,
}: Props): React.JSX.Element {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !email.trim()) {
      setError("Name and email are required.");
      return;
    }
    setSubmitting(true);
    try {
      const id = await createCustomer(name.trim(), email.trim());
      onCreated(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  // Reusable classes (matches our other modals)
  const fieldWrapperClass = "flex flex-col gap-1.5 mb-4";
  const labelClass =
    "text-xs font-semibold uppercase tracking-wider text-foreground/70";
  const inputClass =
    "h-[38px] px-3 border border-border rounded-md bg-background text-heading text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent-bg w-full";

  const btnSecondaryClass =
    "h-[38px] px-4 bg-background text-heading border border-border rounded-md text-sm font-medium cursor-pointer transition-colors hover:border-accent w-full sm:w-auto";
  const btnPrimaryClass =
    "h-[38px] px-5 bg-accent text-white border-none rounded-md text-sm font-semibold cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap w-full sm:w-auto shadow-theme";

  return (
    <div
      className="fixed inset-0 bg-black/45 flex items-end sm:items-center justify-center z-100 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-background border border-border sm:border-border border-t-border border-x-transparent border-b-transparent rounded-t-2xl sm:rounded-xl p-6 sm:p-7 w-full max-w-110 shadow-theme max-h-[85vh] sm:max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-heading font-semibold text-heading m-0 mb-5">
          New Customer
        </h2>

        <form onSubmit={handleSubmit}>
          <div className={fieldWrapperClass}>
            <label htmlFor="cc-name" className={labelClass}>
              Name
            </label>
            <input
              id="cc-name"
              type="text"
              placeholder="Full name or company"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              autoFocus
            />
          </div>

          <div className={fieldWrapperClass}>
            <label htmlFor="cc-email" className={labelClass}>
              Email
            </label>
            <input
              id="cc-email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>

          {error && (
            <p className="text-[13px] text-red-700 dark:text-red-400 mb-3 font-medium">
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end mt-5">
            <button
              type="button"
              className={btnSecondaryClass}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={btnPrimaryClass}
              disabled={submitting}
            >
              {submitting ? "Creating…" : "Create Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
