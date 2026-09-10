const variants = {
  primary: "bg-ink-900 text-white hover:bg-black disabled:opacity-50",
  brand: "bg-brand text-white hover:bg-brand-dark disabled:opacity-50",
  ghost: "bg-transparent text-ink-900 border border-ink-200 hover:bg-ink-100",
};

export function Button({ variant = "primary", className = "", ...props }) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition ${variants[variant]} ${className}`}
    />
  );
}
