const variants = {
  primary: "bg-sage-900 text-white shadow-sm hover:bg-sage-700 disabled:opacity-50",
  brand: "bg-brand text-white shadow-sm hover:bg-brand-dark disabled:opacity-50",
  ghost: "border border-sage-200 bg-transparent text-sage-900 hover:bg-sage-100",
};

export function Button({ variant = "primary", className = "", ...props }) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition duration-200 ${variants[variant]} ${className}`}
    />
  );
}
