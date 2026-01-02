import React, { useState } from "react";
import { login } from "../../api/authApi";
import { TextField, Button, Container, Typography } from "@mui/material";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await login({ username, password });
      localStorage.setItem("access_token", res.data.access_token);
      window.location.href = "/"; // إعادة التوجيه للصفحة الرئيسية
    } catch {
      setError("فشل تسجيل الدخول، تحقق من البيانات");
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" gutterBottom>تسجيل الدخول</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="اسم المستخدم"
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          fullWidth
          type="password"
          label="كلمة المرور"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }}>
          دخول
        </Button>
      </form>
    </Container>
  );
};

export default Login;