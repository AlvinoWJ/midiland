import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export interface WilayahItem {
  code: string;
  name: string;
}

export interface WilayahSelectorProps {
  label: string;
  placeholder: string;
  options: WilayahItem[];
  selectedValue: string | null;
  onSelect: React.Dispatch<React.SetStateAction<string | null>>;
  isLoading: boolean;
  disabled: boolean;
  maxHeight?: string;
}

export default function WilayahSelect({
  label,
  placeholder,
  options,
  selectedValue,
  onSelect,
  isLoading,
  disabled,
  maxHeight = "12rem",
}: WilayahSelectorProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Tutup dropdown ketika klik di luar komponen
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-md font-medium text-gray-700 mb-2">
        {label} <span className="text-red-600">*</span>
      </label>

      {/* Tombol trigger dropdown */}
      <button
        type="button"
        onClick={() => !disabled && setOpen(!open)}
        className={`w-full px-4 py-2 border border-gray-300 rounded-md text-left flex justify-between items-center ${
          disabled
            ? "bg-gray-100 cursor-not-allowed"
            : "focus:ring-2 focus:ring-red-500"
        }`}
      >
        <span>
          {isLoading
            ? "Memuat..."
            : selectedValue
            ? options.find((o) => o.code === selectedValue)?.name
            : placeholder}
        </span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>

      {/* Dropdown menu */}
      {open && !isLoading && (
        <ul
          className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg overflow-y-auto"
          style={{ maxHeight }}
        >
          {options.map((item) => (
            <li
              key={item.code}
              className={`px-4 py-2 hover:bg-red-100 cursor-pointer ${
                selectedValue === item.code ? "bg-red-50" : ""
              }`}
              onClick={() => {
                onSelect(item.code);
                setOpen(false);
              }}
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
