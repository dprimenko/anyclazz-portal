import cn from 'classnames';
import { Icon } from '../ssr/icon/Icon';

export function Notification({ 
    colorType, 
    text, 
    actions, 
    onClose, 
    closable 
}: { 
    colorType: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'; 
    text: React.ReactNode; 
    actions?: React.ReactNode; 
    onClose?: () => void; 
    closable?: boolean 
}) {
    const classes = cn(
        "flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-[50px] rounded-xl px-4 py-5 md:px-3 md:py-3 text-md border",
        { "bg-[var(--color-primary-700)] text-[var(--color-primary-100)]": colorType === 'primary' },
        { "bg-[var(--color-primary-100)] text-[var(--color-neutral-600)]": colorType === 'secondary' },
        { "bg-green-50 text-green-800 border-green-200": colorType === 'success' },
        { "bg-red-50 text-red-800 border-red-200": colorType === 'error' },
        { "bg-yellow-50 text-yellow-800 border-yellow-200": colorType === 'warning' },
        { "bg-blue-50 text-blue-800 border-blue-200": colorType === 'info' },
    );

    const getIconColor = () => {
        switch (colorType) {
            case 'primary': return '#FFFFFF';
            case 'success': return '#16a34a'; // green-600
            case 'error': return '#dc2626'; // red-600
            case 'warning': return '#ca8a04'; // yellow-600
            case 'info': return '#2563eb'; // blue-600
            default: return '#A4A7AE';
        }
    };

    return (
        <div className={classes}>
            <div className='flex flex-row items-start md:ml-3.5'>
                {text}
                {closable && onClose && (
                    <div className='px-2 w-[35px] flex flex-shrink-0 md:hidden'>
                        <Icon icon="close" iconColor={getIconColor()} iconWidth={20} iconHeight={20} onClick={onClose} />
                    </div>
                )}
            </div>
            <div className="flex flex-row items-center w-full md:flex-shrink-0 gap-2 md:w-auto">
                {actions && <div className='flex-grow-1 md:flex-grow-0'>{actions}</div>}
                {closable && onClose && (
                    <div className='px-2 hidden md:flex'>
                        <Icon icon="close" iconColor={getIconColor()} iconWidth={20} iconHeight={20} onClick={onClose} />
                    </div>
                )}
            </div>
        </div>
    );
}