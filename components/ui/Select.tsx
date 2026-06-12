'use client';

import * as RadixSelect from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';

export interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps {
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
    placeholder?: string;
    /** Overrides the default trigger styling (so existing field classes keep working). */
    className?: string;
    disabled?: boolean;
    required?: boolean;
    name?: string;
    'aria-label'?: string;
}

const defaultTrigger =
    'w-full px-4 py-3 bg-gray-50 dark:bg-ink-800 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-accent text-gray-900 dark:text-white';

export default function Select({
    value,
    onChange,
    options,
    placeholder = 'Select…',
    className,
    disabled,
    required,
    name,
    ...rest
}: SelectProps) {
    return (
        <RadixSelect.Root value={value || undefined} onValueChange={onChange} disabled={disabled} required={required} name={name}>
            <RadixSelect.Trigger
                aria-label={rest['aria-label']}
                className={`group flex items-center justify-between gap-2 text-left data-[placeholder]:text-gray-400 disabled:opacity-60 ${className ?? defaultTrigger}`}
            >
                <RadixSelect.Value placeholder={placeholder} />
                <RadixSelect.Icon asChild>
                    <ChevronDown className="w-4 h-4 text-gray-400 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </RadixSelect.Icon>
            </RadixSelect.Trigger>

            <RadixSelect.Portal>
                <RadixSelect.Content
                    position="popper"
                    sideOffset={8}
                    className="z-[60] min-w-[var(--radix-select-trigger-width)] max-h-[var(--radix-select-content-available-height)] overflow-hidden rounded-[6px] border border-primary/10 dark:border-slate-700 bg-white dark:bg-ink-900 shadow-2xl shadow-black/10 dark:shadow-black/40 origin-top data-[state=open]:animate-scale-in"
                >
                    <RadixSelect.ScrollUpButton className="flex items-center justify-center h-7 text-gray-400">
                        <ChevronUp className="w-4 h-4" />
                    </RadixSelect.ScrollUpButton>

                    <RadixSelect.Viewport className="p-1.5">
                        {options.map((opt) => (
                            <RadixSelect.Item
                                key={opt.value}
                                value={opt.value}
                                className="relative flex items-center gap-2 select-none cursor-pointer rounded-[5px] py-2.5 pl-9 pr-3 text-sm font-medium text-primary dark:text-white outline-none data-[highlighted]:bg-accent/10 data-[highlighted]:text-accent data-[state=checked]:font-bold transition-colors"
                            >
                                <RadixSelect.ItemIndicator className="absolute left-3 inline-flex items-center">
                                    <Check className="w-4 h-4 text-accent" />
                                </RadixSelect.ItemIndicator>
                                <RadixSelect.ItemText>{opt.label}</RadixSelect.ItemText>
                            </RadixSelect.Item>
                        ))}
                    </RadixSelect.Viewport>

                    <RadixSelect.ScrollDownButton className="flex items-center justify-center h-7 text-gray-400">
                        <ChevronDown className="w-4 h-4" />
                    </RadixSelect.ScrollDownButton>
                </RadixSelect.Content>
            </RadixSelect.Portal>
        </RadixSelect.Root>
    );
}
