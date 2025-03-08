import { View, Text, Button } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";

import InputView from "./InputView";
import GroupPropsView from "./GroupPropsView";

import containers from "@/styles/containers";
import fonts from "@/styles/fonts";

import shortenValue from "../helpers/shortenValue";

type Props = {
  groupName: string,
  groupValue: number,
  groupColor: string,
  earnings: boolean,
  altName: string,
  expensesTotal: number,
  editable: boolean,
  onChangeProps( altName: string, altColor: string, ogName: string ): void,
  onAddExpense( groupName: string, groupValue: number ): void,
}

export default function GroupView({
  groupName,
  groupValue,
  groupColor,
  earnings,
  altName,
  onChangeProps,
  expensesTotal,
  onAddExpense,
  editable,
}: Props) {

  const [ groupMenu, toggleGroupMenu ] = useState(false);
  const [ groupProps, toggleGroupProps ] = useState(false);

  const percentage = groupValue === 0 ? 0 : (groupValue / expensesTotal);

  const toggleAddExpense = () => editable && toggleGroupMenu(!groupMenu);

  const changeProps = (altName: string, altColor: string) => {
    onChangeProps(altName.trim(), altColor, groupName.trim())
    toggleGroupProps(false);
    toggleGroupMenu(false);
  };

  const addExpense = (valueInput: string) => {
    if (!Number(valueInput)) {
      console.log("invalid input");
      return;
    }
    toggleGroupMenu(false);
    toggleGroupProps(false);
    onAddExpense(groupName.trim(), Number(valueInput));
  };

  return (
    <View style={{
        ...containers.stdList,
        paddingBottom: 5,
        borderBottomWidth: .5
    }}>
      <LinearGradient
        style={containers.gradient}
        colors={[`${groupColor}25`, "transparent"]}
        start={{ x: 0, y: 0}}
        end={{ x: 1, y: 1}}
        locations={[percentage, percentage]}
        dither={false}
      >
        <Pressable
          onPress={toggleAddExpense}
          style={{
            ...containers.rowApart,
            width: "100%",
            gap: 10,
          }}
        >
          <Text style={{
            color: `${groupColor}`,
            fontSize: 24,
            lineHeight: 40,
          }}>
            {altName ? altName : groupName}
          </Text>
          <Text style={fonts.bigHeader}>
            {groupValue >= 1000000 ? shortenValue(groupValue) : groupValue}
          </Text>          
        </Pressable>
      </LinearGradient>

      {groupMenu && (
        <View style={containers.stdList}>
          <View style={containers.rowApart}>
            <Button
              title="change properties"
              onPress={() => toggleGroupProps(!groupProps)}
              color={groupProps ? "#63b5f6" : "#2196F3"}
            />
            <InputView
              defaultValue=""
              onSaveValue={addExpense}
            />
          </View>
          {
            groupProps && (
              <GroupPropsView
                onSaveData={changeProps}
                defaultName={altName ? altName : groupName}
                defaultColor={groupColor}
              />
            )
          }
        </View>
      )}

    </View>
  )
}