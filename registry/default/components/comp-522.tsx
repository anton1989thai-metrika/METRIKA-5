"use client"

const steps = [
  {
    step: 1,
    title: "Step One",
    description: "Desc for step one",
  },
  {
    step: 2,
    title: "Step Two",
    description: "Desc for step two",
  },
  {
    step: 3,
    title: "Step Three",
    description: "Desc for step three",
  },
]

const activeStep = 2

export default function Component() {
  return (
    <div className="space-y-8 text-center">
      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        {steps.map(({ step, title, description }, index) => {
          const isActive = step === activeStep
          const isCompleted = step < activeStep
          const isLast = index === steps.length - 1

          return (
            <div
              key={step}
              className="relative flex flex-1 flex-col items-center"
            >
              <button
                type="button"
                className="flex flex-col items-center gap-3 rounded focus:outline-none"
              >
                <div
                  className={[
                    "flex h-6 w-6 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors",
                    isActive || isCompleted
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-foreground",
                  ].join(" ")}
                >
                  {isCompleted ? "✓" : step}
                </div>
                <div className="space-y-0.5 px-2">
                  <p className="text-sm font-semibold text-foreground">{title}</p>
                  <p className="max-sm:hidden text-xs uppercase text-muted-foreground">
                    {description}
                  </p>
                </div>
              </button>
              {!isLast && (
                <div
                  className="hidden md:block absolute -z-10 h-0.5 bg-border"
                  style={{
                    top: "0.75rem",
                    left: "calc(50% + 0.75rem + 0.125rem)",
                    width: "calc(100% - 1.5rem - 0.25rem)",
                    transform: "translateY(-50%)",
                  }}
                />
              )}
            </div>
          )
        })}
      </div>
      <p
        className="mt-2 text-xs text-muted-foreground"
        role="region"
        aria-live="polite"
      >
        Stepper with titles and descriptions
      </p>
    </div>
  )
}

