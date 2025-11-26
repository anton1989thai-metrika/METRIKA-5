"use client";

import { useState } from "react";
import Header from "@/components/Header";
import BurgerMenu from "@/components/BurgerMenu";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StepperStep from "@/components/StepperStep";

interface ProjectStep {
  id: number;
  title: string;
}

const initialSteps: ProjectStep[] = [
  { id: 1, title: "" },
  { id: 2, title: "" },
  { id: 3, title: "" },
];

export default function TaskProjectPage() {
  const [steps, setSteps] = useState<ProjectStep[]>(initialSteps);
  const columnWidth = Math.max(50, 250 - (steps.length - 3) * 10);

  const handleTitleChange = (id: number, value: string) => {
    setSteps((prev) =>
      prev.map((step) => (step.id === id ? { ...step, title: value } : step))
    );
  };

  const handleAddStep = () => {
    setSteps((prev) => {
      if (prev.length >= 10) {
        return prev; // Максимум 10 шагов
      }
      // ID всегда равен следующему номеру по порядку
      const nextId = prev.length + 1;
      const newSteps = [...prev, { id: nextId, title: "" }];
      // Пересчитываем все ID чтобы они шли по порядку 1, 2, 3...
      return newSteps.map((step, index) => ({ ...step, id: index + 1 }));
    });
  };

  const handleDetailClick = (stepId: number) => {
    window.location.href = `/project-multi-step-form?stepId=${stepId}`;
  };

  const handleRemoveStep = (stepId: number) => {
    setSteps((prev) => {
      if (prev.length <= 3) {
        return prev;
      }
      const filtered = prev.filter((step) => step.id !== stepId);
      // Пересчитываем все ID чтобы они шли по порядку 1, 2, 3...
      return filtered.map((step, index) => ({ ...step, id: index + 1 }));
    });
  };
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <BurgerMenu />
      <main className="pt-24 pb-10 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-card shadow-lg border-0" style={{ width: "700px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", margin: "35px 0 0 100px" }}>
            <CardHeader>
              <CardTitle className="text-3xl font-bold">Создание проекта</CardTitle>
            </CardHeader>
            <CardContent className="space-y-10" style={{ marginRight: "200px", width: "676px", padding: "0 1px 24px 24px" }}>
              <div className="space-y-4">
                {steps.map((step) => {
                  const canRemove = steps.length > 3;
                  return (
                    <div
                      key={step.id}
                      className="flex flex-col gap-3 md:flex-row md:items-center"
                    >
                      <div className="text-sm font-medium text-muted-foreground md:w-32">
                        Шаг {step.id}
                      </div>
                      <Input
                        value={step.title}
                        onChange={(e) => handleTitleChange(step.id, e.target.value)}
                        placeholder="Введите название шага"
                        className="flex-1"
                        maxLength={35}
                      />
                      <div className="flex gap-2 md:w-auto items-center">
                        <Button variant="outline" onClick={() => handleDetailClick(step.id)}>
                          Детально
                        </Button>
                        <button
                          onClick={() => handleRemoveStep(step.id)}
                          className="text-destructive hover:text-destructive/80 text-lg font-medium transition"
                          title="Удалить шаг"
                          disabled={!canRemove}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-start">
                <Button onClick={handleAddStep} disabled={steps.length >= 10}>
                  Добавить шаг
                </Button>
              </div>
            </CardContent>
          </Card>

          <div
            className="space-y-8 text-center"
            style={{ width: "2000px", margin: "50px 0 0 -526px", padding: "250px 0 97px", position: "relative", overflow: "visible" }}
          >
            {/* Table above Step 1 circle */}
            <div style={{ position: "absolute", top: "-250px", left: "50%", width: "100%", display: "flex", justifyContent: "center", zIndex: 10, transform: `translateX(calc(-50% + ${columnWidth / 2}px))` }}>
              <div
                style={{
                  backgroundColor: "oklch(1 0 0)",
                  borderColor: "oklch(0.922 0 0)",
                  borderRadius: "8px",
                  borderWidth: "1px",
                  fontWeight: "400",
                  overflowX: "hidden",
                  overflowY: "hidden",
                  width: "239px",
                }}
              >
                <div
                  style={{
                    fontWeight: "400",
                    overflowX: "auto",
                    overflowY: "auto",
                    position: "relative",
                    width: "238px",
                  }}
                >
                  <table
                    style={{
                      display: "table",
                      captionSide: "bottom",
                      fontSize: "14px",
                      fontWeight: "400",
                      lineHeight: "20px",
                      width: "237px",
                    }}
                  >
                    <tbody
                      style={{
                        display: "table-row-group",
                        borderCollapse: "collapse",
                        borderSpacing: "2px",
                        captionSide: "bottom",
                        fontWeight: "400",
                      }}
                    >
                      <tr
                        style={{
                          display: "table-row",
                          borderBottomWidth: "1px",
                          borderCollapse: "collapse",
                          borderColor: "oklch(0.922 0 0)",
                          borderSpacing: "2px",
                          captionSide: "bottom",
                          fontWeight: "400",
                          transitionDuration: "0.15s",
                          transitionProperty:
                            "color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --tw-gradient-from, --tw-gradient-via, --tw-gradient-to",
                          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                          verticalAlign: "middle",
                        }}
                      >
                        <div
                          style={{
                            display: "table-cell",
                            backgroundColor: "oklab(0.97 0 0 / 0.5)",
                            borderCollapse: "collapse",
                            borderColor: "oklch(0.922 0 0)",
                            borderRightWidth: "1px",
                            borderSpacing: "2px",
                            captionSide: "bottom",
                            fontWeight: "500",
                            verticalAlign: "middle",
                            width: "180px",
                            padding: "8px",
                          }}
                        >
                          Name
                        </div>
                        <div
                          style={{
                            display: "table-cell",
                            borderCollapse: "collapse",
                            borderSpacing: "2px",
                            captionSide: "bottom",
                            fontWeight: "400",
                            verticalAlign: "middle",
                            padding: "8px",
                            width: "90px",
                            minWidth: "90px",
                            textAlign: "center",
                            backgroundColor: "oklab(0.97 0 0 / 0.5)",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
                            21.10.2025
                          </div>
                        </div>
                      </tr>
                      <tr
                        style={{
                          display: "table-row",
                          borderBottomWidth: "1px",
                          borderCollapse: "collapse",
                          borderColor: "oklch(0.922 0 0)",
                          borderSpacing: "2px",
                          captionSide: "bottom",
                          fontWeight: "400",
                          transitionDuration: "0.15s",
                          transitionProperty:
                            "color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --tw-gradient-from, --tw-gradient-via, --tw-gradient-to",
                          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                          verticalAlign: "middle",
                        }}
                      >
                        <div
                          style={{
                            display: "table-cell",
                            backgroundColor: "rgba(255, 255, 255, 1)",
                            borderCollapse: "collapse",
                            borderColor: "oklch(0.922 0 0)",
                            borderRightWidth: "1px",
                            borderSpacing: "2px",
                            captionSide: "bottom",
                            fontWeight: "500",
                            verticalAlign: "middle",
                            padding: "8px",
                          }}
                        >
                          Email
                        </div>
                        <div
                          style={{
                            display: "table-cell",
                            borderCollapse: "collapse",
                            borderSpacing: "2px",
                            captionSide: "bottom",
                            fontWeight: "400",
                            verticalAlign: "middle",
                            padding: "8px",
                            width: "90px",
                            minWidth: "90px",
                            textAlign: "center",
                            backgroundColor: "rgba(255, 255, 255, 1)",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
                            22.10.2025
                          </div>
                        </div>
                      </tr>
                      <tr
                        style={{
                          display: "table-row",
                          borderBottomWidth: "1px",
                          borderCollapse: "collapse",
                          borderColor: "oklch(0.922 0 0)",
                          borderSpacing: "2px",
                          captionSide: "bottom",
                          fontWeight: "400",
                          transitionDuration: "0.15s",
                          transitionProperty:
                            "color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --tw-gradient-from, --tw-gradient-via, --tw-gradient-to",
                          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                          verticalAlign: "middle",
                        }}
                      >
                        <div
                          style={{
                            display: "table-cell",
                            backgroundColor: "oklab(0.97 0 0 / 0.5)",
                            borderCollapse: "collapse",
                            borderColor: "oklch(0.922 0 0)",
                            borderRightWidth: "1px",
                            borderSpacing: "2px",
                            captionSide: "bottom",
                            fontWeight: "500",
                            verticalAlign: "middle",
                            padding: "8px",
                          }}
                        >
                          Location
                        </div>
                        <div
                          style={{
                            display: "table-cell",
                            borderCollapse: "collapse",
                            borderSpacing: "2px",
                            captionSide: "bottom",
                            fontWeight: "400",
                            verticalAlign: "middle",
                            padding: "8px",
                            width: "90px",
                            minWidth: "90px",
                            textAlign: "center",
                            backgroundColor: "oklab(0.97 0 0 / 0.5)",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
                            23.10.2025
                          </div>
                        </div>
                      </tr>
                      <tr
                        style={{
                          display: "table-row",
                          borderBottomWidth: "1px",
                          borderCollapse: "collapse",
                          borderColor: "oklch(0.922 0 0)",
                          borderSpacing: "2px",
                          captionSide: "bottom",
                          fontWeight: "400",
                          transitionDuration: "0.15s",
                          transitionProperty:
                            "color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --tw-gradient-from, --tw-gradient-via, --tw-gradient-to",
                          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                          verticalAlign: "middle",
                        }}
                      >
                        <div
                          style={{
                            display: "table-cell",
                            backgroundColor: "rgba(255, 255, 255, 1)",
                            borderCollapse: "collapse",
                            borderColor: "oklch(0.922 0 0)",
                            borderRightWidth: "1px",
                            borderSpacing: "2px",
                            captionSide: "bottom",
                            fontWeight: "500",
                            verticalAlign: "middle",
                            padding: "8px",
                          }}
                        >
                          Status
                        </div>
                        <div
                          style={{
                            display: "table-cell",
                            borderCollapse: "collapse",
                            borderSpacing: "2px",
                            captionSide: "bottom",
                            fontWeight: "400",
                            verticalAlign: "middle",
                            padding: "8px",
                            width: "90px",
                            minWidth: "90px",
                            textAlign: "center",
                            backgroundColor: "rgba(255, 255, 255, 1)",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
                            24.10.2025
                          </div>
                        </div>
                      </tr>
                      <tr
                        style={{
                          display: "table-row",
                          borderBottomWidth: "1px",
                          borderCollapse: "collapse",
                          borderColor: "oklch(0.922 0 0)",
                          borderSpacing: "2px",
                          captionSide: "bottom",
                          fontWeight: "400",
                          transitionDuration: "0.15s",
                          transitionProperty:
                            "color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --tw-gradient-from, --tw-gradient-via, --tw-gradient-to",
                          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                          verticalAlign: "middle",
                        }}
                      >
                        <div
                          style={{
                            display: "table-cell",
                            backgroundColor: "oklab(0.97 0 0 / 0.5)",
                            borderCollapse: "collapse",
                            borderColor: "oklch(0.922 0 0)",
                            borderRightWidth: "1px",
                            borderSpacing: "2px",
                            captionSide: "bottom",
                            fontWeight: "500",
                            verticalAlign: "middle",
                            padding: "8px",
                          }}
                        >
                          Balance
                        </div>
                        <div
                          style={{
                            display: "table-cell",
                            borderCollapse: "collapse",
                            borderSpacing: "2px",
                            captionSide: "bottom",
                            fontWeight: "400",
                            verticalAlign: "middle",
                            padding: "8px",
                            width: "90px",
                            minWidth: "90px",
                            textAlign: "center",
                            backgroundColor: "oklab(0.97 0 0 / 0.5)",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
                            25.10.2025
                          </div>
                        </div>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div 
              className="flex flex-col gap-6 md:grid md:grid-flow-col md:items-center md:justify-center md:gap-0" 
              style={{ 
                marginRight: "19px", 
                paddingRight: "1px",
                gridTemplateColumns: `repeat(${steps.length}, ${columnWidth}px)`,
              }}
            >
              {steps.map((step, index) => {
                const stepNumber = index + 1;
                const activeStep = steps.length >= 2 ? 2 : 1;
                const isActive = stepNumber === activeStep;
                const isCompleted = stepNumber < activeStep;
                const showLeftLine = index > 0;
                const leftLineCompleted = stepNumber - 1 < activeStep;

                return (
                  <div
                    key={step.id}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <StepperStep
                      stepNumber={stepNumber}
                      title={step.title}
                      isActive={isActive}
                      isCompleted={isCompleted}
                      showLeftLine={showLeftLine}
                      leftLineCompleted={leftLineCompleted}
                      showLine={false}
                      totalSteps={steps.length}
                    />
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
