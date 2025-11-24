"use client";

import { useState } from "react";
import Header from "@/components/Header";
import BurgerMenu from "@/components/BurgerMenu";

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
  {
    step: 4,
    title: "Step Four",
    description: "Desc for step four",
  },
];

const activeStep = 2;

export default function StepTestPage() {
  const [currentStep] = useState(activeStep);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <BurgerMenu />
      <main className="pt-24 px-4">
        <div className="mx-auto w-full space-y-8 text-center" style={{ maxWidth: "797px" }}>
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            {steps.map(({ step, title, description }, index) => {
              const isActive = step === currentStep;
              const isCompleted = step < currentStep;
              const isLast = index === steps.length - 1;

              const indicatorClass = [
                "flex h-6 w-6 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors",
                isCompleted
                  ? "border-foreground bg-foreground text-background"
                  : isActive
                  ? "border-foreground text-foreground"
                  : "border-border text-muted-foreground",
              ].join(" ");

              return (
                <div
                  key={step}
                  className="relative flex flex-1 flex-col items-center"
                >
                  <button
                    type="button"
                    className="flex flex-col items-center gap-3 rounded focus:outline-none"
                  >
                    <div className={indicatorClass}>
                      {isCompleted ? "✓" : step}
                    </div>
                    <div className="space-y-0.5 px-2">
                      <p className="text-sm font-semibold text-foreground">{title}</p>
                    </div>
                  </button>
                  {!isLast && (
                    <div
                      className={`hidden md:block absolute top-3 left-[117px] -translate-y-1/2 h-0.5 w-[calc(100%-1.5rem-0.25rem)] ${
                        isCompleted ? "bg-foreground" : "bg-border"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-muted-foreground" role="region" aria-live="polite">
            Stepper with titles and descriptions
          </p>
        </div>
      </main>
    </div>
  );
}
