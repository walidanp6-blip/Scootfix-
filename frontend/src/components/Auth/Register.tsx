import React, { useState } from "react";
import { register } from "../../api/authApi";
import { TextField, Button, Container, Typography } from "@mui/material";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await register({ username, password });
      setSuccess("تم التسجيل بنجاح، يمكنك تسجيل الدخول الآن");
    } catch {
      setError("فشل التسجيل، قد يكون اسم المستخدم موجود");
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" gutterBottom>إنشاء حساب</Typography>
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
        {success && <Typography color="primary">{success}</Typography>}
        <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }}>
          تسجيل
        </Button>
      </form>
    </Container>
  );
};

export default Register;