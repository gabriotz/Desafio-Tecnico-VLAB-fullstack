from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.v1.endpoints.ai import router as ai_router
from core.logging import setup_logging

from models.base import engine, Base
from api.v1.endpoints.resources import router as resources_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()


setup_logging()

app = FastAPI(
    title="Hub Educacional API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
        "https://desafio-tecnico-vlab-fullstack.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resources_router, prefix="/api")
app.include_router(ai_router, prefix="/api")


@app.get("/health")
async def health_check():
    return {"status": "ok"}
