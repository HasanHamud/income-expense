"use client"

import { useState } from "react"
import { X, ArrowDownToLine, ArrowUpFromLine } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function BankBalanceModal({ isOpen, onClose, onUpdate, currentBalance, currentCash }) {
  const [action, setAction] = useState("add") // add or remove
  const [amount, setAmount] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!amount || Number.parseFloat(amount) <= 0) return

    if (action === "remove" && Number.parseFloat(amount) > currentBalance) {
      alert("Cannot remove more than current bank balance")
      return
    }

    if (action === "add" && Number.parseFloat(amount) > currentCash) {
      alert("Cannot add more than current cash")
      return
    }

    onUpdate(amount, action)
    setAmount("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-background rounded-t-3xl sm:rounded-3xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">Manage Bank Balance</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Current Balances */}
          <div className="grid grid-cols-2 gap-3 p-4 bg-muted rounded-lg">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Current Cash</p>
              <p className="font-bold">${currentCash.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Bank Balance</p>
              <p className="font-bold">${currentBalance.toFixed(2)}</p>
            </div>
          </div>

          {/* Action Toggle */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={action === "add" ? "default" : "outline"}
              onClick={() => setAction("add")}
              className="flex items-center gap-2"
            >
              <ArrowDownToLine className="h-4 w-4" />
              Save to Bank
            </Button>
            <Button
              type="button"
              variant={action === "remove" ? "default" : "outline"}
              onClick={() => setAction("remove")}
              className="flex items-center gap-2"
            >
              <ArrowUpFromLine className="h-4 w-4" />
              Withdraw
            </Button>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              {action === "add"
                ? "Move money from current cash to bank savings"
                : "Withdraw money from bank to current cash"}
            </p>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" size="lg">
            {action === "add" ? "Save to Bank" : "Withdraw from Bank"}
          </Button>
        </form>
      </div>
    </div>
  )
}
