// components/ui/wilayahselect.tsx
import { ChevronDown } from "lucide-react";

interface WilayahItem {
  code: string;
  name: string;
}

interface WilayahSelectProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: WilayahItem[];
  loading: boolean;
  disabled: boolean;
  placeholder: string;
}

export default function WilayahSelect({
  label,
  value,
  onChange,
  options,
  loading,
  disabled,
  placeholder,
}: WilayahSelectProps) {
  const selectId = `select-${label.toLowerCase().replace(" ", "-")}`;

  return (
    <div>
      <label
        htmlFor={selectId}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label} <span className="text-red-600">*</span>
      </label>
      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={onChange}
          disabled={disabled || loading}
          className="w-full px-4 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        >
          <option value="">{loading ? "Memuat..." : placeholder}</option>
          {options.map((item) => (
            <option key={item.code} value={item.code}>
              {item.name}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-6 h-6 rounded-full border-2 border-red-600 flex items-center justify-center">
            <ChevronDown className="w-4 h-4 text-red-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
