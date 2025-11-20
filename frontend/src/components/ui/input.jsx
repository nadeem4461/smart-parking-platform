export function Input({ className="", ...props }) {
  return (
    <input
      {...props}
      className={`border px-3 py-2 rounded-lg outline-none ${className}`}
    />
  );
}
