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
import { useGetAllTicketsQuery } from '@/services/RtkQueryService'
import { HiOutlineSearch } from 'react-icons/hi'
import { TableRowSkeleton } from '@/components/shared'

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

  const navigate = useNavigate()

  return (
    <div className="flex justify-between">
      <div>
        <h3>Tickets</h3>
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
        <Button
          size="sm"
          variant="solid"
          onClick={() => {
            navigate('crear')
          }}
        >
          Crear ticket
        </Button>
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

const Tickets = () => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [currentPage, setCurrentPage] = useState(+searchParams.get('page') || 1)
  const [pageSize, setPageSize] = useState(pageSizeOption[0].value)

  const { data, isFetching } = useGetAllTicketsQuery(
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
        header: 'Cliente',
        cell: (cellProps: any) => (
          <span className="font-bold cursor-pointer">
            {cellProps.row.original.customer.name}{' '}
            {cellProps.row.original.customer.last_name}
          </span>
        ),
      },
      {
        header: 'Origen',
        accessorKey: 'origin',
      },
      {
        header: 'Destino',
        accessorKey: 'destination',
      },
      {
        header: 'Fecha de salida',
        accessorKey: 'flightDate',
      },
      {
        header: 'Fecha de retorno',
        accessorKey: 'flightDateReturn',
        cell: (cellProps: any) => (
          <>{cellProps.row.original.flightDateReturn || 'Sin retorno'}</>
        ),
      },
      {
        header: 'Localizador',
        cell: (cellProps: any) => {
          const details_ticket = cellProps.row.original.details_ticket
          const trackerTicket = details_ticket.location

          return <span className="font-semibold">{trackerTicket}</span>
        },
      },
      {
        header: 'Precio',
        accessorKey: 'price',
        cell: (cellProps: any) => <span>{cellProps.row.original.price}$</span>,
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
        placeholder="Buscar cliente..."
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
          <TableRowSkeleton columns={5} rows={pageSize} />
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

export default Tickets
