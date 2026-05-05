import json
import anthropic
from django.conf import settings
from .base import BaseLLMService
from .prompt_loader import load_prompt


class ClaudeLLMService(BaseLLMService):

    def __init__(self):
        try:
            import anthropic
        except ImportError:
            raise ImportError("Run: pip install anthropic")
        
        self.client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
        self.model = "claude-sonnet-4-20250514"
        self._anthropic = anthropic

    def _ask(self, prompt: str) -> str:
        try:
            message = self.client.messages.create(
                model=self.model,
                max_tokens=1000,
                messages=[{"role": "user", "content": prompt}]
            )
            return message.content[0].text.strip()
        except self._anthropic.APIConnectionError:
            raise Exception("Claude: connection failed")
        except self._anthropic.RateLimitError:
            raise Exception("Claude: rate limit hit")
        except self._anthropic.APIStatusError as e:
            raise Exception(f"Claude: API error {e.status_code} - {e.message}")

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