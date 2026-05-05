from django.conf import settings


def get_stt_service():
    provider = getattr(settings, 'STT_PROVIDER', 'whisper')

    if provider == 'whisper':
        from .whisper_service import WhisperSTTService
        return WhisperSTTService()

    raise ValueError(f"Unknown STT provider: {provider}")