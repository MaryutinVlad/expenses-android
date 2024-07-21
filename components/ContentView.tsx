import { View, Text, Button, StyleSheet, TextInput } from "react-native";
import { useState } from "react";
import Slider from "@react-native-community/slider";

import GroupsView from "@/components/GroupsView";

import { Group, ExpensesEntry } from "@/app/(tabs)";

type Tints = {
  r: string,
  g: string,
  b: string,
}

type Props = {
  onAddGroup(groupName: string, groupColor: string): void,
  onAddExpense(groupName: string, groupValue: number): void,
  groups: Group[],
  expenses: ExpensesEntry[],
  dateKey: string,
};

let hexTint = "00";

const colorPalette = {
  r: "00",
  g: "00",
  b: "00",
};

export default function ContentView({
  onAddGroup,
  groups,
  expenses,
  dateKey,
  onAddExpense,
}: Props) {

  const [ isAddingGroup, setIsAddingGroup ] = useState(false);
  const [ pickedColor, setPickedColor ] = useState("#000000");
  const [ groupName, setGroupName ] = useState("");
  const [ filter, setFilter ] = useState(2);

  const toggleGroupPopup = () => {
    setIsAddingGroup(!isAddingGroup)
  }

  const changeColor = (value:number, tint: string) => {

    hexTint = Math.round(value).toString(16);

    if (hexTint.length === 1) {
      hexTint = '0' + hexTint;
    }

    colorPalette[tint as keyof Tints] = hexTint;

    setPickedColor("#" + colorPalette.r + colorPalette.g + colorPalette.b);
  }

  const addGroup = () => {
    onAddGroup(groupName, pickedColor);
    setIsAddingGroup(false);
    setGroupName("");
    hexTint = "0";
    colorPalette.r = "00";
    colorPalette.g = "00";
    colorPalette.b = "00";
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        <Button
          title='Add group'
          onPress={toggleGroupPopup}
        />
      </View>
      <View>
        {
          isAddingGroup && (
            <View style={styles.addGroupContainer}>
              <View style={styles.addGroupInput}>
                <Text style={{fontSize: 20}}>
                  Group name:
                </Text>
                <TextInput
                  onChangeText={setGroupName}
                  value={groupName}
                  placeholder="type in group name"
                  style={{fontSize: 20, textDecorationLine: "underline", color: pickedColor}}
                />
              </View>
              <View>
                <Text style={{fontSize: 20}}>
                  Pick group color: &#x2193;
                </Text>
                <Slider
                  style={{width: '100%', height: 50}}
                  onValueChange={(value) => changeColor(value, "r")}
                  minimumValue={0}
                  maximumValue={255}
                  minimumTrackTintColor={pickedColor}
                  maximumTrackTintColor={pickedColor}
                />
                <Slider
                  style={{width: '100%', height: 50}}
                  onValueChange={(value) => changeColor(value, "g")}
                  minimumValue={0}
                  maximumValue={255}
                  minimumTrackTintColor={pickedColor}
                  maximumTrackTintColor={pickedColor}
                />
                <Slider
                  style={{width: '100%', height: 50}}
                  onValueChange={(value) => changeColor(value, "b")}
                  minimumValue={0}
                  maximumValue={255}
                  minimumTrackTintColor={pickedColor}
                  maximumTrackTintColor={pickedColor}
                />
                <Button
                  title="save"
                  onPress={addGroup}
                />
              </View>
            </View>
          )
        }
        <View style={styles.filter}>
          <Text style={{fontSize: 22, verticalAlign: 'bottom'}}>
            Filter by:
          </Text>
          <View style={styles.filterButtons}>
            <Button
              title="day"
              disabled={filter === 0 ? true : false}
              onPress={() => setFilter(0)}
            />
            <Button
              title="week"
              disabled={filter === 1 ? true : false}
              onPress={() => setFilter(1)}
            />
            <Button
              title="month"
              disabled={filter === 2 ? true : false}
              onPress={() => setFilter(2)}
            />
          </View>
        </View>
        <GroupsView
          groups={groups}
          expenses={expenses}
          filter={filter}
          dateKey={dateKey}
          onAddExpense={onAddExpense}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addGroupContainer: {
    marginTop: 20,
  },
  addGroupInput: {
    flexDirection: 'row',
    gap: 10,
  },
  addGroupSliders: {

  },
  filter: {
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'space-between',
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  filterButton: {
    backgroundColor: 'black'
  }
});