from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status
from repositories.resource_repository import ResourceRepository
from schemas.resource import ResourceCreate, ResourceUpdate, ResourceOut, PaginatedResources


class ResourceService:
    def __init__(self, db: AsyncSession):
        self.repository = ResourceRepository(db)

    async def get_all(
        self,
        page: int,
        size: int,
        order_by: str = "created_at",
        order_dir: str = "desc",
    ) -> PaginatedResources:
        items, total = await self.repository.get_all(page, size, order_by, order_dir)
        return PaginatedResources(
            items=[ResourceOut.model_validate(item) for item in items],
            total=total,
            page=page,
            size=size,
    )

    async def get_by_id(self, resource_id: int) -> ResourceOut:
        resource = await self.repository.get_by_id(resource_id)
        if not resource:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Resource {resource_id} not found",
            )
        return ResourceOut.model_validate(resource)

    async def create(self, data: ResourceCreate) -> ResourceOut:
        resource = await self.repository.create(data)
        return ResourceOut.model_validate(resource)

    async def update(self, resource_id: int, data: ResourceUpdate) -> ResourceOut:
        resource = await self.repository.get_by_id(resource_id)
        if not resource:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Resource {resource_id} not found",
            )
        updated = await self.repository.update(resource, data)
        return ResourceOut.model_validate(updated)

    async def delete(self, resource_id: int) -> None:
        resource = await self.repository.get_by_id(resource_id)
        if not resource:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Resource {resource_id} not found",
            )
        await self.repository.delete(resource)