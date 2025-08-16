import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover"
import { Button } from "../components/ui/button"
import { cn } from "../lib/utils"
import { Calendar } from "../components/ui/calendar"
import 'react-day-picker/dist/style.css';


interface DatePickerTaskProsps {
    dateTask: Date[] | undefined;
    setDateTask: (dateTask: Date[] | undefined) => void;
}
export function DatePickerTask({ dateTask, setDateTask }: DatePickerTaskProsps) {

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !dateTask && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon />
                    {dateTask && dateTask.length > 0
                        ? dateTask.map((date) => format(date, "dd/MM/yyyy")).join(", ")
                        : <span>Escolha a(s) data(s)</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="multiple"
                    selected={dateTask}
                    onSelect={setDateTask}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}