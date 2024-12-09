/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ElementRef, useEffect, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  type ColumnDef,
  Row,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

type Props<TData extends Array<any>, TColumns extends ColumnDef<any, any>[]> = {
  data: TData;
  columns: TColumns;
};

export default function Table<
  TData extends Array<any>,
  TColumns extends ColumnDef<any, any>[],
>({ data, columns }: Props<TData, TColumns>) {
  const parentRef = useRef<ElementRef<"div">>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rows, setRows] = useState<Row<any>[]>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    manualSorting: true,
    debugTable: import.meta.env.DEV,
  });

  useEffect(() => {
    const { rows } = table.getRowModel();
    setRows(rows);
  }, [table]);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 33,
    overscan: 5,
    measureElement:
      typeof window !== "undefined" &&
      navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
  });

  return (
    <div ref={parentRef} style={{ overflowX: "auto" }}>
      <table
        className="table table-bordered table-striped"
        style={{ whiteSpace: "nowrap" }}
      >
        <thead>
          {table.getHeaderGroups().map((group) => (
            <tr key={group.id}>
              {group.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder ? null : (
                    <div
                      onClick={(e) => {
                        if (!header.column.getCanSort()) return;
                        header.column.getToggleSortingHandler()?.(e);
                      }}
                      style={{
                        cursor: header.column.getCanSort() ? "pointer" : "auto",
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: " 🔼",
                        desc: " 🔽",
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index];
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
