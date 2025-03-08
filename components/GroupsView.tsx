import { View, Text } from "react-native";

import GroupView from "./GroupView";
import { Group, ExpensesEntry } from "@/types/types";

import showExpenses from "../helpers/showExpenses";
import shortenValue from "@/helpers/shortenValue";
import { formateDate } from "@/helpers/formateDate";

import containers from "@/styles/containers";
import fonts from "@/styles/fonts";

type Props = {
  groups: Group[],
  expenses: ExpensesEntry[],
  filter: number,
  dateKey: string,
  editable: boolean,
  onChangeProps(altName: string, altColor: string, ogName: string): void,
  onAddExpense( groupName: string, groupValue: number): void,
};

type GroupProps = {
  [key: string]: {
    color: string,
    altName: string,
    altColor: string,
  }
};

export default function GroupsView({
 groups,
 expenses,
 filter,
 dateKey,
 onChangeProps,
 onAddExpense,
 editable,
}: Props) {

  const groupProps : GroupProps = {};

  groups.map(group => {
    groupProps[group.groupName] = {
      color: group.groupColor,
      altName: group.altName ? group.altName : "",
      altColor:  group.altColor ? group.altColor : ""
    };
  });

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
            {profitsTotal >= 1000000 ? shortenValue(profitsTotal) : profitsTotal}
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
            earnings={earnings}
            editable={editable}
          />
        ))
      }
      <View style={{
        ...containers.stdList,
        ...containers.vertIndent,
      }}>
        {
          expensesHistory.map(({ id, expenseGroup, expenseValue, createdOn }, index) => {
            
            if (!index || expensesHistory[index].createdOn !== expensesHistory[index - 1].createdOn) {

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
              return(
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
            )}
          })
        }
      </View>
    </View>
  )
}