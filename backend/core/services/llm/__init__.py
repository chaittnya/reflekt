from django.conf import settings


def get_llm_service():
    provider = getattr(settings, 'LLM_PROVIDER', 'gemini')

    if provider == 'gemini':
        from .gemini_service import GeminiLLMService
        return GeminiLLMService()

    if provider == 'groq':
        from .groq_service import GroqLLMService
        return GroqLLMService()

    if provider == 'claude':
        from .claude_service import ClaudeLLMService
        return ClaudeLLMService()

    # if provider == 'mock':
    #     from .mock_service import MockLLMService
    #     return MockLLMService()

    raise ValueError(f"Unknown LLM provider: {provider}")