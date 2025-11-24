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
      const nextId = prev.length > 0 ? prev[prev.length - 1].id + 1 : 1;
      return [...prev, { id: nextId, title: "" }];
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
      return prev.filter((step) => step.id !== stepId);
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <BurgerMenu />
      <main className="pt-24 pb-10 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-card shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">Создание проекта</CardTitle>
            </CardHeader>
            <CardContent className="space-y-10">
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
                      />
                      <div className="flex gap-2 md:w-auto">
                        <Button variant="outline" onClick={() => handleDetailClick(step.id)}>
                          Детально
                        </Button>
                        <Button
                          variant="ghost"
                          disabled={!canRemove}
                          onClick={() => handleRemoveStep(step.id)}
                        >
                          Удалить
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-start">
                <Button onClick={handleAddStep}>Добавить шаг</Button>
              </div>
            </CardContent>
          </Card>

          <div className="mt-10 space-y-8 text-center">
            <div className="flex flex-col gap-6 md:flex-row md:items-start">
              {steps.map((step, index) => {
                const stepNumber = index + 1;
                const activeStep = steps.length >= 2 ? 2 : 1;
                const isActive = stepNumber === activeStep;
                const isCompleted = stepNumber < activeStep;
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
                    key={step.id}
                    className="relative flex flex-1 flex-col items-center"
                  >
                    <button
                      type="button"
                      className="flex flex-col items-center gap-3 rounded focus:outline-none"
                    >
                      <div className={indicatorClass}>
                        {isCompleted ? "✓" : stepNumber}
                      </div>
                      <div className="px-2">
                        <p className="text-sm font-semibold text-foreground">
                          {step.title.trim() ? step.title : `Step ${stepNumber}`}
                        </p>
                      </div>
                    </button>
                    {!isLast && (
                      <div
                        className={`hidden md:block absolute top-3 left-[calc(50%+0.75rem+0.125rem)] -translate-y-1/2 h-0.5 w-[calc(100%-1.5rem-0.25rem)] ${
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

