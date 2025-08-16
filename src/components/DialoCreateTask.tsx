
import { TaskCreate } from "../pages/TaskCreate"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"


export interface  DialogPops{
    open: boolean
    onOpenChange: (open: boolean)=> void
}

export function DialogCreateTask({open, onOpenChange}: DialogPops) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form>
        <DialogContent className="bg-gray-800 sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-white">Create Task</DialogTitle>
            <DialogDescription className="text-white"   >
              
            </DialogDescription>
          </DialogHeader>
            <TaskCreate/>
        </DialogContent>
      </form>
    </Dialog>
  )
}
