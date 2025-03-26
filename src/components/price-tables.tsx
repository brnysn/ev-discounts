import React, { useId, useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Company } from "@/types";
import { calculateDiscountedPrice } from '@/lib/discount-utils';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ListFilter, CircleX, ChevronUp, ChevronDown } from "lucide-react";
import {
  ColumnDef,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

interface PriceTablesProps {
  data: Company[];
}

type PriceData = {
  id: string;
  company: string;
  logo: string;
  power: string;
  originalPrice: number;
  discountedPrice: number | null;
  discountRate: number | null;
  status: 'active' | 'coming_soon' | 'expired';
};

const fuzzyFilter: FilterFn<PriceData> = (row, columnId, filterValue: string) => {
  const value = row.getValue(columnId);
  if (typeof value === 'number') {
    return value.toString().includes(filterValue);
  }
  return String(value).toLowerCase().includes(filterValue.toLowerCase());
};

interface PriceTableProps {
  title: string;
  data: PriceData[];
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
}

function PriceTable({ 
  title, 
  data, 
  globalFilter, 
  onGlobalFilterChange,
}: PriceTableProps) {
  const id = useId();
  const [sorting, setSorting] = useState<SortingState>([{ id: "price", desc: false }]);

  const columns = useMemo<ColumnDef<PriceData, unknown>[]>(
    () => [
      {
        id: "company",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="-ml-4 font-semibold"
            >
              Şirket
              {column.getIsSorted() === "asc" ? (
                <ChevronUp className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === "desc" ? (
                <ChevronDown className="ml-2 h-4 w-4" />
              ) : (
                <ChevronUp className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </Button>
          )
        },
        accessorFn: (row) => row.company,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Image src={row.original.logo} alt={row.getValue("company")} width={32} height={32} className="w-8 h-8 object-contain" />
            <span className="font-semibold">{row.getValue("company")}</span>
          </div>
        ),
      },
      {
        id: "power",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="-ml-4 font-semibold"
            >
              Güç (kWh)
              {column.getIsSorted() === "asc" ? (
                <ChevronUp className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === "desc" ? (
                <ChevronDown className="ml-2 h-4 w-4" />
              ) : (
                <ChevronUp className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </Button>
          )
        },
        accessorFn: (row) => {
          const power = row.power;
          return power ? parseFloat(power.replace(',', '.')) : 0;
        },
        cell: ({ row }) => {
          const power = row.original.power;
          return power || "-";
        },
      },
      {
        id: "price",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="-ml-4 font-semibold"
            >
              Fiyat
              {column.getIsSorted() === "asc" ? (
                <ChevronUp className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === "desc" ? (
                <ChevronDown className="ml-2 h-4 w-4" />
              ) : (
                <ChevronUp className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </Button>
          )
        },
        accessorFn: (row) => row.discountedPrice || row.originalPrice,
        cell: ({ row }) => {
          const originalPrice = row.original.originalPrice;
          const discountedPrice = row.original.discountedPrice;
          const discountRate = row.original.discountRate;

          let badgeColor = "bg-orange-100 text-orange-800";
          if (discountRate && discountRate >= 60) {
            badgeColor = "bg-green-100 text-green-800";
          } else if (discountRate && discountRate >= 30) {
            badgeColor = "bg-yellow-100 text-yellow-800";
          }

          return (
            <div className="flex flex-col gap-1">
              {discountedPrice ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="line-through text-gray-500">₺{originalPrice.toFixed(2)}</span>
                    <span className="text-green-600 font-medium">₺{discountedPrice.toFixed(2)}</span>
                  </div>
                  <span className={cn("text-xs px-2 py-0.5 rounded-full w-fit", badgeColor)}>
                    %{discountRate}
                  </span>
                </>
              ) : (
                <span>₺{originalPrice.toFixed(2)}</span>
              )}
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable<PriceData>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      sorting,
      globalFilter,
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="relative">
          <Input
            id={`${id}-input`}
            className={cn(
              "peer min-w-60 ps-9",
              Boolean(globalFilter) && "pe-9",
            )}
            value={globalFilter}
            onChange={(e) => onGlobalFilterChange(e.target.value)}
            placeholder="İsim veya kWh değeri ile filtrele..."
            type="text"
          />
          <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80">
            <ListFilter size={16} strokeWidth={2} />
          </div>
          {Boolean(globalFilter) && (
            <button
              className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 hover:text-foreground"
              onClick={() => onGlobalFilterChange("")}
            >
              <CircleX size={16} strokeWidth={2} />
            </button>
          )}
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="group">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Sonuç bulunamadı.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export function PriceTables({ data }: PriceTablesProps) {
  const [globalFilter, setGlobalFilter] = useState("");

  const filteredDCData = useMemo(() => {
    // Move getDCPrices inside the useMemo callback
    const getDCPricesInner = () => {
      return data.map(company => {
        const prices = company.prices[0];
        const currentDiscount = company.discounts.find(d => {
          const now = new Date();
          const startDate = new Date(d.starts_at);
          const endDate = new Date(d.ends_at);
          return now >= startDate && now <= endDate;
        });

        const getStatus = (discount: typeof currentDiscount): PriceData['status'] => {
          if (!discount) return 'expired';
          const now = new Date();
          const startDate = new Date(discount.starts_at);
          const endDate = new Date(discount.ends_at);
          if (now < startDate) return 'coming_soon';
          if (now > endDate) return 'expired';
          return 'active';
        };

        const dcPrices = prices.dc.map((price, index) => {
          const powerValue = typeof price.kwh === 'string' ? price.kwh : String(price.kwh);
          return {
            id: `${company.name}-dc-${index}`,
            company: company.name,
            logo: company.logo,
            power: powerValue,
            originalPrice: price.price,
            discountedPrice: currentDiscount?.discount_rate ? calculateDiscountedPrice(price.price, currentDiscount.discount_rate) : null,
            discountRate: currentDiscount?.discount_rate ?? null,
            status: getStatus(currentDiscount)
          };
        });

        return dcPrices;
      }).flat();
    };
    
    let prices = getDCPricesInner();
    
    // Apply search filter
    if (globalFilter) {
      const searchTerm = globalFilter.toLowerCase();
      prices = prices.filter(row => 
        row.company.toLowerCase().includes(searchTerm) ||
        row.power.toString().includes(searchTerm)
      );
    }

    return prices;
  }, [globalFilter, data]);

  const filteredACData = useMemo(() => {
    // Move getACPrices inside the useMemo callback
    const getACPricesInner = () => {
      return data.map(company => {
        const prices = company.prices[0];
        const currentDiscount = company.discounts.find(d => {
          const now = new Date();
          const startDate = new Date(d.starts_at);
          const endDate = new Date(d.ends_at);
          return now >= startDate && now <= endDate;
        });

        const getStatus = (discount: typeof currentDiscount): PriceData['status'] => {
          if (!discount) return 'expired';
          const now = new Date();
          const startDate = new Date(discount.starts_at);
          const endDate = new Date(discount.ends_at);
          if (now < startDate) return 'coming_soon';
          if (now > endDate) return 'expired';
          return 'active';
        };

        const acPrices = prices.ac.map((price, index) => {
          const powerValue = typeof price.kwh === 'string' ? price.kwh : String(price.kwh);
          return {
            id: `${company.name}-ac-${index}`,
            company: company.name,
            logo: company.logo,
            power: powerValue,
            originalPrice: price.price,
            discountedPrice: currentDiscount?.discount_rate ? calculateDiscountedPrice(price.price, currentDiscount.discount_rate) : null,
            discountRate: currentDiscount?.discount_rate ?? null,
            status: getStatus(currentDiscount)
          };
        });

        return acPrices;
      }).flat();
    };
    
    let prices = getACPricesInner();
    
    // Apply search filter
    if (globalFilter) {
      const searchTerm = globalFilter.toLowerCase();
      prices = prices.filter(row => 
        row.company.toLowerCase().includes(searchTerm) ||
        row.power.toString().includes(searchTerm)
      );
    }

    return prices;
  }, [globalFilter, data]);

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PriceTable
          title="DC Şarj Fiyatları"
          data={filteredDCData}
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
        />
        <PriceTable
          title="AC Şarj Fiyatları"
          data={filteredACData}
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
        />
      </div>
    </div>
  );
} 