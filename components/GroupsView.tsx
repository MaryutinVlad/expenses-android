import { View, Text } from "react-native";
import { useState } from "react";

import GroupView from "./GroupView";
import { Group, Expenses } from "@/types/types";

import showExpenses from "../helpers/showExpenses";
import shortenValue from "@/helpers/shortenValue";
import { formateDate } from "@/helpers/formateDate";

import containers from "@/styles/containers";
import fonts from "@/styles/fonts";

type Props = {
  userId: string,
  groups: Group[],
  expenses: Expenses,
  filter: string,
  dateKey: string,
  editable: boolean,
  onChangeProps(altName: string, altColor: string, ogName: string): void,
  onAddExpense(groupName: string, groupValue: number): void,
};

type GroupProps = {
  [key: string]: {
    color: string,
    altName: string,
    altColor: string,
    isOpened: boolean,
  }
};

export default function GroupsView({
  userId,
  groups,
  expenses,
  filter,
  dateKey,
  onChangeProps,
  onAddExpense,
  editable,
}: Props) {

  const groupProps: GroupProps = {};

  groups.map(group => {
    groupProps[group.groupName] = {
      color: group.groupColor,
      altName: group.altName ? group.altName : "",
      altColor: group.altColor ? group.altColor : "",
      isOpened: false
    };
  });

  const [openedGroup, setOpenedGroup] = useState("");
  const { expensesSummary, sortedHistory } = showExpenses(userId, filter, expenses, groups, dateKey, "");

  const toggleGroup = (groupName: string) => setOpenedGroup(prev => prev === groupName ? "" : groupName);

  let expensesTotal = 0;
  let profitsTotal = 0;

  expensesSummary.map(group => group.earnings ? profitsTotal += group.groupValue : expensesTotal += group.groupValue);

  return (
    <View style={containers.stdList}>
      <View style={{
        ...containers.popup,
        ...containers.rowApart
      }}>
        <Text style={fonts.bigHeader}>
          Total:
        </Text>
        <View style={containers.rowTogether}>
          <Text style={{
            ...fonts.bigHeader,
            color: "#008000"
          }}>
            pr:
          </Text>
          <Text style={fonts.bigHeader}>
            {profitsTotal >= 1000000 ? shortenValue(profitsTotal) : profitsTotal}
          </Text>
        </View>
        <View style={containers.rowTogether}>
          <Text style={{
            ...fonts.bigHeader,
            color: "#FF0000"
          }}>
            ex:
          </Text>
          <Text style={fonts.bigHeader}>
            {expensesTotal >= 1000000 ? shortenValue(expensesTotal) : expensesTotal}
          </Text>
        </View>
      </View>
      {
        expensesSummary.map(({ id, groupName, groupValue, earnings }) =>
        (
          <GroupView
            key={id}
            groupName={groupName}
            altName={groupProps[groupName].altName}
            groupValue={groupValue}
            groupColor={groupProps[groupName].altColor ? groupProps[groupName].altColor : groupProps[groupName].color}
            expensesTotal={expensesTotal}
            onChangeProps={onChangeProps}
            onAddExpense={onAddExpense}
            onToggleGroup={toggleGroup}
            earnings={earnings}
            editable={editable}
            isOpened={groupName === openedGroup ? true : false}
          />
        ))
      }
      <View style={{
        ...containers.stdList,
        ...containers.vertIndent,
      }}>
        {
          sortedHistory.map(({ id, expenseGroup, expenseValue, createdOn }, index) => {

            if (!index || sortedHistory[index].createdOn !== sortedHistory[index - 1].createdOn) {

              const formatedDate = formateDate(createdOn);

              return (
                <View
                  key={id}
                  style={{
                    ...containers.stdList,
                    marginTop: 5,
                  }}
                >
                  <Text
                    style={{
                      ...fonts.stdHeader,
                      alignSelf: "center",
                      borderBottomWidth: .5,
                    }}>
                    {formatedDate}
                  </Text>
                  <View style={containers.rowTogether}>
                    <Text style={fonts.stdHeader}>
                      {expenseValue} in
                    </Text>
                    <Text style={{
                      color: `${groupProps[expenseGroup].altColor ? groupProps[expenseGroup].altColor : groupProps[expenseGroup].color}`,
                      ...fonts.stdHeader
                    }}>
                      {expenseGroup}
                    </Text>
                  </View>
                </View>
              )
            } else {
              return (
                <View
                  key={id}
                  style={containers.rowTogether}
                >
                  <Text style={fonts.stdHeader}>
                    {expenseValue} in
                  </Text>
                  <Text style={{
                    color: `${groupProps[expenseGroup].altColor ? groupProps[expenseGroup].altColor : groupProps[expenseGroup].color}`,
                    ...fonts.stdHeader
                  }}>
                    {expenseGroup}
                  </Text>
                </View>
              )
            }
          })
        }
      </View>
    </View>
  )
}