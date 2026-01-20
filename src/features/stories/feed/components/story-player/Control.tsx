import { Icon } from "@/ui-library/components/ssr/icon/Icon";

export interface ControlProps {
    icon: string;
    size?: number;
    onClick?: () => void;
}

export function Control({ icon, size, onClick }: ControlProps) {
    return (
        <div className="rounded-full backdrop-blur-[16px] bg-white/30 w-12 h-12 grid place-items-center cursor-pointer" onClick={onClick}>
            <Icon icon={icon} iconWidth={size??24} iconHeight={size??24} />
        </div>
    );
}