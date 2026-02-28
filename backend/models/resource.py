from sqlalchemy import String, Text, ARRAY, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime, timezone
from models.base import Base


class Resource(Base):
    __tablename__ = "resources"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    type: Mapped[str] = mapped_column(String(50), nullable=False)  # Video, PDF, Link
    url: Mapped[str] = mapped_column(String(500), nullable=False)
    tags: Mapped[list[str]] = mapped_column(ARRAY(String), default=[])
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )