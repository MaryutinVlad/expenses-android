import { View, Text, Image, TouchableOpacity, Button } from "react-native";
import { useState } from "react";

import type { ReactElement } from "react";
import type { Group } from "@/types/types";

import InputView from "./InputView";

import { formateShortDate } from "@/helpers/formateDate";

import containers from "@/styles/containers";
import assets from "@/styles/assets";
import fonts from "@/styles/fonts";

export type UserProps = {
  name: string,
  avatar: ReactElement,
  groups: Group[],
  monthSelected: string,
  onChangeName(nameInput: string): void,
  onRemoveGroup(id: string, name: string): void,
  onRemoveGroups(): void,
}

export default function User({
  name,
  avatar,
  groups,
  monthSelected,
  onChangeName,
  onRemoveGroup,
  onRemoveGroups
} : UserProps) {

  const [ areSettingsShown, setAreSettingsShown ] = useState(false);
  const [ groupTargeted, setGroupTargeted ] = useState({ id: "", name: ""});
  const [ isConfirmationShown, setIsConfirmationShown ] = useState(false);
  const formatedDate = formateShortDate(monthSelected);

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
      <View style={containers.rowApart}>
        {avatar}
        <Text style={fonts.username}>
          {formatedDate}
        </Text>
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
          <View style={containers.popup}>
            <View style={containers.rowApart}>
              <Text style={fonts.titleOnButton}>Change name:</Text>
              <InputView
                defaultValue={name}
                onSaveValue={changeName}
              />
            </View>
            <View style={containers.rowApart}>
              <Text style={fonts.titleOnButton}>Delete group:</Text>
              <View style={containers.halfSizedList}>
                {
                  groupTargeted.id ? (
                    <View style={containers.rowApart}>
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
            <View style={containers.rowApart}>
              <Text style={fonts.titleOnButton}>{ isConfirmationShown ? "Are you sure ?" : "Delete all groups"}</Text>
              {
                isConfirmationShown ? (
                  <>
                    <Button
                      title="yes"
                      onPress={removeGroups}
                    />
                    <Button
                      title="no"
                      onPress={toggleConfirmation}
                    />
                  </>
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