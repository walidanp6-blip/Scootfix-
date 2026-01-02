import React, { useState } from "react";
import { connectDevice } from "../../api/scooterApi";
import { TextField, Button, Container, Typography } from "@mui/material";

const ConnectDevice = () => {
  const [address, setAddress] = useState("");
  const [model, setModel] = useState("");
  const [version, setVersion] = useState("");
  const [status, setStatus] = useState("");

  const handleConnect = async () => {
    setStatus("جار الاتصال...");
    try {
      await connectDevice({ address, model, version });
      setStatus("تم الاتصال بنجاح");
    } catch {
      setStatus("فشل الاتصال، تحقق من البيانات");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" gutterBottom>الاتصال بالسكوتر</Typography>
      <TextField
        fullWidth
        label="عنوان البلوتوث"
        margin="normal"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <TextField
        fullWidth
        label="موديل السكوتر"
        margin="normal"
        value={model}
        onChange={(e) => setModel(e.target.value)}
      />
      <TextField
        fullWidth
        label="الإصدار"
        margin="normal"
        value={version}
        onChange={(e) => setVersion(e.target.value)}
      />
      <Button variant="contained" onClick={handleConnect} sx={{ mt: 2 }}>
        اتصال
      </Button>
      {status && <Typography sx={{ mt: 2 }}>{status}</Typography>}
    </Container>
  );
};

export default ConnectDevice;