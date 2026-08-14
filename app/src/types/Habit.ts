export interface Habit {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  completedDates: string[];
}
