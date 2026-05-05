from core.models import DailySummary


# Question weights based on burnout research
QUESTION_WEIGHTS = {
    1: 2.0,   # Energy/Exhaustion — strong indicator
    2: 1.5,   # Motivation/Engagement
    3: 1.5,   # Sense of Accomplishment
    4: 1.0,   # Social Interactions
    5: 2.0,   # Mood/Emotions — strong indicator
    6: 1.5,   # Physical Symptoms
    7: 1.0,   # Stressors
    8: 1.5,   # Recovery Capacity
}

MAX_POSSIBLE_SCORE = sum(w * 3 for w in QUESTION_WEIGHTS.values())  # 3 is max per question


def calculate_burnout_score(question_answers: list) -> float:
    """
    question_answers: list of dicts with quest_number and score (0-3)
    Returns burnout score normalized to 0-10
    """
    weighted_sum = 0.0
    total_weight = 0.0

    for qa in question_answers:
        quest_num = qa['quest_number']
        score = qa.get('score')

        # Skip if score is None or confidence is low
        if score is None or qa.get('confidence') == 'low':
            continue

        weight = QUESTION_WEIGHTS.get(quest_num, 1.0)
        weighted_sum += score * weight
        total_weight += weight * 3  # max possible for this question

    if total_weight == 0:
        return 0.0

    # Normalize to 0-10
    burnout_score = (weighted_sum / total_weight) * 10
    return round(burnout_score, 2)


def calculate_chill_day(
    burnout_score: float,
    question_answers: list,
    user_rate: int,
    user_id: int
) -> bool:
    """
    Returns True if the user needs a chill day based on multiple signals.
    """

    # Rule 1: Acute high burnout score
    if burnout_score >= 7.5:
        return True

    # Rule 2: User self-reported very low mood AND moderate burnout
    if user_rate is not None and user_rate <= 2 and burnout_score >= 6.0:
        return True

    # Rule 3: Completely exhausted with no recovery
    scores_by_q = {qa['quest_number']: qa.get('score') for qa in question_answers}
    if scores_by_q.get(1) == 3 and scores_by_q.get(8) == 3:
        return True

    # Rule 4: Chronic pattern — weekly average >= 6 for 3+ consecutive days
    if _check_chronic_pattern(user_id, burnout_score):
        return True

    return False


def _check_chronic_pattern(user_id: int, today_score: float) -> bool:
    """
    Check if last 3 days including today all have burnout score >= 6
    """
    recent = DailySummary.objects.filter(
        user_id=user_id,
        burnout_score__isnull=False
    ).order_by('-date')[:2]  # last 2 days from DB + today = 3 total

    if len(recent) < 2:
        return False

    scores = [today_score] + [entry.burnout_score for entry in recent]
    return all(s >= 6.0 for s in scores)