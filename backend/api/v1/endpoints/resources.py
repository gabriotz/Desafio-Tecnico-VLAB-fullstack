from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from models.base import get_db
from services.resource import ResourceService
from schemas.resource import (
    ResourceCreate,
    ResourceUpdate,
    ResourceOut,
    PaginatedResources,
)
from typing import Literal

router = APIRouter(prefix="/resources", tags=["Resources"])


def get_resource_service(db: AsyncSession = Depends(get_db)) -> ResourceService:
    return ResourceService(db)


@router.get("/", response_model=PaginatedResources)
async def list_resources(
    page: int = Query(default=1, ge=1),
    size: int = Query(default=10, ge=1, le=50),
    order_by: Literal["title", "type", "created_at"] = Query(default="created_at"),
    order_dir: Literal["asc", "desc"] = Query(default="desc"),
    service: ResourceService = Depends(get_resource_service),
):
    return await service.get_all(page, size, order_by, order_dir)


@router.get("/{resource_id}", response_model=ResourceOut)
async def get_resource(
    resource_id: int,
    service: ResourceService = Depends(get_resource_service),
):
    return await service.get_by_id(resource_id)


@router.post("/", response_model=ResourceOut, status_code=status.HTTP_201_CREATED)
async def create_resource(
    data: ResourceCreate,
    service: ResourceService = Depends(get_resource_service),
):
    return await service.create(data)


@router.put("/{resource_id}", response_model=ResourceOut)
async def update_resource(
    resource_id: int,
    data: ResourceUpdate,
    service: ResourceService = Depends(get_resource_service),
):
    return await service.update(resource_id, data)


@router.delete("/{resource_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_resource(
    resource_id: int,
    service: ResourceService = Depends(get_resource_service),
):
    await service.delete(resource_id)
