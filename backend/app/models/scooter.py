from pydantic import BaseModel

class ScooterModel(BaseModel):
    model: str
    version: str
    firmware_uuid: str
    speed_offset: int