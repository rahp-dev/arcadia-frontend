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
import { rankItem } from '@tanstack/match-sorter-utils'
import type {
    ColumnDef,
    FilterFn,
    ColumnFiltersState,
} from '@tanstack/react-table'
import type { InputHTMLAttributes } from 'react'
import { Button, Pagination, Select } from '@/components/ui'
import { Select as SelectType } from '@/@types/select'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useGetAllClientsQuery } from '@/services/RtkQueryService'
import { PaginateResult } from '@/services/core-entities/paginated-result.entity'
import { Client } from '@/services/clients/types/client.type'

interface DebouncedInputProps
    extends Omit<
        InputHTMLAttributes<HTMLInputElement>,
        'onChange' | 'size' | 'prefix'
    > {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
}

const { Tr, Th, Td, THead, TBody, Sorter } = Table

type Option = {
    value: number
    label: string
}

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
                <h3>Clientes</h3>
            </div>

            <div className="flex items-center gap-4 mb-4">
                <Input
                    {...props}
                    value={value}
                    size="sm"
                    onChange={(e) => setValue(e.target.value)}
                />
                <Button
                    size="sm"
                    variant="solid"
                    onClick={() => {
                        navigate('crear')
                    }}
                >
                    Crear cliente
                </Button>
            </div>
        </div>
    )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    // Rank the item
    const itemRank = rankItem(row.getValue(columnId), value)

    // Store the itemRank info
    addMeta({
        itemRank,
    })

    // Return if the item should be filtered in/out
    return itemRank.passed
}

const pageSizeOption: SelectType[] = [
    { value: 10, label: '10 por página' },
    { value: 20, label: '20 por página' },
    { value: 50, label: '50 por página' },
]

const Clients = () => {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [searchParams, setSearchParams] = useSearchParams()
    const [search, setSearch] = useState(searchParams.get('search') || '')
    const [currentPage, setCurrentPage] = useState(
        +searchParams.get('page') || 1,
    )
    const [pageSize, setPageSize] = useState(pageSizeOption[0].value)

    const { data, isFetching } = useGetAllClientsQuery(
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
            { header: 'ID del cliente', accessorKey: 'id' },
            { header: 'Nombre del cliente', accessorKey: 'name' },
            { header: 'Apellido del cliente', accessorKey: 'lastName' },
            { header: 'Documento de Identidad', accessorKey: 'identityCard' },
            { header: 'Pais de origen', accessorKey: 'country' },
            { header: '¿Viajero frecuente?', accessorKey: 'frequentTraveler' },
        ],
        [],
    )

    const dataFake = [
        {
            id: '#1000',
            name: 'Felix',
            lastName: 'Cicilia',
            identityCard: '27557845',
            country: 'Venezuela',
            frequentTraveler: 'Sí',
        },
    ]

    const table = useReactTable({
        data: dataFake,
        columns,
        filterFns: {
            fuzzy: fuzzyFilter,
        },
        state: {
            columnFilters,
            globalFilter,
        },
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: fuzzyFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
        debugHeaders: true,
        debugColumns: false,
    })

    const onPaginationChange = (page: number) => {
        table.setPageIndex(page - 1)
    }

    const onSelectChange = (value = 0) => {
        table.setPageSize(Number(value))
    }

    return (
        <>
            <DebouncedInput
                value={globalFilter ?? ''}
                className="p-2 font-lg shadow-sm"
                placeholder="Buscar cliente..."
                onChange={(value) => setGlobalFilter(String(value))}
            />
            <Table>
                <THead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <Th
                                        key={header.id}
                                        colSpan={header.colSpan}
                                    >
                                        {header.isPlaceholder ? null : (
                                            <div
                                                {...{
                                                    className:
                                                        header.column.getCanSort()
                                                            ? 'cursor-pointer select-none'
                                                            : '',
                                                    onClick:
                                                        header.column.getToggleSortingHandler(),
                                                }}
                                            >
                                                {flexRender(
                                                    header.column.columnDef
                                                        .header,
                                                    header.getContext(),
                                                )}
                                                {
                                                    <Sorter
                                                        sort={header.column.getIsSorted()}
                                                    />
                                                }
                                            </div>
                                        )}
                                    </Th>
                                )
                            })}
                        </Tr>
                    ))}
                </THead>
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
            </Table>

            <div className="flex items-center justify-between mt-5">
                <Pagination
                    currentPage={+data?.meta?.page}
                    total={data?.meta.totalItems}
                    onChange={onPaginationChange}
                    pageSize={pageSize}
                />
                <div style={{ minWidth: 130 }}>
                    <Select<Option>
                        size="sm"
                        isSearchable={false}
                        defaultValue={pageSizeOption[0]}
                        options={pageSizeOption}
                        onChange={(option) => onSelectChange(option?.value)}
                    />
                </div>
            </div>
        </>
    )
}

export default Clients
