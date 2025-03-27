"use client"

import { useState, useRef, type SetStateAction } from "react"
import * as React from "react"
import { FilterState, BatteryOption } from "@/types"
import Filters, { 
  Filter, 
  FilterType, 
  FilterOperator,
  AnimateChangeInHeight
} from "@/components/ui/filters"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover"
import { 
  Command, 
  CommandInput, 
  CommandList, 
  CommandEmpty, 
  CommandGroup, 
  CommandItem,
  CommandSeparator 
} from "@/components/ui/command"
import { ListFilter, CircleDashed, Zap, Battery } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

// Define battery options
export const batteryOptions: BatteryOption[] = [
  {
    label: 'T10X Uzun',
    battery: 88.5
  },
  {
    label: 'T10X Kısa',
    battery: 52.4
  },
  {
    label: 'Model Y LR',
    battery: 81
  },
  {
    label: 'Model Y SR',
    battery: 57.5
  },
  {
    label: 'Ioniq5 Uzun',
    battery: 63
  },
  {
    label: 'Ioniq5 Kısa',
    battery: 84
  }
];

interface FilterViewOption {
  name: FilterType
  icon: React.ReactNode
  label?: string
}

// Custom filter options for our application
const customFilterViewOptions: FilterViewOption[][] = [
  [
    {
      name: FilterType.STATUS,
      icon: <CircleDashed className="size-3.5" />,
    },
    {
      name: FilterType.CHARGE_PORT,
      icon: <Zap className="size-3.5" />,
    },
  ],
]

interface FilterValueOption {
  name: string
  icon: React.ReactNode
  label?: string
}

// Custom filter options mapping
const customFilterViewToFilterOptions: Partial<Record<FilterType, FilterValueOption[]>> = {
  [FilterType.STATUS]: [
    { name: "Aktif", icon: <CircleDashed className="size-3.5 text-green-400" /> },
    { name: "Yakında", icon: <CircleDashed className="size-3.5 text-yellow-400" /> },
    { name: "Geçmiş", icon: <CircleDashed className="size-3.5 text-gray-400" /> },
  ],
  [FilterType.CHARGE_PORT]: [
    { name: "AC", icon: <Zap className="size-3.5 text-blue-400" /> },
    { name: "DC", icon: <Zap className="size-3.5 text-red-400" /> },
  ],
}

interface DiscountFiltersProps {
  onChange: (filters: FilterState) => void
  selectedBattery: BatteryOption | null
  onBatteryChange: (battery: BatteryOption) => void
}

export function DiscountFilters({ onChange, selectedBattery, onBatteryChange }: DiscountFiltersProps) {
  // State for the filter component
  const [filters, setFilters] = useState<Filter[]>([])
  const [open, setOpen] = useState(false)
  const [selectedView, setSelectedView] = useState<FilterType | null>(null)
  const [commandInput, setCommandInput] = useState("")
  const commandInputRef = useRef<HTMLInputElement>(null)
  
  // Map the filters to FilterState and trigger onChange callback
  const handleFiltersChange = (newFiltersOrFunction: SetStateAction<Filter[]>) => {
    // Handle both direct value and function updates
    const newFilters = typeof newFiltersOrFunction === 'function' 
      ? newFiltersOrFunction(filters)
      : newFiltersOrFunction;
    
    // Update local state
    setFilters(newFilters)
    
    const newFilterState: FilterState = {
      status: "all",
      chargingPort: "all",
      carManufacturer: "all",
      sortBy: "ac-lowest",
      powerRange: "all"
    }
    
    newFilters.forEach((filter: Filter) => {
      // Map the filters to our application's filter state
      switch (filter.type) {
        case FilterType.STATUS:
          if (filter.value.includes("Aktif")) {
            newFilterState.status = "current"
          } else if (filter.value.includes("Yakında")) {
            newFilterState.status = "soon"
          } else if (filter.value.includes("Geçmiş")) {
            newFilterState.status = "passed"
          }
          break
          
        case FilterType.CHARGE_PORT:
          if (filter.value.includes("AC")) {
            newFilterState.chargingPort = "AC"
          } else if (filter.value.includes("DC")) {
            newFilterState.chargingPort = "DC"
          }
          break
      }
    })
    
    onChange(newFilterState)
  }
  
  return (
    <div className="mb-4">
      <div className="flex gap-2 flex-wrap justify-between">
        <div className="flex gap-2 flex-wrap">
          <Filters 
            filters={filters} 
            setFilters={handleFiltersChange} 
          />
          
          {filters.filter((filter) => filter.value?.length > 0).length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="transition group h-6 text-xs items-center rounded-sm"
              onClick={() => handleFiltersChange([])}
            >
              Temizle
            </Button>
          )}
          
          <Popover
            open={open}
            onOpenChange={(open) => {
              setOpen(open)
              if (!open) {
                setTimeout(() => {
                  setSelectedView(null)
                  setCommandInput("")
                }, 200)
              }
            }}
          >
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                role="combobox"
                aria-expanded={open}
                size="sm"
                className={cn(
                  "transition group h-6 text-xs items-center rounded-sm flex gap-1.5",
                  filters.length > 0 && "w-6"
                )}
              >
                <ListFilter className="size-3 shrink-0 transition-all text-muted-foreground group-hover:text-primary" />
                {!filters.length && "Filtrele"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <AnimateChangeInHeight>
                <Command>
                  <CommandInput
                    placeholder={selectedView ? (selectedView === FilterType.CHARGE_PORT ? "Şarj Portu" : selectedView) : "Filtrele..."}
                    className="h-9"
                    value={commandInput}
                    onInputCapture={(e) => {
                      setCommandInput(e.currentTarget.value)
                    }}
                    ref={commandInputRef}
                  />
                  <CommandList>
                    <CommandEmpty>Sonuç bulunamadı.</CommandEmpty>
                    {selectedView ? (
                      <CommandGroup>
                        {customFilterViewToFilterOptions[selectedView]?.map(
                          (filter) => (
                            <CommandItem
                              className="group text-muted-foreground flex gap-2 items-center"
                              key={filter.name}
                              value={filter.name}
                              onSelect={(currentValue) => {
                                handleFiltersChange([
                                  ...filters,
                                  {
                                    id: uuidv4(),
                                    type: selectedView,
                                    operator: FilterOperator.IS,
                                    value: [currentValue],
                                  },
                                ])
                                setTimeout(() => {
                                  setSelectedView(null)
                                  setCommandInput("")
                                }, 200)
                                setOpen(false)
                              }}
                            >
                              {filter.icon}
                              <span className="text-accent-foreground">
                                {filter.label || filter.name}
                              </span>
                            </CommandItem>
                          )
                        )}
                      </CommandGroup>
                    ) : (
                      customFilterViewOptions.map(
                        (group, index: number) => (
                          <React.Fragment key={index}>
                            <CommandGroup>
                              {group.map((filter) => (
                                <CommandItem
                                  className="group text-muted-foreground flex gap-2 items-center"
                                  key={filter.name + (filter.label || '')}
                                  value={filter.name}
                                  onSelect={(currentValue) => {
                                    setSelectedView(currentValue as FilterType)
                                    setCommandInput("")
                                    commandInputRef.current?.focus()
                                  }}
                                >
                                  {filter.icon}
                                  <span className="text-accent-foreground">
                                    {filter.label || filter.name}
                                  </span>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                            {index < customFilterViewOptions.length - 1 && (
                              <CommandSeparator />
                            )}
                          </React.Fragment>
                        )
                      )
                    )}
                  </CommandList>
                </Command>
              </AnimateChangeInHeight>
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="flex gap-1 flex-wrap">
          {batteryOptions.map((option) => (
            <Button
              key={option.label}
              variant={selectedBattery?.label === option.label ? "default" : "outline"}
              size="sm"
              className="text-xs whitespace-nowrap items-center h-6 rounded-sm"
              onClick={() => onBatteryChange(option)}
            >
              <Battery className="size-3.5 mr-1" />
              {option.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
} 