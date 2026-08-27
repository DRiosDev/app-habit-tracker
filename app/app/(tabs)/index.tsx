import { ScreenView, Text } from "@/src/components/Themed";
import { useHabit } from "@/src/context/HabitContext";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router";
import { Pressable, ScrollView, TouchableOpacity, View } from "react-native";

export default function TabOneScreen() {
  const { habits, loading, toggleHabit, incrementHabit } = useHabit();
  const todayStr = new Date().toISOString().split("T")[0];
  const currentDayOfWeek = new Date().getDay(); // 0 = Dom, 1 = Lun, 2 = Mar, 3 = Mié, 4 = Jue, 5 = Vie, 6 = Sáb

  // Filtrar hábitos agendados para HOY
  const habitsToday = habits.filter((h) => {
    if (!h.frequencyDays || h.frequencyDays.length === 0) return true;
    return h.frequencyDays.includes(currentDayOfWeek);
  });

  const completedCount = habitsToday.filter((h) =>
    h.completedDates.includes(todayStr),
  ).length;
  const totalCount = habitsToday.length;
  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  if (loading) {
    return (
      <ScreenView className="items-center justify-center">
        <Text className="text-text-muted">Cargando hábitos...</Text>
      </ScreenView>
    );
  }

  return (
    <ScreenView>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        {/* Tarjeta "Tu día en foco" */}
        <View className="bg-primary rounded-3xl p-6 shadow-sm">
          {/* Cabecera */}
          <View className="flex-row justify-between items-center mb-2">
            <Text className="font-mono text-sm md:text-lg font-medium text-text-on-primary-muted tracking-[0.2em] uppercase">
              tu día en foco
            </Text>
            <View className="bg-primary-badge px-3 py-1 rounded-full">
              <Text className="font-mono text-xs md:text-lg text-text-on-primary font-medium">
                {completedCount}/{totalCount} hábitos
              </Text>
            </View>
          </View>

          {/* Título */}
          <Text className="text-3xl md:text-4xl font-bold text-text-on-primary mb-6">
            {progressPercent === 100
              ? "¡Excelente trabajo!"
              : progressPercent > 50
                ? "Buen ritmo."
                : "Un paso a la vez."}
          </Text>

          {/* Barra de progreso + Porcentaje */}
          <View className="flex-row items-center gap-3">
            <View className="flex-1 bg-progress-track h-2.5 rounded-full overflow-hidden">
              <View
                className="bg-accent h-full rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </View>
            <Text className="font-mono text-xs font-bold text-text-on-primary">
              {progressPercent}%
            </Text>
          </View>

          {/* Frase inferior */}
          <Text className="text-sm md:text-lg text-text-on-primary-muted mt-5 font-normal">
            Pequeños pasos, repetidos con intención.
          </Text>
        </View>

        {/* Sección "Hábitos de hoy" */}
        <View className="mt-2">
          <View className="flex-row justify-between items-end mb-3">
            <View>
              <Text className="font-mono text-sm md:text-lg font-medium text-text-muted tracking-[0.2em] uppercase">
                RUTINA
              </Text>
              <Text className="text-2xl md:text-3xl font-bold text-text-main mt-0.5">
                Hábitos de hoy
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push("/habitos")}
              className="flex-row items-center gap-2"
            >
              <Text className="text-sm md:text-lg font-semibold text-text-muted">
                Ver todos
              </Text>
              <FontAwesome
                name="angle-right"
                size={16}
                color="#9CA3AF"
                className="text-text-muted"
              />
            </TouchableOpacity>
          </View>

          {/* Lista de Hábitos de Hoy */}
          <View className="gap-3">
            {habitsToday.length > 0 ? (
              habitsToday.map((habit) => {
                const isCompleted = habit.completedDates.includes(todayStr);
                const currentProgress = habit.history?.[todayStr] || 0;
                const hasMultiStep =
                  habit.type !== "binary" && habit.targetValue > 1;
                const stepDelta = habit.type === "time" ? 5 : 1;

                // Paleta dinámica de 9 colores para ícono y círculo
                const getCircleBg = () => {
                  if (isCompleted) return "bg-emerald-200/80 dark:bg-emerald-900/60";
                  switch (habit.colorTheme) {
                    case "green": return "bg-emerald-100 dark:bg-emerald-950/60";
                    case "orange": return "bg-orange-100 dark:bg-orange-950/60";
                    case "purple": return "bg-purple-100 dark:bg-purple-950/60";
                    case "pink": return "bg-pink-100 dark:bg-pink-950/60";
                    case "red": return "bg-red-100 dark:bg-red-950/60";
                    case "yellow": return "bg-amber-100 dark:bg-amber-950/60";
                    case "cyan": return "bg-cyan-100 dark:bg-cyan-950/60";
                    case "indigo": return "bg-indigo-100 dark:bg-indigo-950/60";
                    default: return "bg-blue-100 dark:bg-blue-950/60";
                  }
                };

                const getIconColor = () => {
                  switch (habit.colorTheme) {
                    case "green": return "#10b981";
                    case "orange": return "#f97316";
                    case "purple": return "#8b5cf6";
                    case "pink": return "#ec4899";
                    case "red": return "#ef4444";
                    case "yellow": return "#eab308";
                    case "cyan": return "#06b6d4";
                    case "indigo": return "#6366f1";
                    default: return "#3b82f6";
                  }
                };

                const cardBgClass = isCompleted
                  ? "bg-emerald-500/10 dark:bg-emerald-950/20 border-emerald-500/30"
                  : "bg-card border-slate-200/60 dark:border-slate-800/80";

                return (
                  <View
                    key={habit.id}
                    className={`rounded-3xl p-4 flex-row items-center justify-between border ${cardBgClass}`}
                  >
                    {/* Clic en la izquierda para completar 100% de 1 toque */}
                    <Pressable
                      onPress={() => toggleHabit(habit.id, todayStr)}
                      className="flex-row items-center flex-1 mr-2"
                    >
                      <View
                        className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${getCircleBg()}`}
                      >
                        {isCompleted ? (
                          <FontAwesome name="check" size={18} color="#15803d" />
                        ) : (
                          <FontAwesome
                            name="circle-o"
                            size={20}
                            color={getIconColor()}
                          />
                        )}
                      </View>

                      <View className="flex-1">
                        <Text
                          className={`text-base md:text-xl font-semibold ${
                            isCompleted
                              ? "line-through text-slate-400 dark:text-slate-500"
                              : "text-text-main"
                          }`}
                        >
                          {habit.name}
                        </Text>

                        {/* Subtítulo + Progreso progresivo */}
                        <Text className="text-xs md:text-base text-text-muted mt-0.5 font-normal">
                          {hasMultiStep && !isCompleted
                            ? `${currentProgress}/${habit.targetValue} ${habit.unit || ""}`
                            : habit.description || ""}
                        </Text>
                      </View>
                    </Pressable>

                    {/* Acciones del lado derecho (Botón +1 y Racha) */}
                    <View className="flex-row items-center gap-3">
                      {/* Botón de incremento +1 / +5 para hábitos cuantitativos no completados */}
                      {hasMultiStep && !isCompleted && (
                        <TouchableOpacity
                          onPress={() =>
                            incrementHabit(habit.id, todayStr, stepDelta)
                          }
                          className="bg-primary px-3 py-1.5 rounded-full flex-row items-center gap-1 active:opacity-70"
                        >
                          <FontAwesome name="plus" size={10} color="#ffffff" />
                          <Text className="font-mono text-base md:text-lg font-bold text-white">
                            {stepDelta}
                          </Text>
                        </TouchableOpacity>
                      )}

                      {/* Contador de Racha */}
                      <View className="flex-row items-center gap-1">
                        <FontAwesome name="fire" size={14} color="#f97316" />
                        <Text className="font-mono text-sm md:text-lg font-semibold text-text-muted uppercase">
                          {habit.streak || 0}d
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })
            ) : (
              <View className="items-center justify-center p-6 bg-card rounded-3xl">
                <Text className="text-sm font-medium text-text-main text-center">
                  ¡No tienes hábitos programados para hoy! 🎉
                </Text>
                <Text className="text-xs text-text-muted text-center mt-1">
                  Disfruta tu día libre o gestiona tus hábitos desde el menú.
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenView>
  );
}
