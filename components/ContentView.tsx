import { View, Text, Button, TextInput } from "react-native";
import { useState } from "react";
import colors from "../helpers/colors.json";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";

import GroupsView from "@/components/GroupsView";

import containers from "@/styles/containers";
import forms from "@/styles/forms";
import fonts from "@/styles/fonts";
import assets from "@/styles/assets";

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
    <View style={containers.stdList}>
      <View style={containers.rowApart}>
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
      <View style={containers.stdList}>
        {
          isAddingGroup && (
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
        }
        {
          isSaveLoadOpen && (
            <View style={containers.popup}>
              <Text style={fonts.stdHeader}>Data import and export</Text>
              <View style={containers.rowTogether}>
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
        <View style={{
          ...containers.rowApart,
          ...containers.vertIndent,
        }}>
          <Text style={fonts.titleOnButton}>
            Filter by:
          </Text>
          <View style={containers.rowTogether}>
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