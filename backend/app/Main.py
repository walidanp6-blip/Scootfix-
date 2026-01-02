from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import endpoints

app = FastAPI(title="Scooter Pro Manager")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # يمكن تضييق النطاق لاحقاً
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(endpoints.router)