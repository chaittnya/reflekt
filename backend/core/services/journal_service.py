from django.utils import timezone
from core.models import DailySummary, MemoryNode, EventNode, Question, QuestionAnswer
from core.services.stt import get_stt_service
from core.services.llm import get_llm_service
from core.services.burnout_service import calculate_burnout_score, calculate_chill_day


def process_journal_entry(user, audio_file, rate=None, sleep_duration=None):
    """
    Full pipeline:
    audio → STT → LLM refine → infer questions → burnout score → save to DB
    Returns dict with refined text, burnout score, chill_day, follow_up questions
    """

    today = timezone.now().date()

    # Step 1: Speech to Text
    stt = get_stt_service()
    raw_text = stt.transcribe(audio_file)

    # Step 2: Refine text with LLM
    llm = get_llm_service()
    refined_text = llm.refine_journal(raw_text)

    # Step 3: Load all 8 questions from DB
    questions = list(Question.objects.values(
        'quest_number', 'text', 'dimension'
    ).order_by('quest_number'))

    # Step 4: Infer question answers from refined text
    inferred_answers = llm.infer_question_answers(refined_text, questions)

    # Step 5: Calculate burnout score
    burnout_score = calculate_burnout_score(inferred_answers)

    # Step 6: Calculate chill day
    chill_day = calculate_chill_day(
        burnout_score=burnout_score,
        question_answers=inferred_answers,
        user_rate=rate,
        user_id=user.id
    )

    # Step 7: Generate event nodes
    event_nodes_data = llm.generate_event_nodes(refined_text, str(today))

    # Step 8: Save DailySummary
    summary, created = DailySummary.objects.update_or_create(
        user=user,
        date=today,
        defaults={
            'text': refined_text,
            'raw_text': raw_text,
            'rate': rate,
            'sleep_duration': sleep_duration,
            'burnout_score': burnout_score,
            'chill_day': chill_day,
        }
    )

    # Step 9: Save QuestionAnswers
    QuestionAnswer.objects.filter(daily_summary=summary).delete()
    question_map = {q['quest_number']: q for q in questions}

    for ans in inferred_answers:
        question_obj = Question.objects.get(quest_number=ans['quest_number'])
        QuestionAnswer.objects.create(
            daily_summary=summary,
            question=question_obj,
            answer=ans.get('answer'),
            inference_confidence=ans.get('confidence', 'medium'),
            score=ans.get('score'),
        )

    # Step 10: Save Memory + Event Nodes
    MemoryNode.objects.filter(daily_summary=summary).delete()
    memory_node = MemoryNode.objects.create(user=user, daily_summary=summary)

    for event_data in event_nodes_data:
        EventNode.objects.create(
            memory_node=memory_node,
            daily_summary=summary,
            event=event_data['event'],
            date=today,
        )

    # Step 11: Identify low confidence answers for follow-up
    follow_up_questions = [
        {
            'quest_number': ans['quest_number'],
            'question': question_map[ans['quest_number']]['text'],
        }
        for ans in inferred_answers
        if ans.get('confidence') == 'low'
    ]

    return {
        'summary_id': summary.id,
        'raw_text': raw_text,
        'refined_text': refined_text,
        'burnout_score': burnout_score,
        'chill_day': chill_day,
        'follow_up_questions': follow_up_questions,
        'date': str(today),
    }