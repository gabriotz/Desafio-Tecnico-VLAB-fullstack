import pytest
from httpx import AsyncClient, ASGITransport
from unittest.mock import patch, AsyncMock
from main import app


@pytest.mark.asyncio
async def test_health_check():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


@pytest.mark.asyncio
async def test_create_resource():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post("/api/resources/", json={
            "title": "Test Resource",
            "type": "Video",
            "url": "https://test.com",
            "description": "Test description",
            "tags": ["test"]
        })
    assert response.status_code == 201
    assert response.json()["title"] == "Test Resource"


@pytest.mark.asyncio
async def test_list_resources():
    # Mock the repository to avoid real DB connection issues across event loops
    mock_items = [
        {
            "id": "1",
            "title": "Test Resource",
            "type": "Video",
            "url": "https://test.com",
            "description": "Test description",
            "tags": ["test"],
            "created_at": "2024-01-01T00:00:00"
        }
    ]

    with patch(
        "repositories.resource_repository.ResourceRepository.get_all",
        new_callable=AsyncMock,
        return_value=(mock_items, 1)
    ):
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            response = await client.get("/api/resources/")

    assert response.status_code == 200
    assert "items" in response.json()