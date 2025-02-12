import { Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import 'react-native-get-random-values'
import { nanoid } from 'nanoid';

import ParallaxScrollView from '@/components/Overlay';
import ContentView from '@/components/ContentView';

export type Group = {
  id: string,
  createdOn: string,
  groupName: string,
  groupColor: string,
  earnings: boolean,
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
    lastUpdated: string,
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
      lastUpdated: "2/11/2024",
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
        const user = JSON.parse(profile)
          if (!user.profile.lastUpdated) {
            user.profile.lastUpdated = "2/11/2024";
          }
        setUser(user)
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
      earnings: false,
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
    
    const mergingGroups: { [key: string]: Group } = {};
    const result: Group[] = [];
    
    initialGroups.map(initialGroup => mergingGroups[initialGroup.groupName] =  initialGroup);
    importedGroups.map(importedGroup => {
      importedGroup.earnings = false;
      if (importedGroup.groupName === "Заработала ") {
        importedGroup.earnings = true;
      }
      mergingGroups[importedGroup.groupName] = importedGroup
    });

    for (let group in mergingGroups) {
      result.push(mergingGroups[group]);
    }

    return result;
  };

  const mergeExpenses = (initialExpenses: ExpensesEntry[], importedExpenses: ExpensesEntry[]) => {

    const lastUpdated = user.profile.lastUpdated;
    const lastUpdatedKey = lastUpdated.replace(/\/\d{1,}\//, "/");

    const mergedExpenses: ExpensesEntry[] = [];
    
    let lastUpdatedIndex = importedExpenses.findIndex((expensesMonth) => expensesMonth.date === lastUpdatedKey);

    if (lastUpdatedIndex < 0) {
      //thus there've never been data exchange before and the file should be imported entirely
      if (initialExpenses.entries.length === 0) {

        importedExpenses.map(expensesMonth => mergedExpenses.push(expensesMonth));
        return mergedExpenses;
      }

      initialExpenses.map(expensesMonth => mergedExpenses.push(expensesMonth));
    } else {
      for (let updatedIndex = 0; updatedIndex < lastUpdatedIndex; updatedIndex ++) {
        //copying expenses before last updated date beacause they are identical in initial data and imported file
        mergedExpenses.push(importedExpenses[updatedIndex]);
      };

      const relevantMonth: ExpensesEntry = { date: lastUpdatedKey, entries: []};

      const longerEntriesArray = initialExpenses[lastUpdatedIndex].entries.length > importedExpenses[lastUpdatedIndex].entries.length ?
        initialExpenses[lastUpdatedIndex].entries : importedExpenses[lastUpdatedIndex].entries;

      const shorterEntriesArray = initialExpenses[lastUpdatedIndex].entries.length < importedExpenses[lastUpdatedIndex].entries.length ?
      initialExpenses[lastUpdatedIndex].entries : importedExpenses[lastUpdatedIndex].entries;

      const daysChange: { [key: string]: number} = {};
      
      longerEntriesArray.map((entry, index) => {

        if (shorterEntriesArray[index]) {

          if (entry.id === shorterEntriesArray[index].id) {
            relevantMonth.entries.push(entry);
          } else {

            if (entry.createdOn !== shorterEntriesArray[index].createdOn) {

              const longerCreationDay = entry.createdOn.split("/")[0];
              const shorterCreationDay = shorterEntriesArray[index].createdOn.split("/")[0];

              if (longerCreationDay < shorterCreationDay) {

                daysChange[shorterEntriesArray[index].createdOn] = index;

                relevantMonth.entries.push(entry);
                relevantMonth.entries.push(shorterEntriesArray[index]);
              } else {

                daysChange[entry.createdOn] = index;

                relevantMonth.entries.push(shorterEntriesArray[index]);
                relevantMonth.entries.push(entry);
              }
            } else {
              relevantMonth.entries.push(entry);
              relevantMonth.entries.push(shorterEntriesArray[index]);
            }
            
          }
        } else {

          if (longerEntriesArray[index - 1]) {
            if (entry.createdOn === longerEntriesArray[index - 1].createdOn) {
              relevantMonth.entries.push(entry);
            } else {

              const curCreationDay = entry.createdOn.split("/")[0];
              const prevCreationDay = longerEntriesArray[index - 1].createdOn.split("/")[0];

              if (curCreationDay > prevCreationDay) {
                relevantMonth.entries.push(entry);
              } else {

                const insertionIndex = daysChange[entry.createdOn];
                relevantMonth.entries.splice(insertionIndex, 0, entry);
              }
            }
          }
        }
      });

      mergedExpenses.push(relevantMonth);

    }
    
    return mergedExpenses;
  };

  const importData = async (importedExpenses: ExpensesEntry[], importedGroups: Group[], relevantOn: string) => {

    const updatedGroups = mergeGroups(user.profile.groups, importedGroups);
    const updatedExpenses = mergeExpenses(user.expenses, importedExpenses);

    const updatedUser: User = {
      profile: {
        ...user.profile,
        groups: updatedGroups,
        lastUpdated: relevantOn
      },
      expenses: updatedExpenses,
    };

    await AsyncStorage.setItem("expenses-app", JSON.stringify(updatedUser));

    setUser(updatedUser);
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
