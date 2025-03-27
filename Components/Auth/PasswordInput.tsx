"use client";

import React from "react";
import { TextField } from "@mui/material";

interface PasswordInputProps {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PasswordInput({
  label = "Password",
  value,
  onChange,
}: PasswordInputProps) {
  return (
    <TextField
      label={label}
      type="password"
      value={value}
      onChange={onChange}
      required
      helperText="(At least 8 characters)"
      inputProps={{ minLength: 8 }}
      sx={{ width: "100%" }}
    />
  );
}
