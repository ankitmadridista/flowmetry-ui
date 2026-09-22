import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Props {
  id?: string;
  value: string; // YYYY-MM-DD or ''
  onChange: (value: string) => void;
  placeholder?: string;
  minDate?: Date;
  ariaLabel?: string;
}

function toDate(s: string): Date | null {
  if (!s) return null;
  const d = new Date(s + "T00:00:00");
  return isNaN(d.getTime()) ? null : d;
}

function toStr(d: Date | null): string {
  if (!d) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function DatePicker({
  id,
  value,
  onChange,
  placeholder,
  minDate,
  ariaLabel,
}: Props): React.JSX.Element {
  // Input styles (formerly .datepicker-input)
  const inputClass =
    "h-[38px] w-full px-3 border border-border rounded-md bg-background text-heading text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent-bg box-border";

  // Override react-datepicker defaults using Tailwind arbitrary children selectors
  const calendarWrapperClass = `
    !font-sans !text-[13px] !border !border-border !rounded-xl !bg-background !shadow-theme overflow-hidden
    [&_.react-datepicker__header]:!bg-code [&_.react-datepicker__header]:!border-b [&_.react-datepicker__header]:!border-border [&_.react-datepicker__header]:!pt-2.5 [&_.react-datepicker__header]:!pb-2
    [&_.react-datepicker__current-month]:!text-heading [&_.react-datepicker__day-name]:!text-heading
    [&_.react-datepicker__day]:!text-heading [&_.react-datepicker__day]:!rounded-md
    hover:[&_.react-datepicker__day]:!bg-accent-bg hover:[&_.react-datepicker__day]:!text-accent
    [&_.react-datepicker__day--selected]:!bg-accent [&_.react-datepicker__day--selected]:!text-white
    [&_.react-datepicker__day--keyboard-selected]:!bg-accent [&_.react-datepicker__day--keyboard-selected]:!text-white
    [&_.react-datepicker__day--outside-month]:!opacity-35
    [&_.react-datepicker__navigation-icon::before]:!border-foreground
  `
    .replace(/\s+/g, " ")
    .trim();

  return (
    <ReactDatePicker
      id={id}
      selected={toDate(value)}
      onChange={(d: Date | null) => onChange(toStr(d))}
      dateFormat="dd/MM/yyyy"
      placeholderText={placeholder ?? "DD/MM/YYYY"}
      minDate={minDate}
      autoComplete="off"
      aria-label={ariaLabel}
      className={inputClass}
      calendarClassName={calendarWrapperClass}
      popperClassName="z-[200]"
      showPopperArrow={false}
    />
  );
}
