import os
import uuid
import whisper
from django.conf import settings
from .base import BaseSTTService


_whisper_model = None


def get_whisper_model():
    global _whisper_model
    if _whisper_model is None:
        model_name = getattr(settings, 'WHISPER_MODEL', 'base')
        print(f"Loading Whisper model '{model_name}'...")
        _whisper_model = whisper.load_model(model_name)
        print("Whisper model loaded.")
    return _whisper_model


class WhisperSTTService(BaseSTTService):

    def __init__(self):
        self.model = get_whisper_model()

    def transcribe(self, audio_file) -> str:
        ext = os.path.splitext(audio_file.name)[-1] or '.webm'
        temp_filename = f"temp_{uuid.uuid4().hex}{ext}"
        temp_path = os.path.join(settings.MEDIA_ROOT, 'temp', temp_filename)

        os.makedirs(os.path.dirname(temp_path), exist_ok=True)

        with open(temp_path, 'wb') as f:
            for chunk in audio_file.chunks():
                f.write(chunk)

        try:
            result = self.model.transcribe(temp_path)
            return result['text'].strip()
        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)