import React, { useState } from "react";
import { readFirmware } from "../../api/scooterApi";
import { TextField, Button, Container, Typography, Paper } from "@mui/material";

const FirmwareViewer = () => {
  const [address, setAddress] = useState("");
  const [model, setModel] = useState("");
  const [version, setVersion] = useState("");
  const [firmwareHex, setFirmwareHex] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [status, setStatus] = useState("");

  const handleRead = async () => {
    setStatus("جار قراءة الفيرموير...");
    try {
      const res = await readFirmware({ address, model, version });
      setFirmwareHex(res.data.firmware_data);
      setAnalysis(res.data.analysis);
      setStatus("تمت القراءة بنجاح");
    } catch {
      setStatus("فشل قراءة الفيرموير");
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h5" gutterBottom>عرض الفيرموير وتحليله</Typography>
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
      <Button variant="contained" onClick={handleRead} sx={{ mt: 2 }}>
        قراءة الفيرموير
      </Button>
      {status && <Typography sx={{ mt: 2 }}>{status}</Typography>}
      {firmwareHex && (
        <Paper sx={{ mt: 2, p: 2, maxHeight: 300, overflow: "auto" }}>
          <Typography variant="body2" component="pre" style={{ whiteSpace: "pre-wrap" }}>
            {firmwareHex}
          </Typography>
          {analysis && (
            <Typography sx={{ mt: 2 }}>
              السرعة الحالية (byte offset {analysis.speed_offset}): {analysis.current_speed}
            </Typography>
          )}
        </Paper>
      )}
    </Container>
  );
};

export default FirmwareViewer;