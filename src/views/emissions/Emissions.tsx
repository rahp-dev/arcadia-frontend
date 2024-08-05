import { useMemo, useState, useEffect } from 'react'
import Table from '@/components/ui/Table'
import Input from '@/components/ui/Input'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table'
import type { ColumnFiltersState } from '@tanstack/react-table'
import type { InputHTMLAttributes } from 'react'
import { Button, Pagination, Select } from '@/components/ui'
import { Select as SelectType } from '@/@types/select'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useGetAllEmissionQuery } from '@/services/RtkQueryService'
import { HiOutlineEye, HiOutlineSearch } from 'react-icons/hi'
import { TableRowSkeleton } from '@/components/shared'
import { capitalizeFirstLetter } from '@/utils/capitalizeFirstLetter'

interface DebouncedInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'size' | 'prefix'
  > {
  value: string
  onChange: (value: string) => void
  debounce?: number
}

const { Tr, Th, Td, THead, TBody } = Table

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: DebouncedInputProps) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <div className="flex justify-between xl:flex-row lg:flex-row md:flex-row  mobile:flex-col xs:flex-col">
      <div>
        <h3 className="xl:mb-0 lg:mb-0 md:mb-0 mobile:mb-4 xs:mb-4">
          Emisiones
        </h3>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <Input
          {...props}
          prefix={<HiOutlineSearch className="text-lg" />}
          size="sm"
          value={value}
          className="shadow-none"
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    </div>
  )
}

const pageSizeOption: SelectType[] = [
  { value: 5, label: '5 por página' },
  { value: 10, label: '10 por página' },
  { value: 20, label: '20 por página' },
  { value: 50, label: '50 por página' },
]

const Emissions = () => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [currentPage, setCurrentPage] = useState(+searchParams.get('page') || 1)
  const [pageSize, setPageSize] = useState(pageSizeOption[0].value)
  const navigate = useNavigate()

  const { data, isFetching } = useGetAllEmissionQuery(
    {
      page: currentPage || 1,
      limit: pageSize,
      ...(search && { search: search }),
    },
    { refetchOnMountOrArgChange: true },
  )

  useEffect(() => {
    const queryParams = new URLSearchParams({
      limit: String(pageSize),
      page: String(currentPage),
      ...(search && { search: search }),
    })

    setSearchParams(queryParams)
  }, [pageSize, currentPage, search])

  const columns = useMemo(
    () => [
      {
        header: 'ID',
        accessorKey: 'id',
      },
      {
        header: 'Agencia de Vuelo',
        cell: (cellProps: any) => (
          <>{cellProps.row.original.agency?.name || 'N/A'}</>
        ),
      },
      {
        header: 'Aerolínea',
        cell: (cellProps: any) => (
          <>{cellProps.row.original.airline || 'N/A'}</>
        ),
      },
      {
        header: 'Sistema Proveedor',
        cell: (cellProps: any) => (
          <>{cellProps.row.original.providerSystem?.name || 'N/A'}</>
        ),
      },
      {
        header: 'Método de Pago',
        cell: (cellProps: any) => (
          <>
            {capitalizeFirstLetter(
              cellProps.row.original.paymentMethod?.name,
            ) || 'N/A'}
          </>
        ),
      },
      {
        header: 'Precio de Coste',
        cell: (cellProps: any) => {
          const costPrice = cellProps.row.original.costPrice
          return <>{costPrice !== null ? `${costPrice}$` : 'N/A'}</>
        },
      },
      {
        header: 'Pago del Cliente',
        cell: (cellProps: any) => {
          const clientPayment = cellProps.row.original.clientPayment
          return <>{clientPayment !== null ? `${clientPayment}$` : 'N/A'}</>
        },
      },
      {
        header: 'Total a Pagar',
        cell: (cellProps: any) => {
          const totalToPay = cellProps.row.original.totalToPay
          return <>{totalToPay !== null ? `${totalToPay}$` : 'N/A'}</>
        },
      },
      {
        header: 'Más Detalles',
        cell: (cellProps: any) => (
          <div className="flex justify-center items-center">
            <Button
              size="sm"
              variant="twoTone"
              icon={<HiOutlineEye />}
              onClick={() => {
                navigate(`/emisiones/${cellProps.row.original.id}`)
              }}
            />
          </div>
        ),
      },
    ],
    [],
  )

  const table = useReactTable({
    data: data?.data,
    columns,
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    debugColumns: false,
    debugHeaders: false,
    debugRows: false,
    debugTable: false,
  })

  const onPaginationChange = (page: number) => {
    table.setPageIndex(page - 1)
    setCurrentPage(page)
  }

  const onPageSelect = ({ value }: SelectType) => {
    setPageSize(value)
    table.setPageSize(Number(value))
  }

  return (
    <>
      <DebouncedInput
        value={search}
        className="p-2 font-lg shadow-sm"
        placeholder="Buscar emisión..."
        onChange={setSearch}
      />
      <Table>
        <THead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <Th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </div>
                    )}
                  </Th>
                )
              })}
            </Tr>
          ))}
        </THead>
        {isFetching ? (
          <TableRowSkeleton columns={9} rows={pageSize} />
        ) : (
          <TBody>
            {table.getRowModel().rows.map((row) => {
              return (
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <Td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </Td>
                    )
                  })}
                </Tr>
              )
            })}
          </TBody>
        )}
      </Table>

      <div className="flex items-center justify-between mt-5">
        <Pagination
          currentPage={+data?.meta?.page}
          total={data?.meta.totalItems}
          pageSize={pageSize}
          onChange={onPaginationChange}
        />
        <div style={{ minWidth: 130 }}>
          <Select
            size="sm"
            isSearchable={false}
            defaultValue={pageSizeOption[0]}
            options={pageSizeOption}
            onChange={(selected) => onPageSelect(selected as SelectType)}
          />
        </div>
      </div>
    </>
  )
}

export default Emissions
