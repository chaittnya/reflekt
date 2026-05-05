import os
from string import Template


PROMPTS_DIR = os.path.join(os.path.dirname(__file__), 'prompts')


def load_prompt(filename: str, **kwargs) -> str:
    filepath = os.path.join(PROMPTS_DIR, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        template = f.read()
    return Template(template).substitute(**kwargs)