'strict'
import {useUser} from '@clerk/clerk-expo'
import {router} from 'expo-router'
import {Alert, FlatList, Image, RefreshControl, Text, TouchableOpacity, View} from 'react-native'
import {SignOutButton} from '@/components/signOutButton'
import {useState} from 'react';
import {PageLoader} from '@/components/pageLoader';
import {styles} from '@/assets/styles/home.styles';
import {Ionicons} from '@expo/vector-icons';
import {BalanceCard} from '@/components/balanceCard';
import {TransactionItem} from '@/components/transactionItem';
import {EmptyList} from '@/components/emptyList'
import {deleteTransaction, useSummaryQueryData, useTransactionQueryData} from '@/hooks/useTransactionsQuery'
import {useMutation, useQueryClient, UseQueryResult} from '@tanstack/react-query'

export default function Page() {
  const queryClient = useQueryClient();
  const {user} = useUser()
  const summaryData: UseQueryResult = useSummaryQueryData(user?.id);
  const transactionData: UseQueryResult = useTransactionQueryData(user?.id);

  const deteletTransactionMutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: (d, v) => {
      queryClient.invalidateQueries({queryKey: ['transactions']})
      queryClient.invalidateQueries({queryKey: ['summary']})

      console.log("------##------------------d", d);
      console.log("------##------------------v", v);
      console.log("delete mutation is action")
    }
  })
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    transactionData.refetch();
    summaryData.refetch();
    setRefreshing(false);
  };

  const handleDelete = (id) => {
    Alert.alert("Delete", "Are you sure ?", [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Delete', style: 'destructive', onPress: () => deteletTransactionMutation.mutate({tId: id, userId: user?.id})},
    ])
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
        <BalanceCard summary={summaryData.data} />
        <View style={styles.transactionsHeaderContainer}>
          <Text style={styles.sectionTitle}>
            Recent Transactions
          </Text>
        </View>

      </View>
      <FlatList
        data={transactionData.data}
        renderItem={({item}) => {
          return (
            <TransactionItem item={item} onDelete={handleDelete} />
          )
        }}
        contentContainerStyle={styles.transactionsListContent}
        style={styles.transactionsList}
        ListEmptyComponent={<EmptyList />}
        refreshControl={<RefreshControl refreshing={
          refreshing ||  deteletTransactionMutation.isPending || transactionData.isLoading || summaryData.isLoading
        } onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}