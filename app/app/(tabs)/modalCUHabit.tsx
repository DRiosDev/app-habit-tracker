import { ScreenView } from "@/src/components/Themed";
import { useHabit } from "@/src/context/HabitContext";
import { HabitType } from "@/src/types/Habit";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { Button, HelperText, SegmentedButtons, Text, TextInput } from "react-native-paper";
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

export default function ModalCUHabit() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { habits, addHabit, updateHabit } = useHabit();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<HabitType>("binary");
  const [targetValue, setTargetValue] = useState("1");
  const [unit, setUnit] = useState("");
  const [colorTheme, setColorTheme] = useState<"green" | "blue" | "orange" | "purple">("blue");

  const [frequencyDays, setFrequencyDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);

  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = Boolean(id);

  const DAYS_LIST = [
    { id: 1, label: "L" },
    { id: 2, label: "M" },
    { id: 3, label: "X" },
    { id: 4, label: "J" },
    { id: 5, label: "V" },
    { id: 6, label: "S" },
    { id: 0, label: "D" },
  ];

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
    <ScreenView>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <Text variant="headlineSmall" className="font-bold text-text-main">
          {isEditing ? "Editar Hábito" : "Crear Nuevo Hábito"}
        </Text>

        {/* Tipo de Hábito */}
        <View className="gap-2">
          <Text className="text-sm font-semibold text-text-muted">Tipo de Hábito</Text>
          <SegmentedButtons
            value={type}
            onValueChange={(val) => setType(val as HabitType)}
            buttons={[
              { value: "binary", label: "Sí/No" },
              { value: "numeric", label: "Contador" },
              { value: "time", label: "Tiempo" },
            ]}
          />
        </View>

        {/* Nombre */}
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

        {/* Descripción / Categoria */}
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

        {/* Meta cuantitativa (si no es binario) */}
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

        {/* Tema de color */}
        <View className="gap-2 mt-1">
          <Text className="text-sm font-semibold text-text-muted">Color del Ícono</Text>
          <View className="flex-row gap-3">
            {[
              { id: "blue", color: "bg-blue-500" },
              { id: "green", color: "bg-emerald-500" },
              { id: "orange", color: "bg-orange-500" },
              { id: "purple", color: "bg-purple-500" },
            ].map((theme) => (
              <TouchableOpacity
                key={theme.id}
                onPress={() => setColorTheme(theme.id as any)}
                className={`w-10 h-10 rounded-full ${theme.color} items-center justify-center ${
                  colorTheme === theme.id ? "ring-2 ring-offset-2 ring-primary" : ""
                }`}
              />
            ))}
          </View>
        </View>

        {/* Selección de Días de la Semana */}
        <View className="gap-2 mt-2">
          <Text className="text-sm font-semibold text-text-muted">Días activos de la semana</Text>
          <View className="flex-row justify-between">
            {DAYS_LIST.map((day) => {
              const isSelected = frequencyDays.includes(day.id);
              return (
                <TouchableOpacity
                  key={day.id}
                  onPress={() => toggleDay(day.id)}
                  className={`w-10 h-10 rounded-full items-center justify-center border ${
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
        <View className="flex-row justify-end gap-3 mt-6">
          <Button mode="outlined" onPress={() => router.back()} disabled={isSubmitting}>
            Cancelar
          </Button>

          <Button mode="contained" onPress={handleSubmit} loading={isSubmitting} disabled={isSubmitting}>
            {isEditing ? "Guardar Cambios" : "Crear Hábito"}
          </Button>
        </View>
      </ScrollView>
    </ScreenView>
  );
}
