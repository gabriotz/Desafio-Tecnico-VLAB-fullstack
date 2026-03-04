import pytest
from unittest.mock import patch, AsyncMock, MagicMock
from services.gemini_service import generate_ai_suggestion


async def test_generate_ai_suggestion():
    mock_response = MagicMock()
    mock_response.json.return_value = {
        "candidates": [{
            "content": {
                "parts": [{
                    "text": '{"description": "Test description", "tags": ["tag1", "tag2", "tag3"]}'
                }]
            }
        }],
        "usageMetadata": {"totalTokenCount": 100}
    }
    mock_response.raise_for_status = MagicMock()

    mock_client = AsyncMock()
    mock_client.post = AsyncMock(return_value=mock_response)

    with patch("httpx.AsyncClient") as mock_class:
        mock_class.return_value.__aenter__ = AsyncMock(return_value=mock_client)
        mock_class.return_value.__aexit__ = AsyncMock(return_value=None)

        result = await generate_ai_suggestion("React Hooks", "Video")

    assert result["description"] == "Test description"
    assert len(result["tags"]) == 3