from pydantic import BaseModel
from typing import Optional

class User(BaseModel):
    id: int
    username: str
    email: Optional[str]
    hashed_password: str