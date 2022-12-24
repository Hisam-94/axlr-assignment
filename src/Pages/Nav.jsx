import { Box } from "@mui/material";
import React from "react";

const Nav = () => {
  return (
    <Box Droppable>
      <Box
        display="flex"
        bgcolor="white"
        justifyContent={"space-around"}
        p="1rem"
        m=".5rem"
      >
        <Box display="flex" gap={"2rem"}>
          <Box>Home</Box>
          <Box>Menu</Box>
        </Box>
        <Box as="b">LOGO</Box>
        <Box>Contact</Box>
      </Box>
    </Box>
  );
};

export default Nav;
