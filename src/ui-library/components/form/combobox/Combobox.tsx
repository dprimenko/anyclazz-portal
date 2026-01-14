import { useState, useMemo, type ReactNode } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Command } from 'cmdk';
import { Icon } from '@/ui-library/components/ssr/icon/Icon';
import { cn } from '@/lib/utils';

export interface ComboboxItem {
    value: string;
    label: string;
    prepend?: ReactNode;
}

export interface ComboboxProps {
    items: ComboboxItem[];
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyMessage?: string;
    fullWidth?: boolean;
    disabled?: boolean;
}

export function Combobox({
    items,
    value,
    onChange,
    placeholder = 'Select an option...',
    searchPlaceholder = 'Search...',
    emptyMessage = 'No results found.',
    fullWidth = false,
    disabled = false
}: ComboboxProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');

    const selectedItem = items.find(item => item.value === value);

    // Filter items based on search
    const filteredItems = useMemo(() => {
        if (!search) return items;
        
        const searchLower = search.toLowerCase();
        return items.filter(item => 
            item.label.toLowerCase().includes(searchLower)
        );
    }, [items, search]);

    const handleSelect = (currentValue: string) => {
        onChange?.(currentValue === value ? '' : currentValue);
        setOpen(false);
        setSearch('');
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            setSearch('');
        }
    };

    return (
        <Popover.Root open={open} onOpenChange={handleOpenChange}>
            <Popover.Trigger asChild>
                <button
                    type="button"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled}
                    className={cn(
                        'flex items-center justify-between px-4 py-2.5 text-left',
                        'border border-[var(--color-neutral-200)] rounded-lg',
                        'bg-white transition-all',
                        'focus:outline focus:outline-2 focus:outline-[var(--color-primary-700)]',
                        open && 'outline outline-2 outline-[var(--color-primary-700)]',
                        disabled && 'opacity-50 cursor-not-allowed',
                        fullWidth ? 'w-full' : 'min-w-[200px]'
                    )}
                >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        {selectedItem?.prepend && (
                            <span className="shrink-0">
                                {selectedItem.prepend}
                            </span>
                        )}
                        <span className={cn(
                            'truncate',
                            selectedItem ? 'text-[var(--color-neutral-900)]' : 'text-[var(--color-neutral-400)]'
                        )}>
                            {selectedItem?.label || placeholder}
                        </span>
                    </div>
                    <Icon 
                        icon="chevron-down" 
                        iconWidth={16} 
                        iconHeight={16}
                        className={cn(
                            'ml-2 shrink-0 transition-transform text-[var(--color-neutral-500)]',
                            open && 'rotate-180'
                        )}
                    />
                </button>
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Content
                    align="start"
                    className={cn(
                        'z-50 bg-white rounded-lg border border-[var(--color-neutral-200)]',
                        'shadow-lg p-0',
                        fullWidth ? 'w-[var(--radix-popover-trigger-width)]' : 'w-[200px]'
                    )}
                    sideOffset={8}
                >
                    <Command className="w-full" shouldFilter={false}>
                        <div className="flex items-center border-b border-[var(--color-neutral-200)] px-3">
                            <Icon 
                                icon="search" 
                                iconWidth={16} 
                                iconHeight={16}
                                className="mr-2 shrink-0 text-[var(--color-neutral-400)]"
                            />
                            <Command.Input
                                placeholder={searchPlaceholder}
                                value={search}
                                onValueChange={setSearch}
                                className={cn(
                                    'flex h-11 w-full bg-transparent py-3 text-sm outline-none',
                                    'placeholder:text-[var(--color-neutral-400)]',
                                    'text-[var(--color-neutral-900)]'
                                )}
                            />
                        </div>
                        <Command.List className="max-h-[300px] overflow-y-auto p-1">
                            {filteredItems.length === 0 ? (
                                <div className="py-6 text-center text-sm text-[var(--color-neutral-400)]">
                                    {emptyMessage}
                                </div>
                            ) : (
                                <Command.Group>
                                    {filteredItems.map((item) => {
                                        const isSelected = item.value === value;
                                        return (
                                            <Command.Item
                                                key={item.value}
                                                value={item.label}
                                                keywords={[item.value]}
                                                onSelect={() => handleSelect(item.value)}
                                                className={cn(
                                                    'relative flex cursor-pointer select-none items-center rounded-md px-3 py-2 text-sm outline-none',
                                                    'transition-colors',
                                                    'data-[selected=true]:bg-[var(--color-neutral-100)]',
                                                    isSelected && 'bg-[var(--color-primary-100)] text-[var(--color-primary-700)] font-medium'
                                                )}
                                            >
                                                {item.prepend && (
                                                    <span className="mr-2 shrink-0">
                                                        {item.prepend}
                                                    </span>
                                                )}
                                                <span>{item.label}</span>
                                            </Command.Item>
                                        );
                                    })}
                                </Command.Group>
                            )}
                        </Command.List>
                    </Command>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}
