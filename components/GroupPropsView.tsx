import { View, Text, TextInput, Button } from "react-native";
import { Pressable } from "react-native-gesture-handler";

import containers from "@/styles/containers";
import fonts from "@/styles/fonts";
import forms from "@/styles/forms";

export default function GroupPropsView() {
  return (
    <View style={containers.popup}>
      <View style={containers.rowApart}>
        <Text style={fonts.stdHeader}>
          Group name:
        </Text>
        <TextInput
          onChangeText={onChangeGroupName}
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
          onPress={addGroup}
        />
      </View>
    </View>
  )
};