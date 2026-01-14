interface StepperStepProps {
  stepNumber: number;
  title: string;
  isActive: boolean;
  isCompleted: boolean;
  showLeftLine?: boolean;
  showLine?: boolean;
  leftLineCompleted?: boolean;
  totalSteps?: number;
}

export default function StepperStep({
  stepNumber,
  title,
  isActive,
  isCompleted,
  showLeftLine = false,
  showLine = false,
  leftLineCompleted = false,
  totalSteps = 3,
}: StepperStepProps) {
  const columnWidth = Math.max(50, 238 - (totalSteps - 3) * 10);
  const rightLineWidth = Math.max(0, columnWidth - 50 - 16);
  const leftLineWidth = Math.max(0, columnWidth - 50);
  const indicatorClass = [
    "flex h-[50px] w-[50px] items-center justify-center rounded-full border-2 text-base font-medium transition-colors",
    isCompleted
      ? "border-foreground bg-foreground text-background"
      : isActive
      ? "border-foreground text-foreground"
      : "border-border text-muted-foreground",
  ].join(" ");

  return (
    <div className="relative flex flex-col items-center gap-3">
      <button
        type="button"
        className="flex flex-col items-center gap-3 rounded focus:outline-none"
      >
        <div className={`relative ${indicatorClass}`} style={{ width: "50px", height: "50px", boxSizing: "border-box" }}>
          {isCompleted ? "✓" : stepNumber}
          {showLeftLine && (
            <div
              className={`hidden md:block absolute h-0.5 ${
                leftLineCompleted ? "bg-foreground" : "bg-border"
              }`}
              style={{
                top: "50%",
                right: "calc(100% + 8px)",
                width: `${leftLineWidth}px`,
                transform: "translateY(-50%)",
              }}
            />
          )}
          {showLine && (
            <div
              className={`hidden md:block absolute h-0.5 ${
                isCompleted ? "bg-foreground" : "bg-border"
              }`}
              style={{
                top: "50%",
                left: "calc(100% + 8px)",
                width: `${rightLineWidth}px`,
                transform: "translateY(-50%)",
              }}
            />
          )}
        </div>
        <div className="space-y-0.5 px-2">
          <p className="text-sm font-semibold text-foreground">
            {title.trim() ? title : `Шаг ${stepNumber}`}
          </p>
        </div>
      </button>
    </div>
  );
}
