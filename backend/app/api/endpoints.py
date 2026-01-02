from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from typing import Optional
from app.protocols.protocol_factory import get_protocol
from app.core.security import get_current_user
from jose import JWTError, jwt
from app.core.config import settings
from datetime import datetime, timedelta
from passlib.context import CryptContext

router = APIRouter()

# تخزين المستخدمين (مثال، استخدم DB حقيقية في مشروعك)
fake_users_db = {}

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserIn(BaseModel):
    username: str
    password: str

class UserOut(BaseModel):
    username: str

class Token(BaseModel):
    access_token: str
    token_type: str

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def authenticate_user(username: str, password: str):
    user = fake_users_db.get(username)
    if not user:
        return False
    if not verify_password(password, user["hashed_password"]):
        return False
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta if expires_delta else timedelta(minutes=15))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

@router.post("/register", response_model=UserOut)
async def register(user_in: UserIn):
    if user_in.username in fake_users_db:
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed_password = get_password_hash(user_in.password)
    fake_users_db[user_in.username] = {"username": user_in.username, "hashed_password": hashed_password}
    return {"username": user_in.username}

@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: UserIn):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")
    access_token = create_access_token(data={"sub": user["username"]})
    return {"access_token": access_token, "token_type": "bearer"}

# موديل الاتصال بالسكوتر موجود سابقًا (connect_device)
class ConnectRequest(BaseModel):
    address: str
    model: str
    version: str

@router.post("/connect")
async def connect_device(req: ConnectRequest, user=Depends(get_current_user)):
    protocol = get_protocol(req.model, req.version, req.address)
    if not protocol:
        raise HTTPException(status_code=404, detail="Protocol not found")

    success = await protocol.connect()
    if not success:
        raise HTTPException(status_code=400, detail="Failed to connect")
    return {"status": "connected"}

# endpoint لقراءة الفيرموير
@router.post("/read_firmware")
async def read_firmware(req: ConnectRequest, user=Depends(get_current_user)):
    protocol = get_protocol(req.model, req.version, req.address)
    if not protocol:
        raise HTTPException(status_code=404, detail="Protocol not found")

    firmware_data = await protocol.read_firmware()
    analysis = protocol.analyze_firmware(firmware_data)
    return {"firmware_data": firmware_data.hex(), "analysis": analysis}

# endpoint لتعديل الفيرموير (كسر السرعة)
@router.post("/patch_firmware")
async def patch_firmware(req: ConnectRequest, user=Depends(get_current_user)):
    protocol = get_protocol(req.model, req.version, req.address)
    if not protocol:
        raise HTTPException(status_code=404, detail="Protocol not found")

    firmware_data = await protocol.read_firmware()
    patched = protocol.patch_firmware(firmware_data)
    flash_success = await protocol.flash_firmware(patched)
    if not flash_success:
        raise HTTPException(status_code=500, detail="Failed to flash patched firmware")
    return {"status": "patched and flashed successfully"}