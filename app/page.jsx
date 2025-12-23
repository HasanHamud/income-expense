"use client"

import { useState, useEffect } from "react"
import { Plus, TrendingUp, TrendingDown, Wallet, PiggyBank, ChevronDown } from "lucide-react"
import AddTransactionModal from "@/components/add-transaction-modal"
import TransactionList from "@/components/transaction-list"
import CategoryView from "@/components/category-view"
import ExpenseChart from "@/components/expense-chart"
import BankBalanceModal from "@/components/bank-balance-modal"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const CATEGORIES = [
  "Food",
  "Monthly Bills",
  "Clothes",
  "Transportation",
  "Entertainment",
  "Healthcare",
  "Shopping",
  "Salary",
  "Freelance",
  "Investment",
  "Other",
]

export default function ExpenseTracker() {
  const [transactions, setTransactions] = useState([])
  const [bankBalance, setBankBalance] = useState(0)
  const [currentCash, setCurrentCash] = useState(0)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showBankModal, setShowBankModal] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [view, setView] = useState("transactions") // transactions, categories, chart

  // Load data from localStorage on mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem("transactions")
    const savedBankBalance = localStorage.getItem("bankBalance")
    const savedCurrentCash = localStorage.getItem("currentCash")

    if (savedTransactions) setTransactions(JSON.parse(savedTransactions))
    if (savedBankBalance) setBankBalance(Number.parseFloat(savedBankBalance))
    if (savedCurrentCash) setCurrentCash(Number.parseFloat(savedCurrentCash))
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    localStorage.setItem("bankBalance", bankBalance.toString())
  }, [bankBalance])

  useEffect(() => {
    localStorage.setItem("currentCash", currentCash.toString())
  }, [currentCash])

  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    }
    setTransactions([newTransaction, ...transactions])

    // Update current cash based on transaction type
    if (transaction.type === "income") {
      setCurrentCash(currentCash + Number.parseFloat(transaction.amount))
    } else {
      setCurrentCash(currentCash - Number.parseFloat(transaction.amount))
    }
  }

  const deleteTransaction = (id) => {
    const transaction = transactions.find((t) => t.id === id)
    if (transaction) {
      if (transaction.type === "income") {
        setCurrentCash(currentCash - Number.parseFloat(transaction.amount))
      } else {
        setCurrentCash(currentCash + Number.parseFloat(transaction.amount))
      }
      setTransactions(transactions.filter((t) => t.id !== id))
    }
  }

  const updateBankBalance = (amount, action) => {
    if (action === "add") {
      setBankBalance(bankBalance + Number.parseFloat(amount))
      setCurrentCash(currentCash - Number.parseFloat(amount))
    } else {
      setBankBalance(bankBalance - Number.parseFloat(amount))
      setCurrentCash(currentCash + Number.parseFloat(amount))
    }
  }

  // Filter transactions by selected month and year
  const filteredTransactions = transactions.filter((t) => {
    const transactionDate = new Date(t.date)
    const monthMatch = transactionDate.getMonth() === selectedMonth
    const yearMatch = transactionDate.getFullYear() === selectedYear
    const categoryMatch = selectedCategory === "All" || t.category === selectedCategory

    return monthMatch && yearMatch && categoryMatch
  })

  // Calculate totals
  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number.parseFloat(t.amount), 0)

  const totalExpenses = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number.parseFloat(t.amount), 0)

  // Get months and years for dropdown
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const availableYears = Array.from(new Set(transactions.map((t) => new Date(t.date).getFullYear()))).sort(
    (a, b) => b - a,
  )
  if (!availableYears.includes(selectedYear)) {
    availableYears.push(selectedYear)
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-6 pb-24 rounded-b-3xl">
        <h1 className="text-2xl font-bold mb-6">Expense Tracker</h1>

        {/* Balance Cards */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Wallet className="h-4 w-4" />
                <p className="text-xs opacity-90">Current Cash</p>
              </div>
              <p className="text-xl font-bold">${currentCash.toFixed(2)}</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <PiggyBank className="h-4 w-4" />
                <p className="text-xs opacity-90">Bank Balance</p>
              </div>
              <p className="text-xl font-bold">${bankBalance.toFixed(2)}</p>
            </CardContent>
          </Card>
        </div>

        <Button onClick={() => setShowBankModal(true)} variant="secondary" size="sm" className="w-full mb-4">
          Manage Bank Balance
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="px-6 -mt-16 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <p className="text-xs text-muted-foreground">Income</p>
              </div>
              <p className="text-lg font-bold text-green-600">${totalIncome.toFixed(2)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingDown className="h-4 w-4 text-red-600" />
                <p className="text-xs text-muted-foreground">Expenses</p>
              </div>
              <p className="text-lg font-bold text-red-600">${totalExpenses.toFixed(2)}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 mb-4 flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
              {months[selectedMonth]} <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40">
            {months.map((month, index) => (
              <DropdownMenuItem key={month} onClick={() => setSelectedMonth(index)}>
                {month}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
              {selectedYear} <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-32">
            {availableYears.map((year) => (
              <DropdownMenuItem key={year} onClick={() => setSelectedYear(year)}>
                {year}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
              {selectedCategory} <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40">
            <DropdownMenuItem onClick={() => setSelectedCategory("All")}>All</DropdownMenuItem>
            {CATEGORIES.map((category) => (
              <DropdownMenuItem key={category} onClick={() => setSelectedCategory(category)}>
                {category}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* View Tabs */}
      <div className="px-6 mb-4 flex gap-2">
        <Button
          variant={view === "transactions" ? "default" : "outline"}
          size="sm"
          onClick={() => setView("transactions")}
          className="flex-1"
        >
          Transactions
        </Button>
        <Button
          variant={view === "categories" ? "default" : "outline"}
          size="sm"
          onClick={() => setView("categories")}
          className="flex-1"
        >
          Categories
        </Button>
        <Button
          variant={view === "chart" ? "default" : "outline"}
          size="sm"
          onClick={() => setView("chart")}
          className="flex-1"
        >
          Chart
        </Button>
      </div>

      {/* Content */}
      <div className="px-6">
        {view === "transactions" && (
          <TransactionList transactions={filteredTransactions} onDelete={deleteTransaction} />
        )}
        {view === "categories" && <CategoryView transactions={filteredTransactions} categories={CATEGORIES} />}
        {view === "chart" && <ExpenseChart transactions={filteredTransactions} />}
      </div>

      {/* Floating Add Button */}
      <Button
        onClick={() => setShowAddModal(true)}
        size="lg"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Modals */}
      <AddTransactionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={addTransaction}
        categories={CATEGORIES}
      />

      <BankBalanceModal
        isOpen={showBankModal}
        onClose={() => setShowBankModal(false)}
        onUpdate={updateBankBalance}
        currentBalance={bankBalance}
        currentCash={currentCash}
      />
    </div>
  )
}
