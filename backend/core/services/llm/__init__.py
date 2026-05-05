from django.conf import settings


def get_llm_service():
    provider = getattr(settings, 'LLM_PROVIDER', 'gemini')

    if provider == 'gemini':
        from .gemini_service import GeminiLLMService
        return GeminiLLMService()

    if provider == 'claude':
        from .claude_service import ClaudeLLMService
        return ClaudeLLMService()

    raise ValueError(f"Unknown LLM provider: {provider}")