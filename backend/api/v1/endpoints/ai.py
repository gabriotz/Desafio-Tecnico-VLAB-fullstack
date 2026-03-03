from fastapi import APIRouter, HTTPException, status
from schemas.ai import AIRequest, AIResponse
from services.gemini_service import generate_ai_suggestion

router = APIRouter(prefix="/ai", tags=["AI"])


@router.post("/suggest", response_model=AIResponse)
async def suggest_with_ai(data: AIRequest):
    try:
        result = await generate_ai_suggestion(data.title, data.type)
        return AIResponse(
            description=result["description"],
            tags=result["tags"],
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"AI service unavailable: {str(e)}",
        )
