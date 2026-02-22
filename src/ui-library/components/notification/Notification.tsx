import cn from 'classnames';
import { Icon } from '../ssr/icon/Icon';

export function Notification({ colorType, text, actions, onClose }: { colorType: 'primary' | 'secondary'; text: React.ReactNode; actions?: React.ReactNode; onClose?: () => void }) {
    const classes = cn(
        "flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-[50px] rounded-xl px-4 py-5 md:px-3 md:py-3 text-md border",
        { "bg-[var(--color-primary-700)] text-[var(--color-primary-100)]": colorType === 'primary' },
        { "bg-[var(--color-primary-100)] text-[var(--color-neutral-600)]": colorType === 'secondary' },
    );

    return (
        <div className={classes}>
            <div className='flex flex-row items-start md:ml-3.5'>
                {text}
                {onClose && (
                    <div className='px-2 w-[35px] flex flex-shrink-0 md:hidden'>
                        <Icon icon="close" iconColor={colorType === 'primary' ? '#FFFFFF' : '#A4A7AE'} iconWidth={20} iconHeight={20} onClick={onClose} />
                    </div>
                )}
            </div>
            <div className="flex flex-row items-center w-full md:flex-shrink-0 gap-2 md:w-auto">
                {actions && <div className='flex-grow-1 md:flex-grow-0'>{actions}</div>}
                {onClose && (
                    <div className='px-2 hidden md:flex'>
                        <Icon icon="close" iconColor={colorType === 'primary' ? '#FFFFFF' : '#A4A7AE'} iconWidth={20} iconHeight={20} onClick={onClose} />
                    </div>
                )}
            </div>
        </div>
    );
}