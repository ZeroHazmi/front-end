"use client"

import * as React from "react"
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { format, setYear, setMonth } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function BirthdatePicker() {
  const [date, setDate] = React.useState<Date>()
  const [year, setYear] = React.useState(new Date().getFullYear())
  const [month, setMonth] = React.useState(new Date().getMonth())

  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i)
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const handleYearChange = (value: string) => {
    const newYear = parseInt(value)
    setYear(newYear)
    if (date) {
      setDate(setYear(date, newYear))
    }
  }

  const handleMonthChange = (value: string) => {
    const newMonth = months.indexOf(value)
    setMonth(newMonth)
    if (date) {
      setDate(setMonth(date, newMonth))
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex items-center justify-between space-x-2 p-3">
          <Select value={year.toString()} onValueChange={handleYearChange}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={months[month]} onValueChange={handleMonthChange}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
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
          className="rounded-md border"
          components={{
            Caption: ({ date }) => (
              <div className="flex items-center justify-center pt-1">
                <Button
                  variant="outline"
                  className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                  onClick={() => setMonth((prev) => (prev - 1 + 12) % 12)}
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <div className="text-sm font-medium">
                  {format(date, "MMMM")}
                </div>
                <Button
                  variant="outline"
                  className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                  onClick={() => setMonth((prev) => (prev + 1) % 12)}
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </div>
            ),
          }}
        />
      </PopoverContent>
    </Popover>
  )
}