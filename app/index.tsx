import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';

import { useState, useEffect } from 'react';
import * as Crypto from "expo-crypto";

import type { User, ExpensesMonth, Group } from "@/types/types";

import Overlay from '@/components/Overlay';
import ContentView from '@/components/ContentView';


export default function HomeScreen() {

  const date = new Date();
  const dateKey = String(date.getMonth() + 1) + "/" + String(date.getFullYear());
  const id = Crypto.randomUUID();
  const newProfile: User = {
    profile: {
      id: id,
      name: "New User",
      createdOn: date.toLocaleDateString("en-US"),
      avatar: '',
      groups: [],
      ver: "1.1.0",
    },
    expenses: {
      own: [
        {
          date: dateKey,
          entries: []
        }
      ]
    },
    archive: [],
  };

  const [user, setUser] = useState(newProfile);
  const [monthIndex, setMonthIndex] = useState(0);

  async function fetchData() {
    try {
      await findProfile();
    } catch (err) {
      console.log("error in findProfile effect:" + " " + err);
    }
  }

  const findProfile = async () => {

    try {

      const profile = await AsyncStorage.getItem("expenses-app");

      if (profile) {

        const user: User = JSON.parse(profile);

        if (!user.profile.ver) {
          return removeProfile()
        }

        if (user.expenses.own[user.expenses.own.length - 1].date !== dateKey) {
          user.expenses.own.push({
            date: dateKey,
            entries: [],
          });
        }

        setMonthIndex(user.expenses.own.length - 1);
        setUser(user);
      } else {
        await AsyncStorage.setItem("expenses-app", JSON.stringify(newProfile));
        await findProfile();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const changeName = async (nameInput: string) => {

    const updatedUser: User = {
      ...user,
      profile: {
        ...user.profile,
        name: nameInput,
      },
    };

    await AsyncStorage.setItem("expenses-app", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const changeProps = async (altName: string, altColor: string, ogName: string) => {

    const updatedGroups = user.profile.groups.map(group => {
      if (group.groupName === ogName) {
        group.altName = altName;
        group.altColor = altColor;
      }

      return group;
    });

    const updatedUser: User = {
      ...user,
      profile: {
        ...user.profile,
        groups: updatedGroups,
      },
    };

    await AsyncStorage.setItem("expenses-app", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const addGroup = async (groupName: string, pickedColor: string, earnings: boolean) => {

    const groupValues = {
      id: Crypto.randomUUID(),
      groupName,
      groupColor: pickedColor,
      createdOn: date.toLocaleDateString("en-US"),
      altName: "",
      altColor: "",
      earnings,
    };

    const updatedUser: User = {
      ...user,
      profile: {
        ...user.profile,
        groups: [
          ...user.profile.groups,
          groupValues,
        ]
      },
    };


    await AsyncStorage.setItem("expenses-app", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const removeGroup = async (id: string, name: string) => {

    const updatedGroups = user.profile.groups.filter(group => id !== group.id);
    const updatedExpenses: ExpensesMonth[] = [];

    user.expenses.own.forEach(month => {
      updatedExpenses.push({
        date: month.date,
        entries: month.entries.filter(entry => entry.expenseGroup !== name)
      })
    });

    const updatedUser: User = {
      profile: {
        ...user.profile,
        groups: updatedGroups,
      },
      expenses: {
        ...user.expenses,
        own: updatedExpenses,
      },
      archive: user.archive,
    };

    await AsyncStorage.setItem("expenses-app", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const removeGroups = async () => {


    const updatedUser: User = {
      profile: {
        ...user.profile,
        groups: [],
      },
      expenses: {
        ...user.expenses,
        own: [
          {
            date: dateKey,
            entries: [],
          }
        ],
      },
      archive: [],
    };

    await AsyncStorage.setItem("expenses-app", JSON.stringify(updatedUser));
    setMonthIndex(0);
    setUser(updatedUser);
  };

  const removeProfile = async () => {
    await AsyncStorage.removeItem("expenses-app");
    await findProfile();
  }

  const switchMonth = (next: boolean) => setMonthIndex(prev => next ? prev += 1 : prev -= 1);

  const addExpense = async (groupName: string, groupValue: number) => {

    const updatedUser: User = {
      profile: user.profile,
      expenses: {
        ...user.expenses,
        own: []
      },
      archive: user.archive,
    }

    const expenseValues = {
      id: Crypto.randomUUID(),
      expenseGroup: groupName,
      expenseValue: groupValue,
      createdOn: date.toLocaleDateString("en-US"),
    };

    const userOwnExpenses = user.expenses.own;

    if (userOwnExpenses[userOwnExpenses.length - 1].date === dateKey) {

      userOwnExpenses[userOwnExpenses.length - 1].entries.push(expenseValues)

      updatedUser.expenses.own = userOwnExpenses;

    } else {
      updatedUser.expenses.own = [
        ...user.expenses.own,
        {
          date: dateKey,
          entries: [
            expenseValues
          ]
        }
      ]
    }

    await AsyncStorage.setItem("expenses-app", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const mergeGroups = (initialGroups: Group[], importedGroups: Group[]) => {

    const mergingGroups: { [key: string]: Group } = {};
    const result: Group[] = [];

    importedGroups.map(importedGroup => {

      mergingGroups[importedGroup.groupName] = importedGroup;
    });

    initialGroups.map(initialGroup => mergingGroups[initialGroup.groupName] = {
      ...initialGroup,
      altColor: Object.hasOwn(initialGroup, "altColor") ? initialGroup.altColor : "",
      altName: Object.hasOwn(initialGroup, "altName") ? initialGroup.altName : "",
    });

    for (let group in mergingGroups) {
      result.push(mergingGroups[group]);
    }

    return result;
  };

  const importData = async (owner: string, importedExpenses: ExpensesMonth[], importedGroups: Group[]) => {

    if (owner === user.profile.id) {
      return;
    }

    const updatedGroups = mergeGroups(user.profile.groups, importedGroups);

    const updatedUser: User = {
      profile: {
        ...user.profile,
        groups: updatedGroups,
      },
      expenses: {
        ...user.expenses,
        [owner]: importedExpenses,
      },
      archive: user.archive,
    };

    await AsyncStorage.setItem("expenses-app", JSON.stringify(updatedUser));

    setUser(updatedUser);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Overlay
      headerBackgroundColor={{ light: '#FFFFFF', dark: '#FFFFFF' }}
      user={user.profile}
      monthSelected={user.expenses.own[monthIndex].date}
      onChangeName={changeName}
      onRemoveGroup={removeGroup}
      onRemoveGroups={removeGroups}
      onRemoveProfile={removeProfile}
    >
      <ContentView
        userId={user.profile.id}
        userName={user.profile.name}
        onAddGroup={addGroup}
        onAddExpense={addExpense}
        onChangeProps={changeProps}
        groups={user.profile.groups}
        expenses={user.expenses}
        dateKey={dateKey}
        onImportData={importData}
        selectedMonthIndex={monthIndex}
        onSwitchMonth={switchMonth}
      />
    </Overlay>
  );
}
