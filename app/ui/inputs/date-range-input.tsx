"use client";

import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { forwardRef } from "react";

interface DateRangeInputProps {
  date?: DateRange;
  className?: React.HTMLAttributes<HTMLDivElement>;
  setDate: (_dates?: DateRange)=>void
}

const DateRangeInput = forwardRef<HTMLButtonElement, DateRangeInputProps>(({
  className,
  date,
  setDate
}, ref) => {

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            id="date"
            variant="default"
            className={cn(
              "w-full justify-start text-left",
              date ? "text-foreground" : "text-muted-foreground",
              "border border-input",
              "bg-white hover:bg-gray-300",
              className
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(val)=>{
                setDate(val)
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
});

DateRangeInput.displayName = 'DateRangeInput'

export default DateRangeInput;

