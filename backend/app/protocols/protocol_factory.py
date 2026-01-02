import json
import os
from .base_protocol import BaseProtocol

CONFIG_PATH = os.path.join(os.path.dirname(__file__), "protocols_config.json")

with open(CONFIG_PATH, "r") as f:
    protocols_config = json.load(f)

class DynamicProtocol(BaseProtocol):
    def __init__(self, address: str, firmware_uuid: str, speed_offset: int):
        super().__init__(address)
        self.firmware_uuid = firmware_uuid
        self.speed_offset = speed_offset

    async def read_firmware(self) -> bytes:
        data = bytearray()
        for _ in range(200):  # حسب حجم الفيرموير
            chunk = await self.client.read_gatt_char(self.firmware_uuid)
            data.extend(chunk)
        return bytes(data)

    async def flash_firmware(self, firmware_bytes: bytes) -> bool:
        chunk_size = 20
        for i in range(0, len(firmware_bytes), chunk_size):
            await self.client.write_gatt_char(self.firmware_uuid, firmware_bytes[i:i+chunk_size])
        return True

    def analyze_firmware(self, firmware_bytes: bytes):
        current_speed = firmware_bytes[self.speed_offset] if len(firmware_bytes) > self.speed_offset else None
        return {"speed_offset": self.speed_offset, "current_speed": current_speed}

    def patch_firmware(self, firmware_bytes: bytes) -> bytes:
        patched = bytearray(firmware_bytes)
        if len(patched) > self.speed_offset:
            patched[self.speed_offset] = 100  # كسر السرعة إلى 100
        return bytes(patched)

def get_protocol(model: str, version: str, address: str = None):
    model = model.lower()
    if model in protocols_config and version in protocols_config[model]:
        config = protocols_config[model][version]
        firmware_uuid = config.get("firmware_uuid")
        speed_offset = config.get("speed_offset", 512)
        if firmware_uuid and address:
            return DynamicProtocol(address, firmware_uuid, speed_offset)
    return None