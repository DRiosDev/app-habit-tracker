import { Text, View } from "@/src/components/Themed";
import { Button, Card } from "react-native-paper";

export default function TabOneScreen() {
  return (
    <View className="flex-1 p-4">
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
            onPress={() => console.log("Hábito completado")}
          >
            Completar
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
}
