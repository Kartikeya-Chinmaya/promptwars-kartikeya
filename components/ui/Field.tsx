import { ReactNode, cloneElement, isValidElement, useId } from "react";

export function Field({
  label,
  hint,
  children,
  grouped = false,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  /** Set for a group of independent controls (e.g. toggle chips) that isn't
   * a single input a <label htmlFor> can point at — renders as a
   * <fieldset>/<legend> instead, the correct native pattern for that case. */
  grouped?: boolean;
}) {
  const id = useId();

  if (grouped) {
    return (
      <fieldset className="mb-6 border-0 p-0 m-0">
        <legend className="text-meta block font-mono font-semibold uppercase text-foreground mb-1.5 px-0">
          {label}
        </legend>
        {hint && <p className="text-xs text-muted mb-2">{hint}</p>}
        {children}
      </fieldset>
    );
  }

  const child = isValidElement(children)
    ? cloneElement(children as React.ReactElement<{ id?: string }>, { id })
    : children;

  return (
    <div className="mb-6">
      <label
        htmlFor={id}
        className="text-meta block font-mono font-semibold uppercase text-foreground mb-1.5"
      >
        {label}
      </label>
      {hint && <p className="text-xs text-muted mb-2">{hint}</p>}
      {child}
    </div>
  );
}

const inputBase =
  "w-full rounded-none border border-surface-border bg-surface px-3.5 py-2.5 font-mono text-sm text-foreground placeholder:text-muted-2 focus:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 transition-colors duration-150";

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputBase} ${props.className ?? ""}`} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputBase} ${props.className ?? ""}`} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${inputBase} ${props.className ?? ""}`} />;
}
