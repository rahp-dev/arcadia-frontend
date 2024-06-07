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

import type { FilterFn, ColumnFiltersState } from '@tanstack/react-table'
import type { InputHTMLAttributes } from 'react'
import { Button } from '@/components/ui'
import { HiOutlinePlus } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'

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

function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
}: DebouncedInputProps) {
    const [value, setValue] = useState(initialValue)
    const navigate = useNavigate()

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
        <div className="flex justify-between">
            <div>
                <h3>Asignaciones</h3>
            </div>

            <div className="flex flex-row gap-4">
                <div className="flex items-center mb-4">
                    <Input
                        {...props}
                        size="sm"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />
                </div>
                <div>
                    <Button
                        size="sm"
                        variant="solid"
                        icon={<HiOutlinePlus />}
                        onClick={() => {
                            navigate('crear')
                        }}
                    >
                        Crear asignación
                    </Button>
                </div>
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

const Orders = () => {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')

    const columns = useMemo(
        () => [
            {
                header: 'Asesor',
                accessorKey: 'advisor',
                cell: (cellProps: any) => (
                    <span className="font-bold">
                        {cellProps.row.original.advisor}
                    </span>
                ),
            },
            { header: 'Fecha', accessorKey: 'date' },
            { header: 'Nombre del Cliente', accessorKey: 'nameClient' },
            { header: 'ID del Cliente', accessorKey: 'idClient' },
            { header: 'Origen', accessorKey: 'origin' },
            { header: 'Observaciones', accessorKey: 'observations' },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: (cellProps: any) => (
                    <Button size="sm" variant="solid" block>
                        {cellProps.row.original.status}
                    </Button>
                ),
            },
        ],
        [],
    )

    const data = [
        {
            advisor: 'Yoander Robles',
            date: new Date().toLocaleDateString(),
            nameClient: 'Pepe Garcia',
            idClient: '04124542216',
            origin: 'WhatsApp',
            status: 'En espera',
            observations: 'lorem ipsum lorem ipsum lorem ipsum',
        },
    ]

    const table = useReactTable({
        data,
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

    return (
        <>
            <DebouncedInput
                value={globalFilter ?? ''}
                className="p-2 font-lg shadow-sm border border-block"
                placeholder="Buscar..."
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
        </>
    )
}

export default Orders
