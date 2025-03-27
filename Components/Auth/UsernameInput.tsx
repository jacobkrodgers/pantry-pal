"use client";

import React from "react";
import { TextField } from "@mui/material";

interface UsernameInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function UsernameInput({ value, onChange }: UsernameInputProps) {
  return (
    <TextField
      label="Username"
      value={value}
      onChange={onChange}
      required
      helperText="(Letters and numbers only)"
      sx={{ width: "100%" }}
    />
  );
}
