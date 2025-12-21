'use client'

import { forwardRef } from "react";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { CheckIcon, ChevronDownIcon } from "lucide-react"
import { SelectMetadata } from "@/lib/interface"

interface ComboboxProps {
  disabled?: boolean;
  isError?: boolean;
  placeholder: string;
  label: string;
  value?: string;
  onChange: (val?: string) => void;
  options?: SelectMetadata[] | null;
  className?: string;
}

const ComboBoxSelect = forwardRef<HTMLButtonElement, ComboboxProps>((
  { disabled = false, isError=false, placeholder, label, value, onChange, options, className }, ref
) => {
  
  return <Popover modal>
        <PopoverTrigger asChild>
            <Button
                ref={ref}
                variant="outline"
                disabled={disabled}
                title={value ? (options ?? []).find((val) => val.key === value)?.value : placeholder}
                className={cn(
                    "w-full flex items-center px-3",
                    !value && "text-muted-foreground",
                    isError? "border-red-500" : "border-input",
                  className
                  )}
              >
                <span className="flex-1 truncate text-left">
                  {value ? (options ?? []).find((val) => val.key === value)?.value : placeholder}
                </span>
                <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-50 p-0">
            <Command>
                <CommandInput
                    placeholder={`Find ${label}...`}
                    className="h-9"
                />
                <Button variant="ghost" type="button" onClick={() => onChange(undefined)} className="justify-start px-2 mx-1 mt-1 text-red-500 data-[selected=true]:text-red-700">
                Reset filter
                </Button>
                <CommandList className="max-h-60 overflow-y-auto" >
                    <CommandEmpty>Not found!</CommandEmpty>
                    <CommandGroup>
                    {(options ?? []).map((val) => (
                        <CommandItem value={val.value} key={val.key} onSelect={() => onChange(val.key)}>
                            {val.value}
                            <CheckIcon className={cn("ml-auto h-4 w-4", val.key === value ? "opacity-100" : "opacity-0")}/>
                        </CommandItem>
                    ))}
                    </CommandGroup>
                </CommandList>
            </Command>
      </PopoverContent>
    </Popover>
})

ComboBoxSelect.displayName = "ComboBoxSelect"

export default ComboBoxSelect;