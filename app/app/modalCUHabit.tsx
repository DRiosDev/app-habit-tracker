import { useHabit } from "@/src/context/HabitContext";
import { HabitColor, HabitType } from "@/src/types/Habit";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, TouchableOpacity, View } from "react-native";
import { Button, HelperText, Text, TextInput } from "react-native-paper";
import * as yup from "yup";

const habitSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required("El nombre del hábito es obligatorio")
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre no puede exceder los 50 caracteres"),
  description: yup
    .string()
    .trim()
    .max(200, "La descripción no puede exceder los 200 caracteres"),
});

const COLOR_PALETTE: { id: HabitColor; hex: string; label: string }[] = [
  { id: "blue", hex: "#3b82f6", label: "Azul" },
  { id: "green", hex: "#10b981", label: "Verde" },
  { id: "orange", hex: "#f97316", label: "Naranja" },
  { id: "purple", hex: "#8b5cf6", label: "Morado" },
  { id: "pink", hex: "#ec4899", label: "Rosa" },
  { id: "red", hex: "#ef4444", label: "Rojo" },
  { id: "yellow", hex: "#eab308", label: "Dorado" },
  { id: "cyan", hex: "#06b6d4", label: "Turquesa" },
  { id: "indigo", hex: "#6366f1", label: "Índigo" },
];

const DAYS_LIST = [
  { id: 1, label: "L", name: "Lun" },
  { id: 2, label: "M", name: "Mar" },
  { id: 3, label: "X", name: "Mié" },
  { id: 4, label: "J", name: "Jue" },
  { id: 5, label: "V", name: "Vie" },
  { id: 6, label: "S", name: "Sáb" },
  { id: 0, label: "D", name: "Dom" },
];

export default function ModalCUHabit() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { habits, addHabit, updateHabit } = useHabit();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<HabitType>("binary");
  const [targetValue, setTargetValue] = useState("1");
  const [unit, setUnit] = useState("");
  const [colorTheme, setColorTheme] = useState<HabitColor>("blue");
  const [frequencyDays, setFrequencyDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);

  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = Boolean(id);

  useEffect(() => {
    if (id) {
      const existingHabit = habits.find((h) => h.id === id);
      if (existingHabit) {
        setName(existingHabit.name);
        setDescription(existingHabit.description || "");
        setType(existingHabit.type || "binary");
        setTargetValue(String(existingHabit.targetValue || 1));
        setUnit(existingHabit.unit || "");
        setColorTheme(existingHabit.colorTheme || "blue");
        setFrequencyDays(existingHabit.frequencyDays || [0, 1, 2, 3, 4, 5, 6]);
      }
    }
  }, [id, habits]);

  const toggleDay = (dayId: number) => {
    if (frequencyDays.includes(dayId)) {
      if (frequencyDays.length === 1) return;
      setFrequencyDays(frequencyDays.filter((d) => d !== dayId));
    } else {
      setFrequencyDays([...frequencyDays, dayId]);
    }
  };

  const applyPresetDays = (preset: "all" | "weekdays" | "weekends") => {
    if (preset === "all") setFrequencyDays([0, 1, 2, 3, 4, 5, 6]);
    if (preset === "weekdays") setFrequencyDays([1, 2, 3, 4, 5]);
    if (preset === "weekends") setFrequencyDays([0, 6]);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setErrors({});

      const validatedData = await habitSchema.validate(
        { name, description },
        { abortEarly: false }
      );

      const parsedTarget = Math.max(1, parseInt(targetValue, 10) || 1);

      if (isEditing && id) {
        await updateHabit(
          id,
          validatedData.name,
          validatedData.description,
          type,
          parsedTarget,
          unit,
          colorTheme,
          frequencyDays
        );
      } else {
        await addHabit(
          validatedData.name,
          validatedData.description,
          type,
          parsedTarget,
          unit,
          colorTheme,
          frequencyDays
        );
      }

      router.back();
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const formErrors: { name?: string; description?: string } = {};
        err.inner.forEach((error) => {
          if (error.path === "name" && !formErrors.name) {
            formErrors.name = error.message;
          }
          if (error.path === "description" && !formErrors.description) {
            formErrors.description = error.message;
          }
        });
        setErrors(formErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-black/60 dark:bg-black/80">
      {/* Tap fuera de la tarjeta para cerrar el modal */}
      <Pressable className="absolute inset-0" onPress={() => router.back()} />

      <ScrollView
        className="flex-1 w-full"
        contentContainerStyle={{
          padding: 16,
          paddingVertical: 40,
          alignItems: "center",
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Tarjeta Flotante Principal Centrada */}
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="w-full max-w-2xl bg-card rounded-3xl p-6 sm:p-8 border border-slate-200/60 dark:border-slate-800 shadow-2xl gap-6"
        >
          {/* Título de la pantalla */}
          <View className="flex-row justify-between items-center border-b border-slate-200/60 dark:border-slate-800/80 pb-4">
            <View>
              <Text className="font-mono text-[11px] font-medium text-text-muted tracking-[0.2em] uppercase mb-1">
                CONFIGURACIÓN
              </Text>
              <Text className="text-2xl sm:text-3xl font-bold text-text-main">
                {isEditing ? "Editar Hábito" : "Crear Nuevo Hábito"}
              </Text>
            </View>

            {/* Botón X de Cierre */}
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-9 h-9 rounded-full bg-slate-200/60 dark:bg-slate-800 items-center justify-center"
            >
              <FontAwesome name="times" size={16} className="text-text-muted" />
            </TouchableOpacity>
          </View>

          {/* Selector de Tipo de Hábito */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-text-muted">Tipo de Hábito</Text>
            <View className="flex-row gap-2 sm:gap-3">
              {[
                { id: "binary", label: "Sí / No", icon: "check-circle-o" },
                { id: "numeric", label: "Contador", icon: "calculator" },
                { id: "time", label: "Tiempo", icon: "clock-o" },
              ].map((item) => {
                const isSelected = type === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => setType(item.id as HabitType)}
                    className={`flex-1 p-3 rounded-2xl border items-center gap-1.5 ${
                      isSelected
                        ? "bg-primary/10 border-primary dark:bg-primary/20"
                        : "bg-card border-slate-200 dark:border-slate-800"
                    }`}
                  >
                    <FontAwesome
                      name={item.icon as any}
                      size={20}
                      color={isSelected ? "#3b82f6" : "#94a3b8"}
                    />
                    <Text
                      className={`text-xs sm:text-sm font-bold text-center ${
                        isSelected ? "text-primary" : "text-text-main"
                      }`}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Nombre del Hábito */}
          <View className="gap-1">
            <TextInput
              label="Nombre del hábito *"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              error={!!errors.name}
              mode="outlined"
              placeholder="Ej: Beber agua, Leer, Caminar"
            />
            {errors.name && (
              <HelperText type="error" visible={!!errors.name}>
                {errors.name}
              </HelperText>
            )}
          </View>

          {/* Categoría / Subtítulo */}
          <View className="gap-1">
            <TextInput
              label="Subtítulo / Categoría (opcional)"
              value={description}
              onChangeText={(text) => {
                setDescription(text);
                if (errors.description) setErrors((prev) => ({ ...prev, description: undefined }));
              }}
              error={!!errors.description}
              mode="outlined"
              placeholder="Ej: 8 vasos al día, Crecimiento personal"
            />
            {errors.description && (
              <HelperText type="error" visible={!!errors.description}>
                {errors.description}
              </HelperText>
            )}
          </View>

          {/* Meta cuantitativa */}
          {type !== "binary" && (
            <View className="flex-row gap-3">
              <View className="flex-1">
                <TextInput
                  label="Meta diaria"
                  value={targetValue}
                  onChangeText={setTargetValue}
                  keyboardType="numeric"
                  mode="outlined"
                  placeholder="Ej: 8, 20"
                />
              </View>
              <View className="flex-1">
                <TextInput
                  label="Unidad"
                  value={unit}
                  onChangeText={setUnit}
                  mode="outlined"
                  placeholder={type === "time" ? "min" : "vasos, reps"}
                />
              </View>
            </View>
          )}

          {/* Paleta Extendida de Colores */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-text-muted">Color del Ícono</Text>
            <View className="flex-row flex-wrap gap-3">
              {COLOR_PALETTE.map((colorItem) => {
                const isSelected = colorTheme === colorItem.id;
                return (
                  <TouchableOpacity
                    key={colorItem.id}
                    onPress={() => setColorTheme(colorItem.id)}
                    style={{ backgroundColor: colorItem.hex }}
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl items-center justify-center shadow-sm ${
                      isSelected ? "ring-4 ring-offset-2 ring-primary scale-105" : "opacity-90"
                    }`}
                  >
                    {isSelected && <FontAwesome name="check" size={16} color="#ffffff" />}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Selección de Días de la Semana */}
          <View className="gap-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-sm font-semibold text-text-muted">Días activos</Text>
              
              {/* Presets Rápidos */}
              <View className="flex-row gap-1.5">
                <Pressable
                  onPress={() => applyPresetDays("all")}
                  className="bg-slate-200/60 dark:bg-slate-800 px-2.5 py-1 rounded-lg"
                >
                  <Text className="text-[11px] font-semibold text-text-muted">Todos</Text>
                </Pressable>
                <Pressable
                  onPress={() => applyPresetDays("weekdays")}
                  className="bg-slate-200/60 dark:bg-slate-800 px-2.5 py-1 rounded-lg"
                >
                  <Text className="text-[11px] font-semibold text-text-muted">L-V</Text>
                </Pressable>
                <Pressable
                  onPress={() => applyPresetDays("weekends")}
                  className="bg-slate-200/60 dark:bg-slate-800 px-2.5 py-1 rounded-lg"
                >
                  <Text className="text-[11px] font-semibold text-text-muted">S-D</Text>
                </Pressable>
              </View>
            </View>

            {/* Píldoras de Días */}
            <View className="flex-row flex-wrap gap-2 sm:gap-3 items-center justify-start">
              {DAYS_LIST.map((day) => {
                const isSelected = frequencyDays.includes(day.id);
                return (
                  <TouchableOpacity
                    key={day.id}
                    onPress={() => toggleDay(day.id)}
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl items-center justify-center border ${
                      isSelected
                        ? "bg-primary border-primary"
                        : "bg-card border-slate-300 dark:border-slate-700"
                    }`}
                  >
                    <Text
                      className={`font-bold text-sm ${
                        isSelected ? "text-text-on-primary" : "text-text-muted"
                      }`}
                    >
                      {day.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Botones de acción */}
          <View className="flex-row justify-end gap-3 mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-800/80">
            <Button
              mode="outlined"
              onPress={() => router.back()}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>

            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {isEditing ? "Guardar Cambios" : "Crear Hábito"}
            </Button>
          </View>
        </Pressable>
      </ScrollView>
    </View>
  );
}
