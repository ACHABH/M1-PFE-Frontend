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

type Props<TData extends any[], TColumns extends ColumnDef<any, any>[]> = {
  data: TData;
  columns: TColumns;
};

export default function table<
  TData extends any[],
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
    debugAll: import.meta.env.DEV,
    autoResetAll: true,
  });

  const { rows } = table.getRowModel();

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,
    overscan: 5,
    measureElement:
      typeof window !== "undefined" &&
      navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    debug: import.meta.env.DEV,
  });

  return (
    <Container
      as="div"
      ref={parentRef}
      style={{ height: "427px", overflow: "auto" }}
    >
      <Container
        as="div"
        style={{
          height: `${virtualizer.getTotalSize()}px`,
        }}
      >
        <BootstrapTable striped bordered hover style={{ whiteSpace: "nowrap" }}>
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
            {virtualizer.getVirtualItems().map((virtualRow, index) => {
              const row = rows[virtualRow.index];
              return (
                <tr
                  data-index={virtualRow.index}
                  key={row.id}
                  ref={(node) => virtualizer.measureElement(node)}
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${
                      virtualRow.start - index * virtualRow.size
                    }px)`,
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </BootstrapTable>
      </Container>
    </Container>
  );
}
