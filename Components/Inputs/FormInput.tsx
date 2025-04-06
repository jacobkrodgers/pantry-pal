"use client";

import React from "react";
import { TextField, TextFieldProps } from "@mui/material";

type FormInputProps = TextFieldProps & {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessage?: string;
};

export default function FormInput({
  label,
  value,
  onChange,
  errorMessage,
  ...props
}: FormInputProps) {
  return (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      error={Boolean(errorMessage)}
      helperText={errorMessage}
      fullWidth
      {...props}
    />
  );
}
