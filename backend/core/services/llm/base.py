from abc import ABC, abstractmethod
from typing import Optional


class BaseLLMService(ABC):

    @abstractmethod
    def refine_journal(self, raw_text: str) -> str:
        """Clean and refine raw STT text into readable journal entry"""
        pass

    @abstractmethod
    def infer_question_answers(self, refined_text: str, questions: list) -> list:
        """
        Infer answers to fixed questions from refined journal text.
        Returns list of dicts:
        [
            {
                'quest_number': 1,
                'answer': '...',
                'score': 0-3,
                'confidence': 'high/medium/low'
            },
            ...
        ]
        """
        pass

    @abstractmethod
    def generate_event_nodes(self, refined_text: str, date: str) -> list:
        """
        Extract key events from journal text.
        Returns list of dicts:
        [
            { 'event': '...', 'date': 'YYYY-MM-DD' },
            ...
        ]
        """
        pass