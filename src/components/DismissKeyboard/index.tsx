import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function DismissKeyboard({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SafeAreaView>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          {children}
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </>
  );
}
