interface StepperStepProps {
  stepNumber: number;
  title: string;
  isActive: boolean;
  isCompleted: boolean;
  showLine?: boolean;
  totalSteps?: number;
}

export default function StepperStep({
  stepNumber,
  title,
  isActive,
  isCompleted,
  showLine = false,
  totalSteps = 3,
}: StepperStepProps) {
  const indicatorClass = [
    "flex h-[50px] w-[50px] items-center justify-center rounded-full border-2 text-base font-medium transition-colors",
    isCompleted
      ? "border-foreground bg-foreground text-background"
      : isActive
      ? "border-foreground text-foreground"
      : "border-border text-muted-foreground",
  ].join(" ");

  // Вычисляем ширину линии: базовая ширина (184px при 3 шагах) минус 10px за каждый дополнительный шаг
  // Расстояние между краями кругов: 250px (между центрами) - 50px (диаметр) = 200px
  // Отступы: 8px с каждой стороны = 16px
  // Базовая ширина при 3 шагах: 200px - 16px = 184px
  const baseWidth = 184; // при 3 шагах
  const lineWidth = Math.max(0, baseWidth - (totalSteps - 3) * 10);

  return (
    <div className="relative flex flex-col items-center gap-3">
      <button
        type="button"
        className="flex flex-col items-center gap-3 rounded focus:outline-none"
      >
        <div className={`relative ${indicatorClass}`} style={{ width: "50px", height: "50px", boxSizing: "border-box" }}>
          {isCompleted ? "✓" : stepNumber}
          {showLine && (
            <div
              className={`hidden md:block absolute h-0.5 ${
                isCompleted ? "bg-foreground" : "bg-border"
              }`}
              style={{
                top: "50%",
                left: "calc(100% + 8px)",
                width: `${lineWidth}px`,
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
