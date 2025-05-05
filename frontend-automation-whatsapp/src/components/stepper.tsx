import { Check, CircleDashed } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
  id: number
  title: string
  description: string
}

interface StepperProps {
  steps: Step[]
  currentStep: number
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between">
      {steps.map((step, index) => (
        <div
          key={step.id}
          className={cn(
            "flex items-center gap-3 mb-4 sm:mb-0 sm:flex-col sm:items-center sm:flex-1",
            index < steps.length - 1 &&
              "sm:after:content-[''] sm:after:w-full sm:after:h-[1px] sm:after:bg-gray-200 sm:after:relative sm:after:top-[-12px] sm:after:left-[50%]",
            index <= currentStep && index < steps.length - 1 && "sm:after:bg-primary sm:after:h-[2px]",
          )}
        >
          <div
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full border-2 border-gray-200 text-gray-400",
              index < currentStep && "bg-primary border-primary text-white",
              index === currentStep && "border-primary text-primary",
            )}
          >
            {index < currentStep ? <Check className="w-4 h-4" /> : <CircleDashed className="w-4 h-4" />}
          </div>
          <div className="sm:text-center">
            <p className={cn("font-medium", index <= currentStep ? "text-primary" : "text-gray-500")}>{step.title}</p>
            <p className="text-xs text-gray-500">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
