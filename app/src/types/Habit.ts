export type HabitType = "binary" | "numeric" | "time";

export type HabitColor =
  | "blue"
  | "green"
  | "orange"
  | "purple"
  | "pink"
  | "red"
  | "yellow"
  | "cyan"
  | "indigo";

export interface Habit {
  id: string;
  name: string;
  description?: string;
  type: HabitType;
  targetValue: number;
  unit?: string;
  colorTheme?: HabitColor;
  createdAt: string;
  completedDates: string[];
  history?: Record<string, number>;
  streak?: number;
  frequencyDays?: number[]; // 0 = Dom, 1 = Lun, 2 = Mar, 3 = Mié, 4 = Jue, 5 = Vie, 6 = Sáb
}

