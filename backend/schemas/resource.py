from pydantic import BaseModel, field_validator
from datetime import datetime
from enum import Enum


class ResourceType(str, Enum):
    VIDEO = "Video"
    PDF = "PDF"
    LINK = "Link"


class ResourceBase(BaseModel):
    title: str
    description: str | None = None
    type: ResourceType
    url: str
    tags: list[str] = []


class ResourceCreate(ResourceBase):
    @field_validator("title")
    @classmethod
    def title_must_not_be_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Título não pode ser vazio")
        return v.strip()


class ResourceUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    type: ResourceType | None = None
    url: str | None = None
    tags: list[str] | None = None


class ResourceOut(ResourceBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}


class PaginatedResources(BaseModel):
    items: list[ResourceOut]
    total: int
    page: int
    size: int
