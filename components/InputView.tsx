import { View, Text, TextInput, Pressable } from "react-native";
import { useState } from "react";

import containers from "@/styles/containers";

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
        placeholder="type in name"
        maxLength={12}
        style={{
          height: 32,
          fontSize: 18,
          paddingBottom: 5,
          paddingTop: 5,
          paddingLeft: 10,
        }}
      />
      <Pressable
        onPress={saveValue}
        disabled={!inputValue ? true : false}
        style={{
          backgroundColor: `${!inputValue ? "#dadddf" : "#2196F3"}`,
          borderRadius: 4,
          marginLeft: "auto",
          justifyContent: "center",
          paddingHorizontal: 6
        }}
      >
        <Text
          style={{
            color: `${!inputValue ? "#999999" : "#ffffff"}`
          }}
        >
          SAVE
        </Text>
      </Pressable>
    </View>
  )
}