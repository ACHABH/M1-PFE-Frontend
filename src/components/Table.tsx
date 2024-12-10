/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ElementRef, useRef, useState } from "react";
import BootstrapTable from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  type ColumnDef,
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

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    debugTable: import.meta.env.DEV,
  });

  const { rows } = table.getRowModel();

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
    <Container as="div" ref={parentRef} style={{ overflowX: "auto" }}>
      <BootstrapTable striped bordered hover>
        <thead>
          {table.getHeaderGroups().map((group) => (
            <tr key={group.id}>
              {group.headers.map((header) => {
                const canSort = header.column.getCanSort();
                const isSorted = header.column.getIsSorted();
                return (
                  <th key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div
                        onClick={(e) => {
                          if (!canSort) return;
                          header.column.getToggleSortingHandler()?.(e);
                        }}
                        style={{
                          cursor: canSort ? "pointer" : "auto",
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {isSorted === "asc"
                          ? " 🔼"
                          : isSorted === "desc"
                            ? " 🔽"
                            : null}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index];
            return (
              <tr
                data-index={virtualRow.index}
                key={row.id}
                ref={(node) => virtualizer.measureElement(node)}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </BootstrapTable>
    </Container>
  );
}
