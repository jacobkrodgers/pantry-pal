"use client";

import React from "react";
import { TextField } from "@mui/material";

interface EmailInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function EmailInput({ value, onChange }: EmailInputProps) {
  return (
    <TextField
      label="Email"
      type="email"
      value={value}
      onChange={onChange}
      required
      helperText="(Use a valid email address)"
      sx={{ width: "100%" }}
    />
  );
}
