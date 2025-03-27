"use client";

import React from "react";
import { Box, Typography, Divider, Button } from "@mui/material";

interface FormProps {
  title: string;
  inputs: React.ReactNode[];
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  submitLabel?: string;
}

export default function Form({
  title,
  inputs,
  onSubmit,
  submitLabel = "Submit",
}: FormProps) {
  return (
    <Box sx={{ maxWidth: 800, margin: "auto", mt: 4 }}>
      <Box
        sx={{
          border: "1px solid #ccc",
          borderRadius: 2,
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          {title}
        </Typography>
        <Divider />
        <Box
          component="form"
          onSubmit={onSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {inputs.map((input, index) => (
            <div key={index}>{input}</div>
          ))}
          <Button
            variant="contained"
            type="submit"
            sx={{
              backgroundColor: "black",
              color: "white",
              ":hover": { backgroundColor: "#333" },
              mt: 2,
            }}
            fullWidth
          >
            {submitLabel}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
