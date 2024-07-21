import { Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import ContentView from '@/components/ContentView';

export type Group = {
  createdOn: string,
  groupName: string,
  groupColor: string,
};

export type Expense = {
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

  const addGroup = async (groupName: string, pickedColor: string) => {

    const groupValues = {
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
  }

  const addExpense = async (groupName: string, groupValue: number) => {

    const updatedUser: User = {
      profile: user.profile,
      expenses: [],
    }
    
    const expenseValues = {
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
  }

  findProfile();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#FFFFFF', dark: '#FFFFFF' }}
      user={user.profile}
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
