import { View, Text, Button, StyleSheet, TextInput } from "react-native";
import { useState } from "react";
import colors from "../helpers/colors.json";

import GroupsView from "@/components/GroupsView";

import { Group, ExpensesEntry } from "@/app";
import { Pressable } from "react-native-gesture-handler";

type Props = {
  onAddGroup(groupName: string, groupColor: string): void,
  onAddExpense(groupName: string, groupValue: number): void,
  groups: Group[],
  expenses: ExpensesEntry[],
  dateKey: string,
};

export default function ContentView({
  onAddGroup,
  groups,
  expenses,
  dateKey,
  onAddExpense,
}: Props) {

  const [ isAddingGroup, setIsAddingGroup ] = useState(false);
  const [ isSaveLoadOpen, setSaveLoadOpen ] = useState(false);
  const [ pickedColor, setPickedColor ] = useState("#007AFF");
  const [ groupName, onChangeGroupName ] = useState("");
  const [ filter, setFilter ] = useState(2);
  const [ encodedData, setEncodedData ] = useState("press encode button to generate exportable data here")

  const toggleGroupPopup = () => {
    setIsAddingGroup(!isAddingGroup);
    setSaveLoadOpen(false);
    onChangeGroupName("");
    setPickedColor("#007AFF");
  }

  const toggleSaveLoadPopup = () => {
    setSaveLoadOpen(!isSaveLoadOpen);
    setIsAddingGroup(false);
  }

  const addGroup = () => {
    onAddGroup(groupName, pickedColor);
    setIsAddingGroup(false);
    onChangeGroupName("");
    setPickedColor("#007AFF")
  }

  const encodeData = () => {
    let encodedExpenses = btoa(JSON.stringify(expenses))
    let decodedExpenses = atob(encodedExpenses)
    console.log(encodedExpenses);
    console.log(decodedExpenses);
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        <Button
          title='Add group'
          onPress={toggleGroupPopup}
          color={isAddingGroup ? "#63b5f6" : "#2196F3"}
        />
        <Button
          title='Save/Load'
          onPress={toggleSaveLoadPopup}
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
                  onChangeText={onChangeGroupName}
                  defaultValue={groupName}
                  maxLength={15}
                  placeholder="type in group name"
                  style={{fontSize: 20, textDecorationLine: "underline", color: pickedColor, width: "60%" }}
                />
              </View>
              <View>
                <Text style={{fontSize: 20}}>
                  Pick group color: &#x2193;
                </Text>
                <View style={{
                  width: 328,
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 8,
                  marginHorizontal: "auto",
                  marginVertical: 10,
                }}>
                  {
                    colors.map(color => (
                      <Pressable
                        key={color}
                        onPress={() => setPickedColor(color)}
                        style={{ width: 40, height: 40, borderWidth: .5, borderRadius: 3 }}
                      >
                        <View
                          style={{backgroundColor: color, width: 35, height: 35, margin: "auto", borderRadius: 3}}
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
        }
        {
          isSaveLoadOpen && (
            <View style={styles.saveLoadContainer}>
              <View>
                <Text style={{fontSize: 20}}>Export</Text>
                <Text style={{ maxHeight: 30 ,maxWidth: "80%", overflow: "hidden"}}>{encodedData}</Text>
                <Button
                  title="encode"
                  onPress={encodeData}
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
    marginVertical: 5,
  },
  addGroupContainer: {
    marginTop: 10,
  },
  saveLoadContainer: {
    width: "100%",
    height: "30%",
  },
  addGroupInput: {
    flexDirection: 'row',
    alignItems: "center",
    gap: 10,
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