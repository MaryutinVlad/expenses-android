import { View, Text, TextInput, Button } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { useState } from "react";

import colors from "../helpers/colors.json";

import containers from "@/styles/containers";
import fonts from "@/styles/fonts";
import forms from "@/styles/forms";
import assets from "@/styles/assets";

type Props = {
  onSaveData: ( groupName: string, pickedColor: string) => void;
};

export default function GroupPropsView({ onSaveData }: Props) {

  const [ groupName, setGroupName ] = useState("");
  const [ pickedColor, setPickedColor ] = useState("#007AFF");

  const saveData = () => {
    onSaveData(groupName, pickedColor);
    setGroupName("");
    setPickedColor("#007AFF");
  };

  return (
    <View style={containers.popup}>
      <View style={containers.rowApart}>
        <Text style={fonts.stdHeader}>
          Group name:
        </Text>
        <TextInput
          onChangeText={setGroupName}
          defaultValue={groupName}
          maxLength={15}
          placeholder="type in group name"
          style={forms.textInput}
        />
      </View>
      <View>
        <Text style={fonts.stdHeader}>
          Pick group color: &#x2193;
        </Text>
        <View style={containers.colorPalette}>
          {
            colors.map(color => (
              <Pressable
                key={color}
                onPress={() => setPickedColor(color)}
                style={containers.color}
              >
                <View
                  style={{
                    backgroundColor: color,
                    ...assets.color
                  }}
                />
              </Pressable>
            ))
          }
        </View>
        <Button
          title="save"
          color={pickedColor}
          onPress={saveData}
          disabled={groupName ? false : true}
        />
      </View>
    </View>
  )
};