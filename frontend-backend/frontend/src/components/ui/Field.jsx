export function TextInput({ label, error, required, ...props }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-sage-900">
        {label}
        {required && <span className="text-brand"> *</span>}
      </span>
      <input
        {...props}
        className="w-full rounded-lg border border-sage-200 bg-sage-100/40 px-3 py-2.5 text-sm outline-none transition placeholder:text-ink-500 focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
      />
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

export function TextArea({ label, error, required, ...props }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-sage-900">
        {label}
        {required && <span className="text-brand"> *</span>}
      </span>
      <textarea
        {...props}
        rows={3}
        className="w-full rounded-lg border border-sage-200 bg-sage-100/40 px-3 py-2.5 text-sm outline-none transition placeholder:text-ink-500 focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
      />
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}
