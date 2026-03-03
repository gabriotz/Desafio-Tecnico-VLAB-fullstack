import httpx
import json
import logging
import time
from core.config import settings

logger = logging.getLogger(__name__)

GEMINI_URL = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    "gemini-2.5-flash:generateContent"
    f"?key={settings.GEMINI_API_KEY}"
)

SYSTEM_PROMPT = """
Você é um Assistente Pedagógico especializado em catalogar materiais educacionais.
Dado um título e tipo de recurso educacional, gere uma descrição clara 
e útil para alunos e sugira tags relevantes.

Responda APENAS com JSON válido neste formato exato, sem markdown, sem texto extra:
{
  "description": "descrição objetiva e útil para alunos em 2 a 3 frases",
  "tags": ["tag1", "tag2", "tag3"]
}

Regras:
- A descrição deve ser clara, direta e útil para um aluno decidir se 
vale a pena consumir o material
- As tags devem ser palavras-chave relevantes ao conteúdo, em lowercase
- Responda sempre em português
- Retorne APENAS o JSON, nada mais
"""


async def generate_ai_suggestion(title: str, resource_type: str) -> dict:
    payload = {
        "system_instruction": {"parts": [{"text": SYSTEM_PROMPT}]},
        "contents": [{"parts": [{"text": f"Título: {title}\nTipo: {resource_type}"}]}],
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 300,
        },
    }

    start_time = time.time()

    async with httpx.AsyncClient() as client:
        response = await client.post(
            GEMINI_URL,
            json=payload,
            timeout=30.0,
        )
        response.raise_for_status()

    latency = round(time.time() - start_time, 2)
    data = response.json()

    raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
    result = json.loads(raw_text.strip())

    token_usage = data.get("usageMetadata", {}).get("totalTokenCount", 0)
    logger.info(
        f'AI Request: Title="{title}", Type="{resource_type}", '
        f"TokenUsage={token_usage}, Latency={latency}s"
    )

    return result
