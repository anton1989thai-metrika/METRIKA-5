"use client";

import { useState } from "react";
import Header from "@/components/Header";
import BurgerMenu from "@/components/BurgerMenu";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const [detailStepId, setDetailStepId] = useState<number | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

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
    setDetailStepId(stepId);
    setIsDetailDialogOpen(true);
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

          <div className="space-y-8 text-center" style={{ width: "2000px", margin: "50px 0 0 -526px", padding: "224px 0 97px" }}>
            <div className="flex flex-col gap-6 md:flex-row md:items-start" style={{ marginRight: "19px", paddingRight: "1px" }}>
              {steps.map((step, index) => {
                const stepNumber = index + 1;
                const activeStep = steps.length >= 2 ? 2 : 1;
                const isActive = stepNumber === activeStep;
                const isCompleted = stepNumber < activeStep;
                const isLast = index === steps.length - 1;
                const indicatorClass = [
                  "flex h-[50px] w-[50px] items-center justify-center rounded-full border-2 text-base font-medium transition-colors",
                  isCompleted
                    ? "border-foreground bg-foreground text-background"
                    : isActive
                    ? "border-foreground text-foreground"
                    : "border-border text-muted-foreground",
                ].join(" ");

                return (
                  <div
                    key={step.id}
                    className="relative flex flex-1 flex-col items-center gap-3"
                  >
                    <button
                      type="button"
                      className="flex flex-col items-center gap-3 rounded focus:outline-none"
                    >
                      <div className={indicatorClass}>{isCompleted ? "✓" : stepNumber}</div>
                      <div className="space-y-0.5 px-2">
                        <p className="text-sm font-semibold text-foreground">
                          {step.title.trim() ? step.title : `Шаг ${stepNumber}`}
                        </p>
                      </div>
                    </button>
                    {!isLast && (
                      <div
                        className={`hidden md:block absolute -translate-y-1/2 h-0.5 ${
                          isCompleted ? "bg-foreground" : "bg-border"
                        }`}
                        style={{
                          top: "25px",
                          left: "calc(50% + 25px + 8px)",
                          width: "calc(100% - 42px)",
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Добавить задачи в Шаг {detailStepId ?? ""}
            </DialogTitle>
            <DialogDescription>
              Здесь появится настройка задач для выбранного шага. (TODO)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>В дальнейшем здесь можно будет выбрать существующие задачи или создать новые.</p>
            <p>Сейчас это заглушка для будущего функционала.</p>
          </div>
          <div className="flex justify-end pt-4">
            <Button onClick={() => setIsDetailDialogOpen(false)}>Закрыть</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

