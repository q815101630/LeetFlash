import { Input, HStack, Text, Button } from "@chakra-ui/react";
import { FlattenedCard, Question } from "interfaces/interfaces";
import React from "react";
import { Row } from "react-table";

import { DifficultyType, selectSettings } from "redux/settings/settingsSlice";
// Component for Default Column Filter
export const TitleColumnFilterComponent = ({
  column: {
    filterValue,
    preFilteredRows: { length },
    setFilter,
  },
}: {
  column: { filterValue: any; preFilteredRows: any; setFilter: any };
}) => {
  return (
    <HStack w="100%" h="100%">
      <Button variant="ghost">Title</Button>,
      <Input
        value={filterValue || ""}
        onChange={(e) => {
          // Set undefined to remove the filter entirely
          setFilter(e.target.value || undefined);
        }}
        placeholder={`Search ${length} records..`}
      />
    </HStack>
  );
};

export const TitleColumnFilter = (
  rows: Array<Row<FlattenedCard>>,
  columnIds: Array<string>,
  filterValue: string
): Array<Row<FlattenedCard>> => {
  return rows.filter((row) => {
    return (
      row.values["title"]?.toLowerCase().includes(filterValue?.toLowerCase()) ||
      row.values["translatedTitle"]
        ?.toLowerCase()
        .includes(filterValue?.toLowerCase())
    );
  });
};
