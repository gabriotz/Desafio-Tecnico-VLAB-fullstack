from pydantic import BaseModel


class AIRequest(BaseModel):
    title: str
    type: str


class AIResponse(BaseModel):
    description: str
    tags: list[str]
