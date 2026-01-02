import apiClient from "./apiClient";

interface ConnectRequest {
  address: string;
  model: string;
  version: string;
}

export const connectDevice = (data: ConnectRequest) =>
  apiClient.post("/connect", data);

export const readFirmware = (data: ConnectRequest) =>
  apiClient.post("/read_firmware", data);

export const patchFirmware = (data: ConnectRequest) =>
  apiClient.post("/patch_firmware", data);