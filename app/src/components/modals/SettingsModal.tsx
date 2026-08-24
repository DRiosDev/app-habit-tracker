import { Modal, Portal, Text } from "react-native-paper";

type Props = {
  visible: boolean;
  onDismiss: () => void;
};

export default function SettingsModal({ visible, onDismiss }: Props) {
  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss}>
        <Text>Configuraciones</Text>
      </Modal>
    </Portal>
  );
}
