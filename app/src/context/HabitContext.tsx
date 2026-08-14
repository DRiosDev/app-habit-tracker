import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { Habit } from "../types/Habit";

interface HabitContextType {
  habits: Habit[];
  loading: boolean;
  addHabit: (name: string, description?: string) => Promise<void>;
  updateHabit: (
    id: string,
    name: string,
    description?: string,
  ) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  toggleHabit: (id: string, date: string) => Promise<void>;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

const STORAGE_KEY = "@habit_tracker_habits";

export function HabitProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar hábitos al iniciar la aplicación
  useEffect(() => {
    loadHabits();
  }, []);

  // Leer hábitos
  const loadHabits = async () => {
    try {
      const storedHabits = await AsyncStorage.getItem(STORAGE_KEY);

      if (storedHabits) {
        setHabits(JSON.parse(storedHabits));
      }
    } catch (error) {
      console.error("Error al cargar hábitos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Guardar hábitos
  const saveHabits = async (newHabits: Habit[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newHabits));

      setHabits(newHabits);
    } catch (error) {
      console.error("Error al guardar hábitos:", error);
    }
  };

  // Crear
  const addHabit = async (name: string, description?: string) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name,
      description,
      createdAt: new Date().toISOString(),
      completedDates: [],
    };

    await saveHabits([...habits, newHabit]);
  };

  // Editar
  const updateHabit = async (
    id: string,
    name: string,
    description?: string,
  ) => {
    const updatedHabits = habits.map((habit) =>
      habit.id === id
        ? {
            ...habit,
            name,
            description,
          }
        : habit,
    );

    await saveHabits(updatedHabits);
  };

  // Eliminar
  const deleteHabit = async (id: string) => {
    const updatedHabits = habits.filter((habit) => habit.id !== id);

    await saveHabits(updatedHabits);
  };

  // Marcar/desmarcar como completado
  const toggleHabit = async (id: string, date: string) => {
    const updatedHabits = habits.map((habit) => {
      if (habit.id !== id) {
        return habit;
      }

      const completedDates = habit.completedDates.includes(date)
        ? habit.completedDates.filter((completedDate) => completedDate !== date)
        : [...habit.completedDates, date];

      return {
        ...habit,
        completedDates,
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
