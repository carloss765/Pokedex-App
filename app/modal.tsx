import { Text, View } from "react-native";

export default function Modal({ showModal, setShowModal }: { showModal: boolean, setShowModal: (showModal: boolean) => void }) {
  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <Text>Modal</Text>
    </View>
  )
}
