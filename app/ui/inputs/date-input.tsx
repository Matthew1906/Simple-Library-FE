"use client";

import { CalendarIcon } from "lucide-react";
import { eachMonthOfInterval, endOfYear, format, startOfYear } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { forwardRef, useMemo, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DateInputProps {
  date?: Date;
  setDate: (_date?: Date) => void;
  disabled?: boolean;
  possibleFutureYears?:number;
  isError?: boolean;
}

const DateInput = forwardRef<HTMLButtonElement, DateInputProps>((
  { date, setDate, disabled = false, possibleFutureYears, isError = false }, ref
) => {

  const [ month, setMonth ] = useState<number>(date ? date.getMonth() : new Date().getMonth())
  const [ year, setYear ] = useState<number>(date ? date.getFullYear() : new Date().getFullYear())

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear() + (possibleFutureYears??0)
    return Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i)
  }, [ possibleFutureYears ])

  const months = useMemo(() => {
    if (year) {
      return eachMonthOfInterval({
        start: startOfYear(new Date(year, 0, 1)),
        end: endOfYear(new Date(year, 0, 1))
      })
    }
    return []
  }, [year])

  const handleYearChange = (selectedYear: string) => {
    const newYear = Number.parseInt(selectedYear, 10)
    setYear(newYear)
    if (date) {
      const newDate = new Date(date)
      newDate.setFullYear(newYear)
      setDate(newDate)
    }
  }

  const handleMonthChange = (selectedMonth: string) => {
    const newMonth = Number.parseInt(selectedMonth, 10)
    setMonth(newMonth)
    if (date) {
      const newDate = new Date(date)
      newDate.setMonth(newMonth)
      setDate(newDate)
    } else {
      setDate(new Date(year, newMonth, 1))
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          variant={"outline"}
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            isError? "border-red-500" : "border-gray-300"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP", { locale: id }) : <span>Pilih tanggal</span>}
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
                <SelectItem key={m.getMonth()} value={index.toString()}>
                  {format(m, "MMMM", { locale: id })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          month={new Date(year, month)}
          onMonthChange={(newMonth) => {
            setMonth(newMonth.getMonth())
            setYear(newMonth.getFullYear())
          }}
        />
      </PopoverContent>
    </Popover>
  )
});

DateInput.displayName = 'DateInput';

export default DateInput;
