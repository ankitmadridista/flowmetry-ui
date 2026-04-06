import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './datepicker.css';

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
  const d = new Date(s + 'T00:00:00');
  return isNaN(d.getTime()) ? null : d;
}

function toStr(d: Date | null): string {
  if (!d) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function DatePicker({ id, value, onChange, placeholder, minDate, ariaLabel }: Props): React.JSX.Element {
  return (
    <ReactDatePicker
      id={id}
      selected={toDate(value)}
      onChange={(d: Date | null) => onChange(toStr(d))}
      dateFormat="dd/MM/yyyy"
      placeholderText={placeholder ?? 'DD/MM/YYYY'}
      minDate={minDate}
      autoComplete="off"
      aria-label={ariaLabel}
      className="datepicker-input"
      calendarClassName="datepicker-calendar"
      showPopperArrow={false}
    />
  );
}
