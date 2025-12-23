"use client"

import { useState } from "react"
import { ChevronRight, TrendingDown, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function CategoryView({ transactions, categories }) {
  const [expandedCategory, setExpandedCategory] = useState(null)

  // Calculate totals by category
  const categoryTotals = categories
    .map((category) => {
      const categoryTransactions = transactions.filter((t) => t.category === category)
      const total = categoryTransactions.reduce((sum, t) => sum + Number.parseFloat(t.amount), 0)
      const count = categoryTransactions.length

      return {
        category,
        total,
        count,
        transactions: categoryTransactions,
      }
    })
    .filter((cat) => cat.count > 0)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  if (categoryTotals.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No categories found</p>
        <p className="text-sm mt-2">Add transactions to see category breakdown</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {categoryTotals.map((cat) => (
        <Card key={cat.category}>
          <CardContent className="p-0">
            <Button
              variant="ghost"
              className="w-full p-4 h-auto justify-between hover:bg-accent"
              onClick={() => setExpandedCategory(expandedCategory === cat.category ? null : cat.category)}
            >
              <div className="flex items-center gap-3">
                <div className="text-left">
                  <p className="font-semibold">{cat.category}</p>
                  <p className="text-sm text-muted-foreground">{cat.count} transactions</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <p className="font-bold">${cat.total.toFixed(2)}</p>
                <ChevronRight
                  className={`h-5 w-5 transition-transform ${expandedCategory === cat.category ? "rotate-90" : ""}`}
                />
              </div>
            </Button>

            {expandedCategory === cat.category && (
              <div className="px-4 pb-4 space-y-2 border-t">
                {cat.transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                    <div className="flex items-center gap-2">
                      {transaction.type === "income" ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <div>
                        <p className="text-sm font-medium">{transaction.description || transaction.category}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
                      </div>
                    </div>
                    <p className={`font-semibold ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
                      {transaction.type === "income" ? "+" : "-"}${Number.parseFloat(transaction.amount).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
