import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import * as React from "react";
import { Column, useTable } from "react-table";

export type DataTableProps<Data extends object> = {
  data: Data[];
  columns: Column<Data>[];
};

/**
 * Table: table component
 * THead: header of the tablet
 *    Tr: table row: a row in a data
 *        Th: table header: a cell of a header
 * Tbody: body of the table
 *    Tr:
 *        Td: table data: a cell of a normal data
 */

export function DataTable<Data extends object>({
  data,
  columns,
}: DataTableProps<Data>) {
  const defaultColumn = React.useMemo(
    () => ({
      // When using the useFlexLayout:
      minWidth: 10, // minWidth is only used as a limit for resizing
      width: 100, // width is used for both the flex-basis and flex-grow
      maxWidth: 300, // maxWidth is only used as a limit for resizing
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    state,
    prepareRow,
    visibleColumns,
    state: { pageIndex, pageSize },
    // setGlobalFilter,
    // preGlobalFilteredRows,
  } = useTable(
    {
      columns,
      defaultColumn,
      data,
      initialState: {
        hiddenColumns: [
          "translatedTitle",
          "translatedText",
          "text",
          "is_archived",
        ],
      },
    }
    // useFilters,
    // useFlexLayout
  );

  return (
    <Table
      {...getTableProps({
        style: {
          borderWidth: 1,
          borderColor: "white",
          margin: "1rem",
        },
      })}
    >
      <Thead>
        {headerGroups.map((headerGroup) => (
          <Tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <Th {...column.getHeaderProps()}>
                {column.canFilter ? column.render("Filter") : null}
                {column.render("Header")}
              </Th>
            ))}
          </Tr>
        ))}
      </Thead>
      <Tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <Tr {...row.getRowProps()}>
              {row.cells.map((cell) => (
                <Td {...cell.getCellProps()}>{cell.render("Cell")}</Td>
              ))}
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
}
