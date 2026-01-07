interface StepperLineProps {
  isCompleted: boolean;
}

export default function StepperLine({ isCompleted }: StepperLineProps) {
  return (
    <div
      className={`hidden md:block h-0.5 ${
        isCompleted ? "bg-foreground" : "bg-border"
      }`}
      style={{
        width: "184px",
        height: "2px",
      }}
    />
  );
}

