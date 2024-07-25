import { Button, Input, Select, Table, Pagination } from '@/components/ui'
import React, { InputHTMLAttributes, useEffect, useMemo, useState } from 'react'
import { HiOutlineSearch } from 'react-icons/hi'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Select as SelectType } from '@/@types/select'
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useGetAllUsersQuery } from '@/services/RtkQueryService'
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

  const navigate = useNavigate()

  return (
    <div className="flex justify-between">
      <div>
        <h3>Usuarios</h3>
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
          Crear usuario
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

const Users = () => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [currentPage, setCurrentPage] = useState(+searchParams.get('page') || 1)
  const [pageSize, setPageSize] = useState(pageSizeOption[0].value)

  const columns = useMemo(
    () => [
      {
        header: 'ID',
        accessorKey: 'id',
      },
      {
        header: 'Usuario',
        cell: (cellProps: any) => (
          <span className="font-bold cursor-pointer">
            {cellProps.row.original.name} {cellProps.row.original.lastName}
          </span>
        ),
      },
      {
        header: 'Correo electronico',
        accessorKey: 'session.email',
      },
      {
        header: 'Documento de Identidad',
        cell: (cellProps: any) => (
          <>{cellProps.row.original.identityCard || 'N/A'}</>
        ),
      },
      {
        header: 'Sede',
        cell: (cellProps: any) => (
          <>{capitalizeFirstLetter(cellProps.row.original.sede.name)}</>
        ),
      },
      {
        header: 'Telefono del usuario',
        accessorKey: 'primaryPhone',
      },
      {
        header: 'Rol del usuario',
        accessorKey: 'session.rol.name',
      },
    ],
    [],
  )

  const { data, isFetching } = useGetAllUsersQuery(
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
        placeholder="Buscar usuario..."
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

export default Users
