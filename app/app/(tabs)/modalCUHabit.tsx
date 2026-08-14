import { View } from "@/src/components/Themed";
import { useHabit } from "@/src/context/HabitContext";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { Button, HelperText, TextInput, Text } from "react-native-paper";
import * as yup from "yup";

// Esquema de validación con Yup
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
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = Boolean(id);

  // Si viene un ID, cargamos los datos del hábito existente para editar
  useEffect(() => {
    if (id) {
      const existingHabit = habits.find((h) => h.id === id);
      if (existingHabit) {
        setName(existingHabit.name);
        setDescription(existingHabit.description || "");
      }
    }
  }, [id, habits]);

  const handleChangeName = (text: string) => {
    setName(text);
    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: undefined }));
    }
  };

  const handleChangeDescription = (text: string) => {
    setDescription(text);
    if (errors.description) {
      setErrors((prev) => ({ ...prev, description: undefined }));
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setErrors({});

      // Validar datos con Yup
      const validatedData = await habitSchema.validate(
        { name, description },
        { abortEarly: false }
      );

      if (isEditing && id) {
        await updateHabit(id, validatedData.name, validatedData.description);
      } else {
        await addHabit(validatedData.name, validatedData.description);
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
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-4 gap-4">
      <Text variant="headlineSmall" className="font-bold mb-2">
        {isEditing ? "Editar Hábito" : "Crear Nuevo Hábito"}
      </Text>

      <View className="gap-1 mb-2">
        <TextInput
          label="Nombre del hábito *"
          value={name}
          onChangeText={handleChangeName}
          error={!!errors.name}
          mode="outlined"
          placeholder="Ej: Meditar 10 minutos"
        />
        {errors.name && (
          <HelperText type="error" visible={!!errors.name}>
            {errors.name}
          </HelperText>
        )}
      </View>

      <View className="gap-1 mb-4">
        <TextInput
          label="Descripción (opcional)"
          value={description}
          onChangeText={handleChangeDescription}
          error={!!errors.description}
          mode="outlined"
          multiline
          numberOfLines={3}
          placeholder="Ej: Todos los días al despertar antes del desayuno"
        />
        {errors.description && (
          <HelperText type="error" visible={!!errors.description}>
            {errors.description}
          </HelperText>
        )}
      </View>

      <View className="flex-row justify-end gap-3 mt-4">
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
    </ScrollView>
  );
}
