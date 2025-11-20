export function Label({ children, className="", ...props }) {
  return (
    <label {...props} className={`text-gray-700 font-medium ${className}`}>
      {children}
    </label>
  );
}
