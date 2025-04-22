"use client"

import { createContext, useContext, useState } from "react"

const TabsContext = createContext({
  value: "",
  onValueChange: () => {},
})

export function Tabs({ defaultValue, value, onValueChange, className, children, ...props }) {
  const [tabValue, setTabValue] = useState(defaultValue || "")

  const contextValue = {
    value: value !== undefined ? value : tabValue,
    onValueChange: onValueChange || setTabValue,
  }

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={`${className}`} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

export function TabsList({ className, children, ...props }) {
  return (
    <div
      className={`inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function TabsTrigger({ value, className, children, ...props }) {
  const { value: selectedValue, onValueChange } = useContext(TabsContext)
  const isSelected = selectedValue === value

  return (
    <button
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer ${
        isSelected ? "bg-white text-[#00A88D] shadow-sm" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      } ${className}`}
      onClick={() => onValueChange(value)}
      {...props}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value, className, children, ...props }) {
  const { value: selectedValue } = useContext(TabsContext)
  const isSelected = selectedValue === value

  if (!isSelected) return null

  return (
    <div
      className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
