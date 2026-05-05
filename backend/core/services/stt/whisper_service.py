import os
import uuid
import whisper
from django.conf import settings
from .base import BaseSTTService


class WhisperSTTService(BaseSTTService):

    def __init__(self):
        model_name = getattr(settings, 'WHISPER_MODEL', 'base')
        self.model = whisper.load_model(model_name)

    def transcribe(self, audio_file) -> str:
        """
        audio_file: InMemoryUploadedFile from Django request.FILES
        Saves temporarily, transcribes, then deletes.
        """
        # Generate a unique temp filename
        ext = os.path.splitext(audio_file.name)[-1] or '.webm'
        temp_filename = f"temp_{uuid.uuid4().hex}{ext}"
        temp_path = os.path.join(settings.MEDIA_ROOT, 'temp', temp_filename)

        # Ensure temp directory exists
        os.makedirs(os.path.dirname(temp_path), exist_ok=True)

        # Save uploaded file to disk
        with open(temp_path, 'wb') as f:
            for chunk in audio_file.chunks():
                f.write(chunk)

        try:
            result = self.model.transcribe(temp_path)
            return result['text'].strip()
        finally:
            # Always delete temp file even if transcription fails
            if os.path.exists(temp_path):
                os.remove(temp_path)