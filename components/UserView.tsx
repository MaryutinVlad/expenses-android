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
  onRemoveProfile(): void,
}

export default function User({
  name,
  avatar,
  groups,
  monthSelected,
  onChangeName,
  onRemoveGroup,
  onRemoveGroups,
  onRemoveProfile,
} : UserProps) {

  const [ areSettingsShown, setAreSettingsShown ] = useState(false);
  const [ groupTargeted, setGroupTargeted ] = useState({ id: "", name: ""});
  const [ groupConfirmationShown, setGroupConfirmation ] = useState(false);
  const [ profileConfirmationShown, setProfileConfirmation ] = useState(false);
  const formatedDate = formateShortDate(monthSelected);

  const toggleSettings = () => {
    if (!areSettingsShown) {
      setGroupConfirmation(false);
      setProfileConfirmation(false);
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

  const toggleGroupConfirmation = () => {
    setGroupConfirmation(!groupConfirmationShown);
  };

  const toggleProfileConfirmation = () => {
    setProfileConfirmation(!profileConfirmationShown);
  };

  const removeGroups = () => {
    setGroupConfirmation(!groupConfirmationShown);
    setProfileConfirmation(false);
    onRemoveGroups();
  };

  const removeProfile = () => {
    setProfileConfirmation(!profileConfirmationShown);
    setGroupConfirmation(false);
    onRemoveProfile();
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
              <Text style={fonts.titleOnButton}>{ groupConfirmationShown ? "Are you sure ?" : "Delete all groups"}</Text>
              {
                groupConfirmationShown ? (
                  <>
                    <Button
                      title="yes"
                      onPress={removeGroups}
                    />
                    <Button
                      title="no"
                      onPress={toggleGroupConfirmation}
                    />
                  </>
                ) : (
                  <Button
                    title="delete"
                    onPress={toggleGroupConfirmation}
                  />
                )
              }
            </View>
            <View style={containers.rowApart}>
              <Text style={fonts.titleOnButton}>{ profileConfirmationShown ? "Are you sure ?" : "Delete profile"}</Text>
              {
                profileConfirmationShown ? (
                  <>
                    <Button
                      title="yes"
                      onPress={removeProfile}
                    />
                    <Button
                      title="no"
                      onPress={toggleProfileConfirmation}
                    />
                  </>
                ) : (
                  <Button
                    title="delete"
                    onPress={toggleProfileConfirmation}
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