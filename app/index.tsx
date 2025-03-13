
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';

import { useState, useEffect } from 'react';

import type { User, ExpensesEntry, Group} from "@/types/types";

import { nanoid } from 'nanoid';

import ParallaxScrollView from '@/components/Overlay';
import ContentView from '@/components/ContentView';

import { mergeExpenses } from '@/helpers/mergeExpenses';

export default function HomeScreen() {
  
  const date = new Date();
  const dateKey = String(date.getMonth() + 1) + "/" + String(date.getFullYear());
  const newProfile: User = {
    profile: {
      name: "New User",
      createdOn: date.toLocaleDateString("en-US"),
      avatar: '',
      groups: [],
      lastUpdated: "2/11/2024",
    },
    expenses: [
      {
        date: dateKey,
        entries: [],
      }
    ],
    archive: [],
  };

  const [ user, setUser ] = useState(newProfile);
  const [ monthIndex, setMonthIndex ] = useState(0);

  const findProfile = async () => {
    try {
      const profile = await AsyncStorage.getItem('expenses-app');

      if (profile !== null) {

        const user: User = JSON.parse(profile);
        
        if (user.profile.trimmed) {
          delete user.profile.trimmed;
        }

        if (user.expenses[user.expenses.length - 1].date !== dateKey) {
          user.expenses.push({
            date: dateKey,
            entries: [],
          });
        }

        setMonthIndex(user.expenses.length - 1);
        setUser(user);
      } else {
        await AsyncStorage.setItem('expenses-app', JSON.stringify(newProfile))
      }
    } catch(error) {
      console.log(error)
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
      id: nanoid(),
      groupName,
      groupColor: pickedColor,
      createdOn: date.toLocaleDateString("en-US"),
      altName: "",
      altColor: "",
      earnings: earnings,
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
    const updatedExpenses: ExpensesEntry[] = [];

    user.expenses.forEach(month => {
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
      expenses: updatedExpenses,
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
      expenses: [
        {
          date: dateKey,
          entries: [],
        }
      ],
      archive: [],
    };

    await AsyncStorage.setItem("expenses-app", JSON.stringify(updatedUser));
    setMonthIndex(0);
    setUser(updatedUser);
  };

  const switchMonth = (next: boolean) => setMonthIndex(prev => next ? prev += 1 : prev -= 1);

  const addExpense = async (groupName: string, groupValue: number) => {

    const updatedUser: User = {
      profile: user.profile,
      expenses: [],
      archive: user.archive,
    }
    
    const expenseValues = {
      id: nanoid(),
      expenseGroup: groupName,
      expenseValue: groupValue,
      createdOn: date.toLocaleDateString("en-US"),
    };

    if (user.expenses[user.expenses.length - 1].date === dateKey) {

      const updatedExpenses = user.expenses

      updatedExpenses[updatedExpenses.length - 1].entries.push(expenseValues)

      updatedUser.expenses = updatedExpenses

    } else {
      updatedUser.expenses = [
        ...user.expenses,
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

    initialGroups.map(initialGroup => mergingGroups[initialGroup.groupName] =  {
      ...initialGroup,
      altColor: Object.hasOwn(initialGroup, "altColor") ? initialGroup.altColor : "",
      altName: Object.hasOwn(initialGroup, "altName") ? initialGroup.altName : "",
    });
    
    for (let group in mergingGroups) {
      result.push(mergingGroups[group]);
    }

    return result;
  };

  const importData = async (importedExpenses: ExpensesEntry[], importedGroups: Group[], relevantOn: string) => {

    const updatedExpenses = mergeExpenses(user.expenses, importedExpenses, user.profile.lastUpdated);
    const updatedGroups = mergeGroups(user.profile.groups, importedGroups);

    const updatedUser: User = {
      profile: {
        ...user.profile,
        groups: updatedGroups,
        lastUpdated: relevantOn
      },
      expenses: updatedExpenses,
      archive: user.archive,
    };

    await AsyncStorage.setItem("expenses-app", JSON.stringify(updatedUser));

    setMonthIndex(updatedExpenses.length - 1)
    setUser(updatedUser);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        await findProfile();
      } catch(err) {
        console.log("error in findProfile effect:" + " " + err);
      }
    }
    fetchData();
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#FFFFFF', dark: '#FFFFFF' }}
      user={user.profile}
      monthSelected={user.expenses[monthIndex].date}
      onChangeName={changeName}
      onRemoveGroup={removeGroup}
      onRemoveGroups={removeGroups}
      >
      <ContentView
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
    </ParallaxScrollView>
  );
}
