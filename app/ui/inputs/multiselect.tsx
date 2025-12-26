'use client'

import { forwardRef, useState } from "react";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { CheckIcon } from "lucide-react"
import { ChevronDownIcon } from "lucide-react"
import { SelectMetadata } from "@/lib/interface"

interface ComboboxProps {
  disabled?: boolean;
  isError?: boolean;
  placeholder: string;
  label: string;
  value?: string | string[]; 
  onChange: (val:string[]) => void;
  options?: SelectMetadata[] | null;
  className?: string
}

const ComboBoxMultiSelect = forwardRef<HTMLButtonElement, ComboboxProps>((
  { disabled = false, isError = false, placeholder, label, value, onChange, options, className }, ref
) => {

    const [open, setOpen] = useState<boolean>(false);

    const selectedValues: string[] = Array.isArray(value) ? value : []
 
    const toggleValue = (key: string) => {
        let newValues: string[];
        if (selectedValues.includes(key)) {
            newValues = selectedValues.filter(v => v !== key);
        } else {
            newValues = [...selectedValues, key];
        }
        onChange(newValues); // returns string[]
    };

    const displayValue = selectedValues?.length > 0 ? `${selectedValues.length} ${label}(s) selected` : undefined
    
    return <Popover modal open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
            <Button
            ref={ref}
            variant="outline"
            role="combobox"
            disabled={disabled}
            title={displayValue || placeholder}
            className={cn(
                "w-full flex items-center px-3",
                !displayValue && "text-muted-foreground",
                isError ? "border-red-500" : "border-gray-300",
                className
            )}
            >
            <span className="flex-1 truncate text-left">
                {displayValue || placeholder}
            </span>
            <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-50 p-0">
            <Command>
            <CommandInput
                placeholder={`Search ${label}...`}
                className="h-9"
            />
            <CommandList>
                <CommandEmpty>Not found.</CommandEmpty>
                <CommandGroup>
                <CommandItem
                    key="clear"
                    onSelect={() => onChange([])}
                    className="text-red-500"
                >
                    Clear selection
                </CommandItem>
                {(options ?? []).map((val) => (
                    <CommandItem
                    value={val.value}
                    key={val.key}
                    onSelect={() => toggleValue(val.key)}
                    >
                    {val.value}
                    <CheckIcon
                        className={cn(
                        "ml-auto h-4 w-4",
                        selectedValues.includes(val.key)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                    />
                    </CommandItem>
                ))}
                </CommandGroup>
            </CommandList>
            </Command>
        </PopoverContent>
    </Popover>
    
})

ComboBoxMultiSelect.displayName = "ComboBoxMultiSelect"

export default ComboBoxMultiSelect;
