"use client";

import { CalendarIcon } from "lucide-react";
import { eachMonthOfInterval, endOfYear, format, startOfYear } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { forwardRef, useMemo, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";

interface DateInputProps {
  date?: Date;
  setDate: (_date?: Date) => void;
  disabled?: boolean;
  possibleFutureYears?: number;
  className?: string;
}

/**
 * Date input component
 *
 * @component
 * @example
 * // Usage example:
 *  <DateInput date={startDateValue} setDate={setStartDateValue} />
 *
 * @param {Date} props.date - date that will be inputted
 * @param {void} props.setDate - function to set the date

 * @returns {JSX.Element} The rendered DateInput component.
 * */
const DateInput = forwardRef<HTMLButtonElement, DateInputProps>((
  { date, setDate, disabled = false, possibleFutureYears, className }, ref
) => {
  const currentYear = new Date().getFullYear();
  const [open, setOpen] = useState<boolean>(false);
  const [month, setMonth] = useState<number>(date ? date.getMonth() : new Date().getMonth())
  const [year, setYear] = useState<number>(date ? date.getFullYear() : currentYear)

  const years = useMemo(() => {
    const maxYear = new Date().getFullYear() + (possibleFutureYears??0);
    return Array.from({ length: maxYear - 1900 + 1 }, (_, i) => maxYear - i)
  }, [ possibleFutureYears ])

  const months = useMemo(() => {
    if (year) {
      return eachMonthOfInterval({
        start: startOfYear(new Date(year, 0, 1)),
        end: endOfYear(new Date(year, 0, 1))
      })
    }
    return []
  }, [ year ])

  const handleYearChange = (selectedYear: string) => {
    const newYear = parseInt(selectedYear, 10)
    setYear(newYear)
    if (date) {
      const newDate = new Date(date)
      newDate.setFullYear(newYear)
      setDate(newDate)
    }
  }

  const handleMonthChange = (selectedMonth: string) => {
    const newMonth = parseInt(selectedMonth, 10)
    setMonth(newMonth)
    if (date) {
      const newDate = new Date(date)
      newDate.setMonth(newMonth)
      setDate(newDate)
    } else {
      setDate(new Date(year, newMonth, 1))
    }
  }

  const handleClearDate = () => {
    setDate(undefined);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          variant="default"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left",
            date ? "text-foreground" : "text-muted-foreground",
            "border border-gray-300",
            "bg-white hover:bg-gray-300",
            className
          )}
          onClick={() => setOpen(!open)}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "d MMM yyyy") : "Pick a date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex justify-between p-2 space-x-1">
          <Select onValueChange={handleYearChange} value={year.toString()}>
            <SelectTrigger className="w-30">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={handleMonthChange} value={month.toString()}>
            <SelectTrigger className="w-30">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((m, index) => (
                <SelectItem key={index} value={m.getMonth().toString()}>
                  {format(m, "MMMM")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={(val) => {
            if (!val) {
              handleClearDate();
              return;
            }
            setDate(val);
            setOpen(false);
          }}
          month={new Date(year, month)}
          onMonthChange={(newMonth) => {
            setMonth(newMonth.getMonth());
            setYear(newMonth.getFullYear());
          }}
        />

        {date && (
          <div className="p-2 border-t">
            <Button
              size="sm"
              className="w-full"
              onClick={handleClearDate}
            >
              <X className="mr-2 h-4 w-4" />
              Clear Date
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
});

DateInput.displayName = "DateInput"

export default DateInput;
