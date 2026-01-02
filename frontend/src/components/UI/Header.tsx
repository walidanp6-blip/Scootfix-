import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";

const Header = () => {
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    window.location.href = "/login";
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          تطبيق السكوتر الكهربائي
        </Typography>
        <Button color="inherit" onClick={handleLogout}>
          تسجيل خروج
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;