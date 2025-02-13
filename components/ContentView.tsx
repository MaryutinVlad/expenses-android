import { View, Text, Button, StyleSheet, TextInput } from "react-native";
import { useState } from "react";
import colors from "../helpers/colors.json";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";

import GroupsView from "@/components/GroupsView";

import { Group, ExpensesEntry } from "@/app";
import { Pressable } from "react-native-gesture-handler";

type Props = {
  onAddGroup(groupName: string, groupColor: string): void,
  onAddExpense(groupName: string, groupValue: number): void,
  onImportData(expenses: ExpensesEntry[], groups: Group[], relevantOn: string): void,
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
  onImportData,
}: Props) {

  const [ isAddingGroup, setIsAddingGroup ] = useState(false);
  const [ isSaveLoadOpen, setSaveLoadOpen ] = useState(false);
  const [ pickedColor, setPickedColor ] = useState("#007AFF");
  const [ groupName, onChangeGroupName ] = useState("");
  const [ filter, setFilter ] = useState(2);
  const { StorageAccessFramework } = FileSystem;
  const date = new Date();

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

  const exportData = async () => {
    
    const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();

    if (permissions.granted) {

      const uri = permissions.directoryUri;
      const fileKey = `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`;
      const fileContent = {
        expenses,
        groups,
        relevantOn: date.toLocaleDateString()
      };
      let fileUri = "";

      await StorageAccessFramework.readDirectoryAsync(uri)
        .then(files => files.find(file => file.match(fileKey)))
        .then(fileMatched => {

          if (!fileMatched) {
            return;

          } else {
            StorageAccessFramework.deleteAsync(fileMatched)
              .then(() => console.log("duplicate file deleted"))
              .catch(err => console.log("error while deleting duplicate file" + " " + err));
          }
        })
        .catch(err => console.log("error while searching for and deleting duplicate file:" + " " + err));

        
      await StorageAccessFramework.createFileAsync(uri, fileKey, "application/json")
        .then(result => fileUri = result)
        .catch(err => console.log("error while creating new file:" + " " + err));

      await StorageAccessFramework.writeAsStringAsync(fileUri, JSON.stringify(fileContent))
        .then(() => console.log("data exported"))
        .catch(err => console.log("error while writing into new file:" + " " + err));

    } else {
      return;
    }
  }

  const importData = async () => {
    await DocumentPicker.getDocumentAsync()
      .then(document => {
        if (document === null || document.assets === null) {
          return;
        } else {
          StorageAccessFramework.readAsStringAsync(document.assets[0].uri)
            .then(data => {
              const {expenses, groups, relevantOn} = JSON.parse(data);
              onImportData(expenses, groups, relevantOn);
            })
            .catch(err => console.log("error while reading document:" + " " + err));
        }
      })
      .catch(err => console.log("error while getting document:" + " " + err));
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
            <View>
              <Text style={{fontSize: 20}}>Data import and export</Text>
              <View style={{flexDirection: "row", gap: 10}}>
                <Button
                  title="export file"
                  onPress={exportData}
                />
                <Button
                  title="import file"
                  onPress={importData}
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