import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, ...props }, ref) => {
  return (
    <div className="input-wrapper">
      {label && <label className="input-label">{label}</label>}
      <input ref={ref} className="input-field" {...props} />
    </div>
  );
});

Input.displayName = 'Input';

export default Input;