import * as React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  chakra,
} from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import {
  useTable,
  useSortBy,
  Column,
  useFilters,
  useGlobalFilter,
  Row,
  IdType,
} from "react-table";
import { TitleColumnFilterComponent } from "./Filters";

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
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    state,
    prepareRow,
    // setGlobalFilter,
    // preGlobalFilteredRows,
  } = useTable(
    {
      columns,
      data,
      initialState: {
        hiddenColumns: ["translatedTitle", "translatedText", "text"],
      },
    },
    useFilters,
    // useGlobalFilter,
    useSortBy
  );

  return (
    <>
      <Table {...getTableProps()}>
        <Thead>
          {headerGroups.map((headerGroup) => (
            <Tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <Th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.canFilter ? column.render("Filter") : null}
                  {column.Header?.toString() != "Title"
                    ? column.render("Header")
                    : null}
                  {column.Header?.toString() != "Title" ? (
                    <chakra.span pl="4">
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <TriangleDownIcon aria-label="sorted descending" />
                        ) : (
                          <TriangleUpIcon aria-label="sorted ascending" />
                        )
                      ) : null}
                    </chakra.span>
                  ) : null}
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
    </>
  );
}
