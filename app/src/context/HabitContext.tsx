import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Habit, HabitColor, HabitType } from "../types/Habit";

interface HabitContextType {
  habits: Habit[];
  loading: boolean;
  addHabit: (
    name: string,
    description?: string,
    type?: HabitType,
    targetValue?: number,
    unit?: string,
    colorTheme?: HabitColor,
    frequencyDays?: number[]
  ) => Promise<void>;
  updateHabit: (
    id: string,
    name: string,
    description?: string,
    type?: HabitType,
    targetValue?: number,
    unit?: string,
    colorTheme?: HabitColor,
    frequencyDays?: number[]
  ) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  toggleHabit: (id: string, date: string) => Promise<void>;
  incrementHabit: (id: string, date: string, delta?: number) => Promise<void>;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

const STORAGE_KEY = "@habit_tracker_habits";

const getTodayString = () => new Date().toISOString().split("T")[0];

const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];

const DEFAULT_HABITS: Habit[] = [
  {
    id: "1",
    name: "Beber agua",
    description: "8 vasos al día",
    type: "numeric",
    targetValue: 8,
    unit: "vasos",
    colorTheme: "green",
    createdAt: new Date().toISOString(),
    completedDates: [getTodayString()],
    history: { [getTodayString()]: 8 },
    streak: 12,
    frequencyDays: ALL_DAYS,
  },
  {
    id: "2",
    name: "Leer 20 minutos",
    description: "Crecimiento personal",
    type: "time",
    targetValue: 20,
    unit: "min",
    colorTheme: "blue",
    createdAt: new Date().toISOString(),
    completedDates: [],
    history: { [getTodayString()]: 5 },
    streak: 8,
    frequencyDays: ALL_DAYS,
  },
  {
    id: "3",
    name: "Caminar",
    description: "Movimiento consciente",
    type: "binary",
    targetValue: 1,
    unit: "",
    colorTheme: "orange",
    createdAt: new Date().toISOString(),
    completedDates: [],
    history: {},
    streak: 5,
    frequencyDays: ALL_DAYS,
  },
];

export function HabitProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      const storedHabits = await AsyncStorage.getItem(STORAGE_KEY);

      if (storedHabits) {
        setHabits(JSON.parse(storedHabits));
      } else {
        setHabits(DEFAULT_HABITS);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_HABITS));
      }
    } catch (error) {
      console.error("Error al cargar hábitos:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveHabits = async (newHabits: Habit[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newHabits));
      setHabits(newHabits);
    } catch (error) {
      console.error("Error al guardar hábitos:", error);
    }
  };

  const addHabit = async (
    name: string,
    description?: string,
    type: HabitType = "binary",
    targetValue: number = 1,
    unit: string = "",
    colorTheme: HabitColor = "blue",
    frequencyDays: number[] = ALL_DAYS
  ) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name,
      description,
      type,
      targetValue,
      unit,
      colorTheme,
      frequencyDays,
      createdAt: new Date().toISOString(),
      completedDates: [],
      history: {},
      streak: 0,
    };

    await saveHabits([...habits, newHabit]);
  };

  const updateHabit = async (
    id: string,
    name: string,
    description?: string,
    type: HabitType = "binary",
    targetValue: number = 1,
    unit: string = "",
    colorTheme: HabitColor = "blue",
    frequencyDays: number[] = ALL_DAYS
  ) => {
    const updatedHabits = habits.map((habit) =>
      habit.id === id
        ? {
            ...habit,
            name,
            description,
            type,
            targetValue,
            unit,
            colorTheme,
            frequencyDays,
          }
        : habit
    );

    await saveHabits(updatedHabits);
  };

  const deleteHabit = async (id: string) => {
    const updatedHabits = habits.filter((habit) => habit.id !== id);
    await saveHabits(updatedHabits);
  };

  const toggleHabit = async (id: string, date: string) => {
    const updatedHabits = habits.map((habit) => {
      if (habit.id !== id) return habit;

      const isCompleted = habit.completedDates.includes(date);
      const completedDates = isCompleted
        ? habit.completedDates.filter((d) => d !== date)
        : [...habit.completedDates, date];

      const history = { ...(habit.history || {}) };
      history[date] = isCompleted ? 0 : habit.targetValue;

      const streak = (habit.streak ?? 0) + (isCompleted ? -1 : 1);

      return {
        ...habit,
        completedDates,
        history,
        streak: Math.max(0, streak),
      };
    });

    await saveHabits(updatedHabits);
  };

  const incrementHabit = async (id: string, date: string, delta: number = 1) => {
    const updatedHabits = habits.map((habit) => {
      if (habit.id !== id) return habit;

      const history = { ...(habit.history || {}) };
      const currentVal = history[date] || 0;
      const newVal = Math.min(habit.targetValue, currentVal + delta);
      history[date] = newVal;

      const isNowCompleted = newVal >= habit.targetValue;
      const wasCompleted = habit.completedDates.includes(date);

      let completedDates = [...habit.completedDates];
      if (isNowCompleted && !wasCompleted) {
        completedDates.push(date);
      } else if (!isNowCompleted && wasCompleted) {
        completedDates = completedDates.filter((d) => d !== date);
      }

      let streak = habit.streak ?? 0;
      if (isNowCompleted && !wasCompleted) streak += 1;
      if (!isNowCompleted && wasCompleted) streak = Math.max(0, streak - 1);

      return {
        ...habit,
        completedDates,
        history,
        streak,
      };
    });

    await saveHabits(updatedHabits);
  };

  return (
    <HabitContext.Provider
      value={{
        habits,
        loading,
        addHabit,
        updateHabit,
        deleteHabit,
        toggleHabit,
        incrementHabit,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
}

export function useHabit() {
  const context = useContext(HabitContext);

  if (!context) {
    throw new Error("useHabit debe utilizarse dentro de HabitProvider");
  }

  return context;
}
