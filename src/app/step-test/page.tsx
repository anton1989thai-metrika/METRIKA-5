"use client";

import { useState } from "react";
import Header from "@/components/Header";
import BurgerMenu from "@/components/BurgerMenu";

const steps = [1, 2, 3, 4];

export default function StepTestPage() {
  const [currentStep] = useState(2);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <BurgerMenu />
      <main className="pt-24 px-4">
        <div className="mx-auto w-full" style={{ maxWidth: "797px" }}>
          <div className="inline-flex flex-col gap-4 text-sm mt-[26px]">
            <div className="flex flex-col gap-2 mt-[130px] md:flex-row md:items-start md:gap-0">
              {steps.map((step) => {
                const isActive = step === currentStep;
                const isCompleted = step < currentStep;

                const indicatorClass = [
                  "flex h-7 w-7 items-center justify-center rounded-full border text-xs font-medium",
                  isCompleted
                    ? "border-foreground bg-foreground text-background"
                    : isActive
                    ? "border-foreground text-foreground"
                    : "border-border text-muted-foreground",
                ].join(" ");

                const lineVertical = [
                  "mt-1 h-8 w-px",
                  isCompleted ? "bg-foreground" : "bg-border",
                ].join(" ");

                const lineHorizontal = [
                  "hidden md:block absolute h-[2px] bg-border",
                  isCompleted ? "bg-foreground" : "bg-border",
                ].join(" ");

                return (
                  <div
                    key={step}
                    className="flex items-start gap-4 md:flex-col md:flex-1 md:items-center md:gap-2 md:text-center md:relative"
                  >
                    <div
                      className={`flex flex-col items-center ${
                        step === 3 ? "gap-[9px]" : "gap-2"
                      }`}
                    >
                      <div className={indicatorClass}>
                        {isCompleted ? (
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            className="h-3 w-3"
                          >
                            <path
                              d="M20.285 6.707a1 1 0 0 0-1.414-1.414L9 15.164 5.121 11.285A1 1 0 0 0 3.707 12.7l4.95 4.95a1 1 0 0 0 1.414 0z"
                              fill="currentColor"
                            />
                          </svg>
                        ) : (
                          <span>{step}</span>
                        )}
                      </div>

                      {step < 4 && (
                        <>
                          <div className={`${lineVertical} md:hidden`} />
                          <div
                            className={lineHorizontal}
                            style={{
                              top: "calc(50% - 1px)",
                              left: "calc(50% + 14px)",
                              width: "calc(100% - 1.5rem)",
                            }}
                          />
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
