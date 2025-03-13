import { View, Text, TextInput, Button } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { useState } from "react";
import Checkbox from "expo-checkbox";

import colors from "../helpers/colors.json";

import containers from "@/styles/containers";
import fonts from "@/styles/fonts";
import forms from "@/styles/forms";
import assets from "@/styles/assets";

type Props = {
  onSaveData: (groupName: string, pickedColor: string, earnings: boolean) => void,
  defaultName: string,
  defaultColor: string,
  switchableType: boolean,
  groups: string[],
};

export default function GroupPropsView({
  onSaveData,
  defaultName,
  defaultColor,
  switchableType,
  groups,
}: Props) {

  const [groupName, setGroupName] = useState(defaultName);
  const [pickedColor, setPickedColor] = useState(defaultColor);
  const [errorMessageShown, setErrorMessageShown] = useState(false);
  const [groupType, setGroupType] = useState("exp");

  const saveData = () => {
    const groupTypeConverted = groupType === "exp" ? false : true;
    setErrorMessageShown(false);
    onSaveData(groupName, pickedColor, switchableType ? groupTypeConverted : false);
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
          <Text style={{ color: "red" }}>&#187; Group with this name already exists</Text>
        )
      }
      {
        switchableType && (
          <View style={containers.rowApart}>
            <Text style={fonts.stdHeader}>
              Group type:
            </Text>
            <View style={containers.checkbox}>
              <View style={containers.rowTogether}>
                <Checkbox
                  style={{...assets.checkbox}}
                  color="red"
                  value={groupType === "exp" ? true : false}
                  onValueChange={() => setGroupType("exp")}
                />
                <Text style={fonts.smallHeader}>
                  exp
                </Text>
              </View>
              <View style={containers.rowTogether}>
                <Checkbox
                  style={assets.checkbox}
                  color="green"
                  value={groupType === "prof" ? true : false}
                  onValueChange={() => setGroupType("prof")}
                />
                <Text style={fonts.smallHeader}>
                  prof
                </Text>
              </View>
            </View>
          </View>
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
                    boxShadow: `${pickedColor === color ? "0 0 0 3px #413e3e" : "none"}`,
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