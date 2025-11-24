import React from 'react';

interface DataRowProps {
  label: string;
  value: string | number | undefined | null;
  Icon: React.ElementType;
  isEditing: boolean;
  type?: 'text' | 'number' | 'textarea' | 'select';
  onChange?: (key: string, value: string | number) => void;
  dataKey: string;
  unit?: string;
  options?: string[]; 
}

export const DataRow: React.FC<DataRowProps> = ({
  label,
  value,
  Icon,
  isEditing,
  type = 'text',
  onChange,
  dataKey,
  unit,
  options,
}) => {
  const displayValue =
    value !== undefined && value !== null && value !== '' ? value : '-';
  const displayUnit = unit ? ` ${unit}` : '';

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    let newValue: string | number = e.target.value;

    if (type === 'number') {
      newValue = parseFloat(newValue.replace(/[^0-9.]/g, '')) || 0;
    }

    onChange?.(dataKey, newValue);
  };

  if (isEditing && type === 'select') {
    return (
      <div className="flex items-start space-x-2 w-full">
        <Icon className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 font-medium mb-1">{label}</p>

          <div className="flex items-center space-x-2">
            <select
              className="w-full p-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-800 focus:ring-rose-500 focus:border-rose-500 transition"
              value={value || ''}
              onChange={handleChange}
            >
              <option value="" disabled>
                Pilih {label}
              </option>
              {options?.map((opt) => (
                <option key={opt} value={opt}>
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    );
  }

  const InputTag = type === 'textarea' ? 'textarea' : 'input';
  const inputType = type === 'number' ? 'text' : type;

  const inputValue =
    type === 'number' && typeof value === 'number'
      ? new Intl.NumberFormat('id-ID').format(value)
      : displayValue;

  return (
    <div className="flex items-start space-x-2 w-full">
      <Icon className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 font-medium mb-1">{label}</p>

        {isEditing ? (
          <div className="flex items-center space-x-2">
            <InputTag
              type={inputType}
              value={inputValue}
              onChange={handleChange}
              className={`w-full p-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-800 focus:ring-rose-500 focus:border-rose-500 transition ${
                type === 'textarea' ? 'min-h-[80px]' : ''
              }`}
              onFocus={(
                e:
                  | React.FocusEvent<HTMLInputElement>
                  | React.FocusEvent<HTMLTextAreaElement>
              ) => {
                if (type === 'number') {
                  const target = e.target as HTMLInputElement;
                  target.value = String(value || 0);
                }
              }}
              onBlur={(
                e:
                  | React.FocusEvent<HTMLInputElement>
                  | React.FocusEvent<HTMLTextAreaElement>
              ) => {
                if (type === 'number') {
                  const target = e.target as HTMLInputElement;
                  const raw = parseFloat(
                    target.value.replace(/[^0-9.]/g, '')
                  ) || 0;

                  target.value = new Intl.NumberFormat('id-ID').format(raw);
                  onChange?.(dataKey, raw);
                }
              }}
            />
            {unit && (
              <span className="text-sm text-gray-500 flex-shrink-0">
                {unit}
              </span>
            )}
          </div>
        ) : (
          <p className="text-sm font-semibold text-gray-800 break-words whitespace-normal leading-relaxed">
            {displayValue}
            {displayUnit}
          </p>
        )}
      </div>
    </div>
  );
};