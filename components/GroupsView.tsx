import { View, Text, StyleSheet } from "react-native";

import GroupView from "./GroupView";
import { Group, ExpensesEntry } from "@/app";
import showExpenses from "../helpers/showExpenses";

import containers from "@/styles/containers";
import fonts from "@/styles/fonts";

type Props = {
  groups: Group[],
  expenses: ExpensesEntry[],
  filter: number,
  dateKey: string,
  onAddExpense( groupName: string, groupValue: number): void,
};

type GroupColors = {
  [key: string]: string,
}

export default function GroupsView({
 groups,
 expenses,
 filter,
 dateKey,
 onAddExpense,
}: Props) {

  const groupColors : GroupColors = {};

  groups.map(group => groupColors[group.groupName] = group.groupColor);

  const { expensesSummary, expensesHistory } = showExpenses(filter, expenses, groups, dateKey);
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
            color: "green"
          }}>
            pr:
          </Text>
          <Text style={fonts.bigHeader}>
            {profitsTotal}
          </Text>
        </View>
        <View style={containers.rowTogether}>
          <Text style={{
            ...fonts.bigHeader,
            color: "red"
          }}>
            ex:
          </Text>
          <Text style={fonts.bigHeader}>
            {expensesTotal}
          </Text>
        </View>
      </View>
      {
        expensesSummary.map(({ id, groupName, groupValue, earnings }) => 
        (
          <GroupView
            key={id}
            groupName={groupName}
            groupValue={groupValue}
            groupColor={groupColors[groupName]}
            expensesTotal={expensesTotal}
            onAddExpense={onAddExpense}
            earnings={earnings}
          />
        ))
      }
      <View style={containers.vertIndent}>
        <Text style={fonts.bigHeader}>
          History
        </Text>
        {
          expensesHistory.map(({ id, expenseGroup, expenseValue, createdOn }) => (
            <View
              key={id}
              style={{
                ...containers.rowTogether,
                ...containers.horizIndent,
              }}
            >
              <Text style={fonts.stdHeader}>
                {expenseValue} in
              </Text>
              <Text style={{color: `${groupColors[expenseGroup]}`, ...fonts.stdHeader}}>
                {expenseGroup}
              </Text>
              <Text style={fonts.stdHeader}>
                on {createdOn}
              </Text>
            </View>
          ))
        }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  historyUnit: {
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 10,
  },
  historyText: {
    fontSize: 18,
  },
})