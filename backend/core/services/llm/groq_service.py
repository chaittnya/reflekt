import json
from groq import Groq
from django.conf import settings
from .base import BaseLLMService
from .prompt_loader import load_prompt


class GroqLLMService(BaseLLMService):

    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_API_KEY)
        self.model = 'llama-3.3-70b-versatile'  # fast and free

    def _ask(self, prompt: str) -> str:
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=1000,
        )
        return response.choices[0].message.content.strip()

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