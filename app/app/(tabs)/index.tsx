import { Text, View } from "@/src/components/Themed";
import { useHabit } from "@/src/context/HabitContext";
import { router } from "expo-router";
import { Button, Card } from "react-native-paper";

export default function TabOneScreen() {
  const { habits, loading } = useHabit();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Cargando hábitos...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-4 gap-4">
      <View>
        <Text>Buenos días, (usuario)</Text>
        <Text>fecha</Text>
      </View>

      <Card className="my-2 p-2">
        <Card.Title title="Racha actual" />
        <Card.Content>
          <Text>Días de racha 7</Text>
        </Card.Content>
      </Card>

      {habits.length > 0 ? (
        <Card className="my-2 p-2">
          <Card.Title title="Hábitos de hoy" />

          <Card.Content>
            <View>
              {habits.map((habit, index) => (
                <Text key={habit.id}>
                  {index + 1}. {habit.name}
                </Text>
              ))}
            </View>
          </Card.Content>
        </Card>
      ) : (
        <Card className="my-2 p-2">
          <Card.Title title="Nuevo Hábito" subtitle="Progreso de hoy" />

          <Card.Content>
            <Text className="text-base font-medium">
              ¡Comienza a registrar tus hábitos diarios!
            </Text>
          </Card.Content>

          <Card.Actions>
            <Button
              mode="contained"
              onPress={() => router.push("/modalCUHabit")}
            >
              Crear hábito
            </Button>
          </Card.Actions>
        </Card>
      )}
    </View>
  );
}
