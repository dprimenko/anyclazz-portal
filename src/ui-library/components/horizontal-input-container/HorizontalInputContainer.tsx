import { Text } from "@/ui-library/components/ssr/text/Text";

export function HorizontalInputContainer({ label, description, required, children }: { label: string; description?: string, required?: boolean, children: React.ReactNode }) {
    return (
        <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-col gap-1 w-[312px]">
                <Text textLevel="h3" weight="semibold" colorType="primary">
                    {label} {required && <span className="text-[var(--color-primary-700)]">*</span>}
                </Text>
                <Text textLevel="p" size="text-sm" colorType="tertiary">
                    {description}
                </Text>
            </div>
            <div className="flex flex-col gap-3 bg-white rounded-lg md:flex-grow-[1]">
                {children}
            </div>
        </div>
    );
}