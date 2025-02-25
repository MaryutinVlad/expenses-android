import { View, Text, TextInput } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { useState } from "react";

import containers from "@/styles/containers";
import forms from "@/styles/forms";

type Props = {
  defaultValue: string,
  onSaveValue: (inputValue: string) => void,
}

export default function InputView({
  defaultValue,
  onSaveValue,
}: Props) {

  const [ inputValue, setInputValue ] = useState(defaultValue);

  const saveValue = () => {
    onSaveValue(inputValue);
  };

  return (
    <View style={containers.input}>
      <TextInput
        value={inputValue}
        onChangeText={setInputValue}
        placeholder="type in value"
        maxLength={15}
        style={forms.textInput}
      />
      <Pressable
        onPress={saveValue}
        disabled={!inputValue ? true : false}
        style={{
          backgroundColor: `${!inputValue ? "#dadddf" : "#2196F3"}`,
          ...forms.submit,
        }}
      >
        <Text style={{ color: `${!inputValue ? "#999999" : "#ffffff"}` }}>
          SAVE
        </Text>
      </Pressable>
    </View>
  )
}