import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, Button } from "react-native";
import { useState } from "react";

import type { ReactElement } from "react";
import type { Group } from "@/app";

export type UserProps = {
  name: string,
  avatar: ReactElement,
  groups: Group[],
  onChangeName(nameInput: string): void,
  onRemoveGroup(groupTargeted: string): void,
  onRemoveGroups(): void,
}

export default function User({name, avatar, groups, onChangeName, onRemoveGroup, onRemoveGroups} : UserProps) {

  const [ areSettingsShown, setAreSettingsShown ] = useState(false);
  const [ nameInput, setNameInput ] = useState(name);
  const [ groupTargeted, setGroupTargeted ] = useState("");
  const [ isConfirmationShown, setIsConfirmationShown ] = useState(false);

  const toggleSettings = () => {
    setAreSettingsShown(!areSettingsShown);
    setNameInput(name);
    setIsConfirmationShown(false);
    setGroupTargeted("");
  };

  const changeName = () => {
    onChangeName(nameInput);
  };

  const removeGroup = () => {
    onRemoveGroup(groupTargeted);
    setGroupTargeted("");
  };

  const toggleConfirmation = () => {
    setIsConfirmationShown(!isConfirmationShown);
  };

  const removeGroups = () => {
    setIsConfirmationShown(!isConfirmationShown);
    onRemoveGroups();
  };

  return (
    <View style={styles.container}>
      <View style={styles.upper}>
        <View style={styles.user}>
          {avatar}
          <Text
           style={styles.username}
          >
            {name}
          </Text>
        </View>
        <TouchableOpacity
          onPress={toggleSettings}
        >
          <Image
            style={styles.settingsIcon}
            source={require("@/assets/images/settings.png")}
          />
        </TouchableOpacity>
      </View>
      {
        areSettingsShown && (
          <View style={styles.settingsContainer}>
            <View style={styles.settingsItem}>
              <Text style={styles.settingsItemTitle}>Change name:</Text>
              <TextInput
                style={{
                  textDecorationLine: "underline",
                  fontSize: 18,
                  backgroundColor: "#EBEBE4",
                  textAlign: "center",
                  borderRadius: 10,
                  paddingHorizontal: 10,
                  marginRight: "auto"
                }}
                value={nameInput}
                onChangeText={setNameInput}
                placeholder="type in name"
                maxLength={15}
              />
              <Button
                title="save"
                onPress={changeName}
                disabled={!nameInput ? true : false}
              />
            </View>
            <View style={styles.settingsItem}>
              <Text style={styles.settingsItemTitle}>Change avatar (not implemented)</Text>
              <Button
                title="file"
                disabled
              />
            </View>
            <View style={styles.settingsItem}>
              <Text style={styles.settingsItemTitle}>Delete group:</Text>
              <View style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                width: "50%",
                flexWrap: "wrap",
                gap: 5
              }}>{
                groupTargeted ? (
                  <View style={{
                    flexDirection: "row",
                    gap: 30,
                  }}>
                    <Button
                      title="yes"
                      onPress={removeGroup}
                    />
                    <Button
                      title="no"
                      onPress={() => setGroupTargeted("")}
                    />
                  </View>
                ) :
                  groups.map(group => (
                    <Button
                      key={group.groupName + "-delete"}
                      title={group.groupName}
                      color={group.groupColor}
                      onPress={() => setGroupTargeted(group.groupName)}
                    />
                  ))
                }
              </View>
            </View>
            <View style={styles.settingsItem}>
              <Text style={styles.settingsItemTitle}>{ isConfirmationShown ? "Are you sure ?" : "Delete all groups"}</Text>
              {
                isConfirmationShown ? (
                  <View style={{
                    flexDirection: "row",
                    gap: 30,
                  }}>
                    <Button
                      title="yes"
                      onPress={removeGroups}
                    />
                    <Button
                      title="no"
                      onPress={toggleConfirmation}
                    />
                  </View>
                ) : (
                  <Button
                    title="delete"
                    onPress={toggleConfirmation}
                  />
                )
              }
            </View>
          </View>
        )
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: .5,
    marginTop: 5,
    paddingTop: 10,
  },
  upper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  user: {
    flexDirection: 'row',
    gap: 10,
  },
  username: {
    fontSize: 30,
    textAlignVertical: 'bottom',
    fontWeight: '400',
    lineHeight: 35,
  },
  settingsIcon: {
    width: 35,
    height: 35,
  },
  settingsContainer: {
    gap: 14,
    marginTop: 10,
    borderWidth: .5,
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 9,
  },
  settingsItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 5,
  },
  settingsItemTitle: {
    fontSize: 17,
  },
})