import json
import google.generativeai as genai
from django.conf import settings
from .base import BaseLLMService
from .prompt_loader import load_prompt


class GeminiLLMService(BaseLLMService):

    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    def _ask(self, prompt: str) -> str:
        response = self.model.generate_content(prompt)
        try:
            return response.text.strip()
        except Exception:
            # Fallback if response.text is blocked or empty
            return response.candidates[0].content.parts[0].text.strip()

    def refine_journal(self, raw_text: str) -> str:
        prompt = load_prompt('refine_journal.txt', raw_text=raw_text)
        return self._ask(prompt)

    def infer_question_answers(self, refined_text: str, questions: list) -> list:
        questions_text = "\n".join(
            [f"Q{q['quest_number']} ({q['dimension']}): {q['text']}" for q in questions]
        )
        prompt = load_prompt(
            'infer_questions.txt',
            refined_text=refined_text,
            questions_text=questions_text
        )
        raw = self._ask(prompt)
        raw = raw.replace('```json', '').replace('```', '').strip()
        return json.loads(raw)

    def generate_event_nodes(self, refined_text: str, date: str) -> list:
        prompt = load_prompt('generate_events.txt', refined_text=refined_text, date=date)
        raw = self._ask(prompt)
        raw = raw.replace('```json', '').replace('```', '').strip()
        return json.loads(raw)