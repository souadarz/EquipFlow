import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    helperText?: string;
}

export function Input({ label, error, helperText, id, ...props }: InputProps) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-1.5">
                {label}
            </label>
            <input
                id={id}
                className={`w-full px-4 py-2.5 rounded-lg border-2 outline-none text-gray-900
          bg-white text-sm transition-all
          ${error
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10'
                    }`}
                {...props}
            />
            {helperText && !error && (
                <p className="text-xs text-textgray mt-1">{helperText}</p>
            )}
            {error && (
                <p className="text-xs text-red-500 mt-1">{error}</p>
            )}
        </div>
    );
}