import cn from "classnames";

export function TextField({ value, onChange, placeholder, className, type = "text", disabled }: { value?: string; onChange: (value: string) => void; placeholder?: string; className?: string; type?: string; disabled?: boolean }) {
    const classNames = cn(
        "w-full px-4 py-3 rounded-lg border-1 border-[var(--color-neutral-200)] bg-white text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] focus:outline-none focus:border-2 focus:border-[var(--color-primary-700)] transition-colors",
        { "opacity-50 cursor-not-allowed": disabled },
        className
    );

    return (
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={classNames}
        />
    );
}