'strict'
import {useUser} from '@clerk/clerk-expo'
import {router} from 'expo-router'
import {Alert, FlatList, Image, RefreshControl, Text, TouchableOpacity, View} from 'react-native'
import {SignOutButton} from '@/components/signOutButton'
import {useTransactions} from '@/hooks/useTransactions';
import {useEffect, useState} from 'react';
import {PageLoader} from '@/components/pageLoader';
import {styles} from '@/assets/styles/home.styles';
import {Ionicons} from '@expo/vector-icons';
import {BalanceCard} from '@/components/balanceCard';
import {TransactionItem} from '@/components/transactionItem';
import {EmptyList} from '@/components/emptyList'

export default function Page() {
  const {user} = useUser()
  const [refreshing, setRefreshing] = useState(false);

  const {loadData, deleteTransaction, transactions, summary, loading} = useTransactions(user?.id);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData()
    setRefreshing(false);
  };

  useEffect(() => {
    loadData()
  }, []);

  const handleDelete = (id) => {
    Alert.alert("Delete", "Are you sure ?", [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Delete', style: 'destructive', onPress: () => deleteTransaction(id)},
    ])
  }

  if (loading && !refreshing) {
    return <PageLoader />
  }
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* header */}
        <View style={styles.header}>
          {/* left */}
          <View style={styles.headerLeft}>
            <Image source={require("@/assets/images/logo.png")} style={styles.headerLogo} resizeMode='contain' />
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome</Text>
              <Text style={styles.usernameText}>{user?.emailAddresses[0]?.emailAddress.split("@")[0]}</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.addButton} onPress={() => router.push("/create")}>
              <Ionicons name="add" size={20} color={"#fff"} />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
            <SignOutButton />
          </View>
        </View>
        <BalanceCard summary={summary} />
        <View style={styles.transactionsHeaderContainer}>
          <Text style={styles.sectionTitle}>
            Recent Transactions
          </Text>
        </View>

      </View>
      <FlatList
        data={transactions}
        renderItem={({item}) => {
          return (
            <TransactionItem item={item} onDelete={handleDelete} />
          )
        }}
        contentContainerStyle={styles.transactionsListContent}
        style={styles.transactionsList}
        ListEmptyComponent={<EmptyList />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}