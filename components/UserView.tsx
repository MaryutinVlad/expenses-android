import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, Button, Pressable } from "react-native";
import { useState } from "react";

import type { ReactElement } from "react";
import type { Group } from "@/app";

import InputView from "./InputView";

import containers from "@/styles/containers";
import assets from "@/styles/assets";
import texts from "@/styles/texts";

export type UserProps = {
  name: string,
  avatar: ReactElement,
  groups: Group[],
  onChangeName(nameInput: string): void,
  onRemoveGroup(id: string, name: string): void,
  onRemoveGroups(): void,
}

export default function User({name, avatar, groups, onChangeName, onRemoveGroup, onRemoveGroups} : UserProps) {

  const [ areSettingsShown, setAreSettingsShown ] = useState(false);
  const [ groupTargeted, setGroupTargeted ] = useState({ id: "", name: ""});
  const [ isConfirmationShown, setIsConfirmationShown ] = useState(false);

  const toggleSettings = () => {
    if (!areSettingsShown) {
      setIsConfirmationShown(false);
      setGroupTargeted({ id: "", name: ""});
    }
    setAreSettingsShown(!areSettingsShown);
  };

  const changeName = (nameInput:string) => {
    onChangeName(nameInput);
  };

  const removeGroup = () => {
    onRemoveGroup(groupTargeted.id, groupTargeted.name);
    setGroupTargeted({ id: "", name: ""});
  };

  const toggleConfirmation = () => {
    setIsConfirmationShown(!isConfirmationShown);
  };

  const removeGroups = () => {
    setIsConfirmationShown(!isConfirmationShown);
    onRemoveGroups();
  };

  return (
    <View style={containers.header}>
      <View style={containers.profile}>
        <View style={containers.profileInfo}>
          {avatar}
          <Text style={texts.username}>
            {name}
          </Text>
        </View>
        <TouchableOpacity
          onPress={toggleSettings}
        >
          <Image
            style={assets.icon}
            source={require("@/assets/images/settings.png")}
          />
        </TouchableOpacity>
      </View>
      {
        areSettingsShown && (
          <View style={styles.settingsContainer}>
            <View style={styles.settingsItem}>
              <Text style={styles.settingsItemTitle}>Change name:</Text>
              <InputView
                defaultValue={name}
                onSaveValue={changeName}
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
                groupTargeted.id ? (
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
                      onPress={() => setGroupTargeted({ id: "", name: ""})}
                    />
                  </View>
                ) :
                  groups.map(group => (
                    <Button
                      key={group.id}
                      title={group.groupName}
                      color={group.groupColor}
                      onPress={() => setGroupTargeted({ id: group.id, name: group.groupName })}
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
  settingsContainer: {
    gap: 14,
    marginTop: 10,
    borderWidth: .5,
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 14
  },
  settingsItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 5,
  },
  settingsItemTitle: {
    fontSize: 21,
    paddingTop: 3
  },
})