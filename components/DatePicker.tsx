"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const DatePicker = () => {
    const [date, setDate] = React.useState<Date>()
  
    // Format the selected date for display
    const formattedDate = date ? format(date, "PPP") : ""
    
  return (
    <div className="flex space-x-2 items-center">
        {/* Date Picker Button */}
        <Popover>
            <PopoverTrigger asChild>
            <Button
                variant={"outline"}
                className={cn(
                "w-[280px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
                )}
            >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formattedDate || <span>Pick a date</span>}
            </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
            <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
            />
            </PopoverContent>
        </Popover>

        {/* ShadCN Input Field for Date Display */}
        <Input
            type="text"
            className="w-[280px]"
            placeholder="Selected date"
            value={formattedDate}
            readOnly
        />
    </div>
  )
}

export default DatePicker
