import { Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import 'react-native-get-random-values'
import { nanoid } from 'nanoid';

import ParallaxScrollView from '@/components/Overlay';
import ContentView from '@/components/ContentView';
import { group } from 'console';

export type Group = {
  id: string,
  createdOn: string,
  groupName: string,
  groupColor: string,
};

export type Expense = {
  id: string,
  createdOn: string,
  expenseGroup: string,
  expenseValue: number,
};

export type ExpensesEntry = {
  date: string,
  entries: Expense[],
};

type User = {
  profile: {
    name: string,
    createdOn: string,
    avatar: string,
    groups: Group[],
  },
  expenses: ExpensesEntry[],
};

export default function HomeScreen() {
  
  const date = new Date();
  const dateKey = String(date.getMonth() + 1) + "/" + String(date.getFullYear())
  const newProfile: User = {
    profile: {
      name: "New User",
      createdOn: date.toLocaleDateString(),
      avatar: '',
      groups: [],
    },
    expenses: [
      {
        date: dateKey,
        entries: [],
      }
    ]
  }

  const [ user, setUser ] = useState(newProfile)

  const findProfile = async () => {
    try {
      const profile = await AsyncStorage.getItem('expenses-app');
      if (profile !== null) {
        setUser(JSON.parse(profile))
      } else {
        await AsyncStorage.setItem('expenses-app', JSON.stringify(newProfile))
      }
    } catch(error) {
      console.log(error)
    }
  }

  const changeName = async (nameInput: string) => {

    const updatedUser: User = {
      profile: {
        ...user.profile,
        name: nameInput,
      },
      expenses: user.expenses,
    };

    await AsyncStorage.setItem("expenses-app", JSON.stringify(updatedUser));
    setUser(updatedUser);
  }

  const addGroup = async (groupName: string, pickedColor: string) => {

    const groupValues = {
      id: nanoid(),
      groupName,
      groupColor: pickedColor,
      createdOn: date.toLocaleDateString(),
    };

    const updatedUser: User = {
      profile: {
        ...user.profile,
        groups: [
          ...user.profile.groups,
          groupValues
        ]
      },
      expenses: user.expenses,
    };

    await AsyncStorage.setItem("expenses-app", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const removeGroup = async (id: string, name: string) => {

    const updatedGroups = user.profile.groups.filter(group => id !== group.id);
    const updatedExpenses: ExpensesEntry[] = []
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
    };

    await AsyncStorage.setItem("expenses-app", JSON.stringify(updatedUser));
    setUser(updatedUser);
  }

  const addExpense = async (groupName: string, groupValue: number) => {

    const updatedUser: User = {
      profile: user.profile,
      expenses: [],
    }
    
    const expenseValues = {
      id: nanoid(),
      expenseGroup: groupName,
      expenseValue: groupValue,
      createdOn: date.toLocaleDateString(),
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

    const mergedGroups = [];

    initialGroups.map(group => {
      importedGroups.find(imported => {
        if (group.groupName !== imported.groupName) {
          console.log(group.groupName);
        }
      })
    })
  }

  const importData = async (expenses: ExpensesEntry[], groups: Group[]) => {

    console.log(mergeGroups(user.profile.groups, groups));

    /*const updatedUser: User = {
      profile: {
        ...user.profile,
        groups: [],
      },
      expenses: user.expenses,
    };

    await AsyncStorage.setItem("expenses-app", JSON.stringify(updatedUser));
    setUser(updatedUser);*/
  };

  findProfile();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#FFFFFF', dark: '#FFFFFF' }}
      user={user.profile}
      onChangeName={changeName}
      onRemoveGroup={removeGroup}
      onRemoveGroups={removeGroups}
      headerImage={
        <Image
          source={require('@/assets/images/logo.jpg')}
          style={styles.logo}
        />
      }>
      <ContentView
        onAddGroup={addGroup}
        onAddExpense={addExpense}
        groups={user.profile.groups}
        expenses={user.expenses}
        dateKey={dateKey}
        onImportData={importData}
      />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  logo: {
    margin: 'auto',
  },
});
