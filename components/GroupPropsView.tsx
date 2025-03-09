import { View, Text, TextInput, Button } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { useState } from "react";

import colors from "../helpers/colors.json";

import containers from "@/styles/containers";
import fonts from "@/styles/fonts";
import forms from "@/styles/forms";
import assets from "@/styles/assets";

type Props = {
  onSaveData: ( groupName: string, pickedColor: string) => void,
  defaultName: string,
  defaultColor: string,
  groups: string[],
};

export default function GroupPropsView({
  onSaveData,
  defaultName,
  defaultColor,
  groups,
}: Props) {

  const [ groupName, setGroupName ] = useState(defaultName);
  const [ pickedColor, setPickedColor ] = useState(defaultColor);
  const [ errorMessageShown, setErrorMessageShown ] = useState(false);

  const saveData = () => {
    setErrorMessageShown(false);
    onSaveData(groupName, pickedColor);
    setGroupName("");
    setPickedColor(defaultColor);
  };

  return (
    <View style={containers.popup}>
      <View style={containers.rowApart}>
        <Text style={fonts.stdHeader}>
          Group name:
        </Text>
        <TextInput
          onChangeText={(text) => {
            if (groups.length && (groups.findIndex(group => group === text.trim())) !== -1) {
              setErrorMessageShown(true);
            } else {
              setErrorMessageShown(false);
            }
            setGroupName(text);
          }}
          defaultValue={defaultName}
          maxLength={15}
          autoCorrect={false}
          placeholder="type in group name"
          style={{
            ...forms.textInput,
            color: pickedColor,
          }}
        />
      </View>
      {
        errorMessageShown && (
          <Text style={{color: "red"}}>&#187; Group with this name already exists</Text>
        )
      }
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
                    boxShadow: `${ pickedColor === color ? "0 0 0 3px #413e3e" : "none"}`,
                    ...assets.color,
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
          disabled={(!groupName || errorMessageShown) ? true : false}
        />
      </View>
    </View>
  )
};