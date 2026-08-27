import { ScreenView, Text } from "@/src/components/Themed";
import { useHabit } from "@/src/context/HabitContext";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Pressable, ScrollView, TouchableOpacity, View } from "react-native";
import { Button, SegmentedButtons } from "react-native-paper";

type FilterType = "all" | "pending" | "completed";

export default function HabitosScreen() {
  const { habits, loading, toggleHabit, deleteHabit, incrementHabit } = useHabit();
  const [filter, setFilter] = useState<FilterType>("all");
  const todayStr = new Date().toISOString().split("T")[0];

  const filteredHabits = habits.filter((habit) => {
    const isCompleted = habit.completedDates.includes(todayStr);
    if (filter === "pending") return !isCompleted;
    if (filter === "completed") return isCompleted;
    return true;
  });

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      "Eliminar Hábito",
      `¿Estás seguro de que deseas eliminar "${name}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: () => deleteHabit(id) },
      ]
    );
  };

  if (loading) {
    return (
      <ScreenView className="items-center justify-center">
        <Text className="text-text-muted">Cargando catálogo de hábitos...</Text>
      </ScreenView>
    );
  }

  return (
    <ScreenView>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        {/* Cabecera superior */}
        <View className="flex-row justify-between items-center mb-1">
          <View>
            <Text className="font-mono text-[11px] font-medium text-text-muted tracking-[0.2em] uppercase">
              GESTIÓN
            </Text>
            <Text className="text-2xl font-bold text-text-main mt-0.5">
              Mis Hábitos
            </Text>
          </View>
          <Button
            mode="contained"
            icon="plus"
            onPress={() => router.push("/modalCUHabit")}
            compact
          >
            Nuevo
          </Button>
        </View>

        {/* Filtros segmentados */}
        <SegmentedButtons
          value={filter}
          onValueChange={(val) => setFilter(val as FilterType)}
          buttons={[
            { value: "all", label: `Todos (${habits.length})` },
            { value: "pending", label: "Pendientes" },
            { value: "completed", label: "Completados" },
          ]}
        />

        {/* Lista de Hábitos */}
        {filteredHabits.length > 0 ? (
          <View className="gap-3 mt-1">
            {filteredHabits.map((habit) => {
              const isCompleted = habit.completedDates.includes(todayStr);
              const currentProgress = habit.history?.[todayStr] || 0;
              const hasMultiStep = habit.type !== "binary" && habit.targetValue > 1;
              const stepDelta = habit.type === "time" ? 5 : 1;

              const circleBgClass = isCompleted
                ? "bg-emerald-200/80 dark:bg-emerald-900/60"
                : habit.colorTheme === "orange"
                ? "bg-orange-100 dark:bg-orange-950/60"
                : habit.colorTheme === "green"
                ? "bg-emerald-100 dark:bg-emerald-950/60"
                : "bg-blue-100 dark:bg-blue-950/60";

              const cardBgClass = isCompleted
                ? "bg-emerald-500/10 dark:bg-emerald-950/20 border-emerald-500/30"
                : "bg-card border-slate-200/60 dark:border-slate-800/80";

              return (
                <View
                  key={habit.id}
                  className={`rounded-3xl p-4 flex-row items-center justify-between border ${cardBgClass}`}
                >
                  {/* Botón Circular + Info del hábito (1 toque para completado total) */}
                  <Pressable
                    onPress={() => toggleHabit(habit.id, todayStr)}
                    className="flex-row items-center flex-1 mr-2"
                  >
                    <View
                      className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${circleBgClass}`}
                    >
                      {isCompleted ? (
                        <FontAwesome name="check" size={18} color="#15803d" />
                      ) : (
                        <FontAwesome
                          name="circle-o"
                          size={20}
                          color={
                            habit.colorTheme === "orange"
                              ? "#f97316"
                              : habit.colorTheme === "green"
                              ? "#16a34a"
                              : "#3b82f6"
                          }
                        />
                      )}
                    </View>

                    <View className="flex-1">
                      <Text
                        className={`text-base font-semibold ${
                          isCompleted
                            ? "line-through text-slate-400 dark:text-slate-500"
                            : "text-text-main"
                        }`}
                      >
                        {habit.name}
                      </Text>

                      <Text className="text-xs text-text-muted mt-0.5 font-normal">
                        {hasMultiStep && !isCompleted
                          ? `${currentProgress}/${habit.targetValue} ${habit.unit || ""}`
                          : habit.description || ""}
                      </Text>
                    </View>
                  </Pressable>

                  {/* Acciones de gestión (Botón +1, Editar, Eliminar) + Racha */}
                  <View className="flex-row items-center gap-3">
                    {/* Botón +1 / +5 para avance incremental */}
                    {hasMultiStep && !isCompleted && (
                      <TouchableOpacity
                        onPress={() => incrementHabit(habit.id, todayStr, stepDelta)}
                        className="bg-primary px-3 py-1.5 rounded-full flex-row items-center gap-1 active:opacity-70"
                      >
                        <FontAwesome name="plus" size={10} color="#ffffff" />
                        <Text className="font-mono text-xs font-bold text-white">
                          +{stepDelta}
                        </Text>
                      </TouchableOpacity>
                    )}

                    <View className="flex-row items-center gap-1 mr-1">
                      <FontAwesome name="fire" size={14} color="#f97316" />
                      <Text className="font-mono text-xs font-semibold text-text-muted">
                        {habit.streak || 0}d
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={() =>
                        router.push({
                          pathname: "/modalCUHabit",
                          params: { id: habit.id },
                        })
                      }
                      className="p-1.5"
                    >
                      <FontAwesome name="pencil" size={16} className="text-text-muted" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleDelete(habit.id, habit.name)}
                      className="p-1.5"
                    >
                      <FontAwesome name="trash-o" size={16} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View className="items-center justify-center p-8 bg-card rounded-3xl mt-4">
            <FontAwesome name="folder-open-o" size={40} className="text-text-muted mb-3" />
            <Text className="text-base font-medium text-text-main text-center">
              No hay hábitos en esta categoría
            </Text>
            <Text className="text-xs text-text-muted text-center mt-1 mb-4">
              Crea un nuevo hábito o cambia los filtros seleccionados.
            </Text>
            <Button
              mode="outlined"
              onPress={() => router.push("/modalCUHabit")}
            >
              Crear hábito
            </Button>
          </View>
        )}
      </ScrollView>
    </ScreenView>
  );
}
