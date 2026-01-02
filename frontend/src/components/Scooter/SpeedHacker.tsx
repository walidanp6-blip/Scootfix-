import React, { useState } from "react";
import { patchFirmware } from "../../api/scooterApi";
import { TextField, Button, Container, Typography } from "@mui/material";

const SpeedHacker = () => {
  const [address, setAddress] = useState("");
  const [model, setModel] = useState("");
  const [version, setVersion] = useState("");
  const [status, setStatus] = useState("");

  const handlePatch = async () => {
    setStatus("جار تعديل ورفع الفيرموير...");
    try {
      await patchFirmware({ address, model, version });
      setStatus("تم كسر السرعة ورفع الفيرموير بنجاح");
    } catch {
      setStatus("فشل تعديل الفيرموير");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" gutterBottom>كسر سرعة السكوتر</Typography>
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
      <Button variant="contained" onClick={handlePatch} sx={{ mt: 2 }}>
        كسر السرعة
      </Button>
      {status && <Typography sx={{ mt: 2 }}>{status}</Typography>}
    </Container>
  );
};

export default SpeedHacker;