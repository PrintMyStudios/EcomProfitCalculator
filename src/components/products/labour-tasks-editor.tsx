'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Timer, type TimerResult } from '@/components/timer';
import { getCurrencySymbol } from '@/lib/constants/currencies';
import type { LabourTaskFormValues } from '@/lib/validations/product';
import {
  Plus,
  Clock,
  X,
  Pencil,
  TimerIcon,
} from 'lucide-react';

interface LabourTasksEditorProps {
  tasks: LabourTaskFormValues[];
  onChange: (tasks: LabourTaskFormValues[]) => void;
  defaultHourlyRate: number;
  currency: string;
}

export function LabourTasksEditor({
  tasks,
  onChange,
  defaultHourlyRate,
  currency,
}: LabourTasksEditorProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newTask, setNewTask] = useState<LabourTaskFormValues>({
    name: '',
    minutes: 0,
    ratePerHour: defaultHourlyRate,
  });

  // Calculate total labour cost
  const totalLabourCost = useMemo(() => {
    return tasks.reduce((sum, task) => {
      return sum + (task.minutes / 60) * task.ratePerHour;
    }, 0);
  }, [tasks]);

  // Calculate total time
  const totalMinutes = useMemo(() => {
    return tasks.reduce((sum, task) => sum + task.minutes, 0);
  }, [tasks]);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatCost = (cost: number) => {
    return `${getCurrencySymbol(currency as never)}${cost.toFixed(2)}`;
  };

  const handleAddTask = () => {
    if (!newTask.name.trim() || newTask.minutes <= 0) return;

    if (editingIndex !== null) {
      // Update existing task
      const updated = [...tasks];
      updated[editingIndex] = { ...newTask };
      onChange(updated);
      setEditingIndex(null);
    } else {
      // Add new task
      onChange([...tasks, { ...newTask }]);
    }

    setNewTask({
      name: '',
      minutes: 0,
      ratePerHour: defaultHourlyRate,
    });
    setIsAddOpen(false);
  };

  const handleEditTask = (index: number) => {
    setEditingIndex(index);
    setNewTask({ ...tasks[index] });
    setIsAddOpen(true);
  };

  const handleRemoveTask = (index: number) => {
    onChange(tasks.filter((_, i) => i !== index));
  };

  const handleTimerComplete = (result: TimerResult) => {
    // Add a new task from timer result
    const taskName = `Timed session ${new Date().toLocaleTimeString()}`;
    onChange([
      ...tasks,
      {
        name: taskName,
        minutes: result.minutesPerItem,
        ratePerHour: defaultHourlyRate,
      },
    ]);
    setIsTimerOpen(false);
  };

  const handleCancelAdd = () => {
    setNewTask({
      name: '',
      minutes: 0,
      ratePerHour: defaultHourlyRate,
    });
    setEditingIndex(null);
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-3">
      {/* Tasks List */}
      {tasks.length > 0 && (
        <Card className="p-3">
          <div className="space-y-2">
            {tasks.map((task, index) => {
              const taskCost = (task.minutes / 60) * task.ratePerHour;

              return (
                <div
                  key={index}
                  className="flex items-center gap-3 py-2 border-b last:border-0"
                >
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{task.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatTime(task.minutes)} @ {formatCost(task.ratePerHour)}/hr
                    </div>
                  </div>
                  <span className="text-sm font-medium w-20 text-right">
                    {formatCost(taskCost)}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEditTask(index)}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleRemoveTask(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
            <div className="flex justify-between pt-2 font-medium">
              <span>Total Labour ({formatTime(totalMinutes)})</span>
              <span className="text-primary">{formatCost(totalLabourCost)}</span>
            </div>
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        {/* Add Task Manually */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" className="flex-1 gap-2">
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingIndex !== null ? 'Edit Labour Task' : 'Add Labour Task'}
              </DialogTitle>
              <DialogDescription>
                Enter the task details and time spent
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="task-name">Task Name</Label>
                <Input
                  id="task-name"
                  placeholder="e.g., Assembly, Finishing, Packaging"
                  value={newTask.name}
                  onChange={(e) =>
                    setNewTask((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="task-minutes">Time (minutes)</Label>
                  <Input
                    id="task-minutes"
                    type="number"
                    min="0"
                    step="1"
                    value={newTask.minutes || ''}
                    onChange={(e) =>
                      setNewTask((prev) => ({
                        ...prev,
                        minutes: parseInt(e.target.value) || 0,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="task-rate">Hourly Rate</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      {getCurrencySymbol(currency as never)}
                    </span>
                    <Input
                      id="task-rate"
                      type="number"
                      min="0"
                      step="0.01"
                      className="pl-8"
                      value={newTask.ratePerHour || ''}
                      onChange={(e) =>
                        setNewTask((prev) => ({
                          ...prev,
                          ratePerHour: parseFloat(e.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              {newTask.minutes > 0 && newTask.ratePerHour > 0 && (
                <div className="p-3 rounded-lg bg-muted/50 text-center">
                  <span className="text-sm text-muted-foreground">Task cost: </span>
                  <span className="font-medium">
                    {formatCost((newTask.minutes / 60) * newTask.ratePerHour)}
                  </span>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={handleCancelAdd}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleAddTask}
                  disabled={!newTask.name.trim() || newTask.minutes <= 0}
                >
                  {editingIndex !== null ? 'Update Task' : 'Add Task'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Use Timer */}
        <Dialog open={isTimerOpen} onOpenChange={setIsTimerOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" className="flex-1 gap-2">
              <TimerIcon className="h-4 w-4" />
              Use Timer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Time Your Task</DialogTitle>
              <DialogDescription>
                Start the timer while you work, then add the recorded time to your product
              </DialogDescription>
            </DialogHeader>

            <Timer
              onAddToProduct={handleTimerComplete}
              sessionKey="product-labour"
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Empty State */}
      {tasks.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-2">
          No labour tasks added. Add tasks manually or use the timer to track your time.
        </p>
      )}
    </div>
  );
}
