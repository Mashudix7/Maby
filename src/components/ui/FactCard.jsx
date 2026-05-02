import { useState } from 'react';

export default function FactCard({ icon, iconBg, iconColor, label, value = '', placeholder = '', isTextarea = false, onChange, onBlur, readOnly = false }) {
  const [localValue, setLocalValue] = useState(value);

  // Sync with prop when it changes externally
  const displayValue = onChange ? value : localValue;

  function handleChange(e) {
    if (onChange) {
      onChange(e);
    } else {
      setLocalValue(e.target.value);
    }
  }

  function handleBlur(e) {
    if (onBlur) onBlur(e);
  }

  const inputClasses = `glass-input ${readOnly ? 'opacity-70 cursor-default' : ''}`;

  return (
    <div className="bg-white/40 dark:bg-white/5 border border-white/50 dark:border-white/10 rounded-xl p-5 hover:bg-white/60 dark:hover:bg-white/10 transition-colors duration-300">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-8 h-8 rounded-full ${iconBg} flex items-center justify-center ${iconColor}`}>
          <span className="material-symbols-outlined text-[16px]">{icon}</span>
        </div>
        <label className="font-sans text-xs font-semibold tracking-wide uppercase text-on-surface-variant dark:text-zinc-500">
          {label}
        </label>
      </div>
      {isTextarea ? (
        <textarea
          className={`${inputClasses} resize-none h-24`}
          placeholder={placeholder}
          defaultValue={value}
          onChange={handleChange}
          onBlur={handleBlur}
          readOnly={readOnly}
        />
      ) : (
        <input
          type="text"
          className={inputClasses}
          placeholder={placeholder}
          defaultValue={value}
          onChange={handleChange}
          onBlur={handleBlur}
          readOnly={readOnly}
        />
      )}
    </div>
  );
}
