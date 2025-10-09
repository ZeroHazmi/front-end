"use client"

import React, { createContext, useContext } from "react"

type RadioGroupContextType = {
  value: string
  onValueChange: (v: string) => void
}

const RadioGroupContext = createContext<RadioGroupContextType | null>(null)

export function RadioGroup({ value, onValueChange, children }: any) {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange }}>
      {children}
    </RadioGroupContext.Provider>
  )
}

export function RadioGroupItem({ value, id }: { value: string; id?: string }) {
  const ctx = useContext(RadioGroupContext)
  if (!ctx) return null

  const checked = ctx.value === value

  return (
    <input
      type="radio"
      id={id}
      checked={checked}
      onChange={() => ctx.onValueChange(value)}
      className="form-radio"
      value={value}
    />
  )
}

export default RadioGroup
