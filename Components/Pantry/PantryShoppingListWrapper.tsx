'use client'

import { useEffect, useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import Pantry from "./Pantry";
import ShoppingList from "./ShoppingList";
import { Ingredient } from "@/type/Recipe";

interface PantryShoppingListWrapperProps {
  pantryItems: Ingredient[];
  shoppingListItems: Ingredient[];
}

export default function PantryShoppingListWrapper({
  pantryItems,
  shoppingListItems,
}: PantryShoppingListWrapperProps) {
  const [tabIndex, setTabIndex] = useState(0);
  const [resizeKey, setResizeKey] = useState(0);

  useEffect(() => {
    // Trigger re-render on resize to fix indicator
    const resizeObserver = new ResizeObserver(() => {
      setResizeKey((prev) => prev + 1);
    });

    const modalRoot = document.getElementById('modal-content');
    if (modalRoot) resizeObserver.observe(modalRoot);

    return () => {
      if (modalRoot) resizeObserver.unobserve(modalRoot);
    };
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Box id="modal-content" sx={{ width: "100%" }}>
      <Tabs
        key={resizeKey}
        value={tabIndex}
        onChange={handleTabChange}
        aria-label="Pantry and Shopping List Tabs"
        sx={{ mb: 3 }}
        centered
      >
        <Tab label="Pantry" />
        <Tab label="Shopping List" />
      </Tabs>

      {tabIndex === 0 && <Pantry pantryItems={pantryItems} />}
      {tabIndex === 1 && <ShoppingList shoppingListItems={shoppingListItems} />}
    </Box>
  );
}
