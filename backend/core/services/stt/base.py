from abc import ABC, abstractmethod


class BaseSTTService(ABC):

    @abstractmethod
    def transcribe(self, audio_file) -> str:
        """
        audio_file: InMemoryUploadedFile from Django request.FILES
        Returns transcribed text string.
        """
        pass