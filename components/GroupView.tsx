import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";

import shortenValue from "../helpers/shortenValue";
import { Screen } from "expo-router/build/views/Screen";

type Props = {
  groupName: string,
  groupValue: number,
  groupColor: string,
  earnings: boolean,
  expensesTotal: number,
  onAddExpense( groupName: string, groupValue: number ): void,
}

export default function GroupView({
  groupName,
  groupValue,
  groupColor,
  earnings,
  expensesTotal,
  onAddExpense,
}: Props) {

  const [ isAddingExpense, setIsAddingExpense ] = useState(false);
  const [ inputValue, setInputValue ] = useState("");
  const percentage = groupValue === 0 ? 0 : (groupValue / expensesTotal);

  const toggleAddExpense = () => {
    setIsAddingExpense(!isAddingExpense);
    setInputValue("");
  }

  const addExpense = () => {
    if (!Number(inputValue)) {
      console.log("invalid input");
      return
    }
    setIsAddingExpense(false);
    setInputValue("");
    onAddExpense(groupName, Number(inputValue));
  }

  return (
    <LinearGradient
      style={styles.container}
      colors={[`${groupColor}25`, "transparent"]}
      start={{ x: 0, y: 0}}
      end={{ x: 1, y: 1}}
      locations={[percentage, percentage]}
      dither={false}
    >
      <View style={styles.subcontainer}>
        <Pressable
          onPress={toggleAddExpense}
          style={{
            borderColor: "#2196F3",
            backgroundColor: `${isAddingExpense ? "#2196F3" : "transparent"}`,
            borderWidth: 1.5,
            borderRadius: 25,
            width: 35,
            height: 35,
          }}
        >
          <Text
            style={{
              color: `${isAddingExpense ? "#ffffff" : "#2196F3"}`,
              fontSize: 30,
              fontWeight: 100,
              margin: "auto",
              lineHeight: 35,
              textAlign: "center",
            }}
          >
            +
          </Text>
        </Pressable>
        <Text style={{
          color: `${groupColor}`,
          fontSize: 24,
          verticalAlign: "middle",
          }}>
            {groupName} 
          </Text>
      </View>
      {
        isAddingExpense ? (
          <View style={styles.add}>
            <TextInput
              style={styles.textInput}
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="type in value"
            />
            <Pressable
              onPress={addExpense}
              disabled={!inputValue ? true : false}
              style={{
                width: "100%",
                backgroundColor: `${!inputValue ? "#dadddf" : "#2196F3"}`,
                borderRadius: 7,
              }}
            >
              <Text
                style={{
                  color: `${!inputValue ? "#999999" : "#ffffff"}`,
                  textAlign: "center",
                  lineHeight: 35,
                }}
              >
                SAVE
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.numbers}>
            <Text style={{
              textAlign: "right",
              ...styles.text
              }}>
                {groupValue >= 1000000 ? shortenValue(groupValue) : groupValue}
            </Text>
          </View>
        )
      }
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 5,
    minHeight: 40,
    maxHeight: 100,
  },
  subcontainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  text: {
    fontSize: 23,
    verticalAlign: "middle"
  },
  numbers: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  add: {
    flexDirection: "column",
    justifyContent: "space-around",
    backgroundColor: "#e5eaf3",
    borderRadius: 7,
    alignItems: "center",
    width: "35%",
  },
  textInput: {
    textDecorationLine: "underline",
    fontSize: 17,
  },
})