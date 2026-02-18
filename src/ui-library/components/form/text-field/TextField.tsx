import cn from "classnames";

export function TextField({ value, onChange, placeholder, className }: { value?: string; onChange: (value: string) => void; placeholder?: string; className?: string }) {
    const classNames = cn(
        "w-full px-4 py-3 rounded-lg border-1 border-[var(--color-neutral-300)] bg-white text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] focus:outline-none focus:border-2 focus:border-[var(--color-primary-700)] transition-colors",
        className
    );

    return (
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={classNames}
        />
    );
}