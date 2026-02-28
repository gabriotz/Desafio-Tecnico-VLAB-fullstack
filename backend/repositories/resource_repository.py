from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, asc, desc
from models.resource import Resource
from schemas.resource import ResourceCreate, ResourceUpdate

SORT_FIELDS = {
    "title": Resource.title,
    "type": Resource.type,
    "created_at": Resource.created_at,
}


class ResourceRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(
        self,
        page: int,
        size: int,
        order_by: str = "created_at",
        order_dir: str = "desc",
    ) -> tuple[list[Resource], int]:
        offset = (page - 1) * size

        sort_column = SORT_FIELDS.get(order_by, Resource.created_at)
        sort_order = desc(sort_column) if order_dir == "desc" else asc(sort_column)

        result = await self.db.execute(
            select(Resource).order_by(sort_order).offset(offset).limit(size)
        )
        items = result.scalars().all()

        total_result = await self.db.execute(select(func.count(Resource.id)))
        total = total_result.scalar()

        return items, total

    async def get_by_id(self, resource_id: int) -> Resource | None:
        result = await self.db.execute(
            select(Resource).where(Resource.id == resource_id)
        )
        return result.scalar_one_or_none()

    async def create(self, data: ResourceCreate) -> Resource:
        resource = Resource(**data.model_dump())
        self.db.add(resource)
        await self.db.flush()
        await self.db.refresh(resource)
        return resource

    async def update(self, resource: Resource, data: ResourceUpdate) -> Resource:
        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(resource, field, value)
        await self.db.flush()
        await self.db.refresh(resource)
        return resource

    async def delete(self, resource: Resource) -> None:
        await self.db.delete(resource)
        await self.db.flush()
