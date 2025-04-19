"use client";

import { useState } from "react";
import { Pagination, Stack } from "@mui/material";

const itemsPerPage = 10;
const totalItems = 100; // Example total items

export default function RecipePagination() {
  const [page, setPage] = useState(1);

  const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <Stack 
        spacing={2} 
        alignItems="center"
    >
        <Pagination
            count={Math.ceil(totalItems / itemsPerPage)}
            page={page}
            onChange={handleChange}
            variant="outlined"
            color="primary"
        />
    </Stack>
  );
}
