"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const COLORS = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#0ea5e9",
  "#3b82f6",
]

export default function ExpenseChart({ transactions }) {
  // Calculate expense totals by category
  const expenseTransactions = transactions.filter((t) => t.type === "expense")

  if (expenseTransactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expense Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <p>No expenses to display</p>
            <p className="text-sm mt-2">Add some expenses to see the breakdown</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const categoryData = {}
  expenseTransactions.forEach((transaction) => {
    const category = transaction.category
    if (!categoryData[category]) {
      categoryData[category] = 0
    }
    categoryData[category] += Number.parseFloat(transaction.amount)
  })

  const chartData = Object.entries(categoryData)
    .map(([name, value]) => ({
      name,
      value: Number.parseFloat(value.toFixed(2)),
    }))
    .sort((a, b) => b.value - a.value)

  const totalExpenses = chartData.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Breakdown</CardTitle>
        <p className="text-sm text-muted-foreground">Total: ${totalExpenses.toFixed(2)}</p>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category List */}
        <div className="mt-6 space-y-2">
          {chartData.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-sm">{item.name}</span>
              </div>
              <div className="text-sm font-semibold">
                ${item.value.toFixed(2)} ({((item.value / totalExpenses) * 100).toFixed(1)}%)
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
