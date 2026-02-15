import cn from "classnames";

export function Textarea({ value, onChange, placeholder, rows, className }: { value?: string; onChange: (value: string) => void; placeholder?: string; rows?: number; className?: string }) {
    const classNames = cn(
        "w-full px-4 py-3 rounded-lg border-2 border-[var(--color-neutral-300)] bg-white text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] focus:outline-none focus:border-[var(--color-primary-700)] transition-colors resize-none",
        className
    );

    return (
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className={classNames}
        />
    );
}