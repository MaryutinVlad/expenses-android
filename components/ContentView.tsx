import { View, Text, Button } from "react-native";
import { useState } from "react";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";

import GroupsView from "./GroupsView";
import GroupPropsView from "./GroupPropsView";
import SwitchView from "./SwitchView";

import containers from "@/styles/containers";
import fonts from "@/styles/fonts";

import { Group, ExpensesEntry } from "@/types/types";

type Props = {
  onAddGroup(groupName: string, pickedColor: string, earnings: boolean): void,
  onAddExpense(groupName: string, groupValue: number): void,
  onImportData(expenses: ExpensesEntry[], groups: Group[], relevantOn: string): void,
  onChangeProps(altName: string, altColor: string, ogName: string): void,
  onSwitchMonth(next: boolean): void,
  selectedMonthIndex: number,
  groups: Group[],
  expenses: ExpensesEntry[],
  dateKey: string,
};

export default function ContentView({
  onAddGroup,
  groups,
  expenses,
  dateKey,
  selectedMonthIndex,
  onChangeProps,
  onAddExpense,
  onImportData,
  onSwitchMonth,
}: Props) {

  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [isSaveLoadOpen, setSaveLoadOpen] = useState(false);
  const [filter, setFilter] = useState(2);
  const [fileWorkingState, setFileWorkingState] = useState(["waiting..."]);
  const [filesToImport, setFilesToImport] = useState([""]);
  const { StorageAccessFramework } = FileSystem;
  const date = new Date();

  const toggleGroupPopup = () => {
    setFileWorkingState(["waiting..."]);
    setIsAddingGroup(!isAddingGroup);
    setSaveLoadOpen(false);
    setFilesToImport([""]);
  };

  const toggleSaveLoadPopup = () => {
    setFileWorkingState(["waiting..."]);
    setSaveLoadOpen(!isSaveLoadOpen);
    setIsAddingGroup(false);
    setFilesToImport([""]);
  };

  const addGroup = (groupName: string, pickedColor: string, earnings: boolean) => {
    onAddGroup(groupName.trim(), pickedColor, earnings);
    setIsAddingGroup(false);
  };

  const switchMonth = (next: boolean) => {
    return onSwitchMonth(next);
  };

  const exportData = async () => {

    setFileWorkingState(["waiting..."]);
    let uri = "content://com.android.externalstorage.documents/tree/primary%3ADownload%2FTelegram";
    const fileKey = `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`;
    const fileContent = {
      expenses,
      groups,
      relevantOn: date.toLocaleDateString("en-US")
    };
    let fileUri = "";

    await StorageAccessFramework.readDirectoryAsync(uri)
      .then(async (files) => {

        setFileWorkingState(["permission granted"]);

        const fileMatched = files.find(file => file.match(fileKey));

        if (fileMatched) {
          await StorageAccessFramework.deleteAsync(fileMatched)
            .then(() => setFileWorkingState(cur => [...cur, "duplicate file deleted"]))
            .catch(() => setFileWorkingState(cur => [...cur, "error while deleting duplicate file"]));
        }

        await StorageAccessFramework.createFileAsync(uri, fileKey, "application/json")
          .then(result => fileUri = result)
          .catch(() => setFileWorkingState(cur => [...cur, "error while creating file"]));

        await StorageAccessFramework.writeAsStringAsync(fileUri, JSON.stringify(fileContent))
          .then(() => setFileWorkingState(cur => [...cur, "data exported"]))
          .catch(() => setFileWorkingState(cur => [...cur, "error while writing into file"]));
      })
      .catch(async () => {

        setFileWorkingState(["requesting permission"]);
        await StorageAccessFramework.requestDirectoryPermissionsAsync()
          .then(response => {
            if (response.granted) {
              setFileWorkingState(cur => [...cur, "permission granted"]);
            }
          })
          .catch(() => setFileWorkingState(cur => [...cur, "error on permission request"]))
      })
  };

  const pickFileToImport = async () => {

    setFileWorkingState(["waiting..."]);

    let uri = "content://com.android.externalstorage.documents/tree/primary%3ADownload%2FTelegram";

    await StorageAccessFramework.readDirectoryAsync(uri)
      .then(files => {
        const relevantFiles = files.filter(file => file.match(/\d{1,2}_\d{1,2}_\d{4,}(\S{1,})?.json/));
        setFileWorkingState(cur => [...cur, "choose file for import"]);
        setFilesToImport(relevantFiles);
      })
      .catch(async () => {

        setFileWorkingState(["requesting permission"]);

        await StorageAccessFramework.requestDirectoryPermissionsAsync()
          .then(response => {
            if (response.granted) {
              setFileWorkingState(cur => [...cur, "permission granted"]);
            }
          })
          .catch(() => setFileWorkingState(cur => [...cur, "error on permission request"]))
      });
    /*await DocumentPicker.getDocumentAsync()
      .then(document => {
        if (document === null || document.assets === null) {
          setFileWorkingState(["the file is irrelevant"]);
          return;
        } else {
          setFileWorkingState(["file picked"]);
          StorageAccessFramework.readAsStringAsync(document.assets[0].uri)
            .then(data => {
              const { expenses, groups, relevantOn } = JSON.parse(data);
              setFileWorkingState(cur => [...cur, "file imported for merging"]);
              onImportData(expenses, groups, relevantOn);
            })
            .catch(() => setFileWorkingState(cur => [...cur, "error while reading file"]));
        }
      })
      .catch(() => setFileWorkingState(cur => [...cur, "error while picking file"]));*/
  };

  return (
    <View style={containers.stdList}>
      <View style={containers.rowApart}>
        <SwitchView
          onSwitchMonth={() => switchMonth(false)}
          reversed={true}
          disabled={selectedMonthIndex === 0 ? true : false}
        />
        <Button
          title='Add group'
          onPress={toggleGroupPopup}
          color={isAddingGroup ? "#63b5f6" : "#2196F3"}
        />
        <Button
          title='Save/Load'
          onPress={toggleSaveLoadPopup}
          color={isSaveLoadOpen ? "#63b5f6" : "#2196F3"}
        />
        <SwitchView
          onSwitchMonth={() => switchMonth(true)}
          reversed={false}
          disabled={selectedMonthIndex === expenses.length - 1 ? true : false}
        />
      </View>
      <View style={containers.stdList}>
        {
          isAddingGroup && (
            <GroupPropsView
              onSaveData={(groupName, pickedColor, groupType) => addGroup(groupName, pickedColor, groupType)}
              defaultName=""
              defaultColor="#016180"
              switchableType={true}
              groups={groups.map(group => group.groupName)}
            />
          )
        }
        {
          isSaveLoadOpen && (
            <View style={containers.popup}>
              <Text style={fonts.stdHeader}>Data import and export</Text>
              {
                fileWorkingState.map((state, index) => (
                  <Text
                    style={{ fontSize: 16 }}
                    key={`state-key-${index}`}
                  >
                    &#187; {state}
                  </Text>
                ))
              }
              {
                filesToImport[0] && filesToImport.map((file, index) => {
                  
                  const preRender = file
                    .split("%")
                    .filter(part => part.match(".json") || part.match(/\d{1,2}_\d{1,2}_\d{4,}/));

                  const toRender = preRender.length === 2 ?
                    preRender.join("20").replace(/2F/, "") :
                    preRender[0].replace(/2F/, "");

                  return (
                    <View
                      key={`file-to-import-${index}`}
                      style={containers.rowTogether}
                    >
                      <Text>{toRender}</Text>
                    </View>
                  )
                })
              }
              <View style={containers.rowTogether}>
                <Button
                  title="export file"
                  onPress={exportData}
                />
                <Button
                  title="import file"
                  onPress={pickFileToImport}
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
              disabled//={filter === 0 ? true : false}
              onPress={() => setFilter(0)}
            />
            <Button
              title="week"
              disabled//={filter === 1 ? true : false}
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
          dateKey={expenses[selectedMonthIndex].date}
          onChangeProps={onChangeProps}
          onAddExpense={onAddExpense}
          editable={dateKey === expenses[selectedMonthIndex].date ? true : false}
        />
      </View>
    </View>
  )
}