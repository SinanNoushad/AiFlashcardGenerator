export default class SpacedRepetitionService {
  static updateCard(card, difficulty) {
    const now = new Date();
    let { interval, repetitions, easeFactor } = card;

    switch (difficulty) {
      case 'again':
        interval = 1;
        repetitions = 0;
        easeFactor = Math.max(1.3, easeFactor - 0.2);
        break;
      case 'good':
        if (repetitions === 0) interval = 1;
        else if (repetitions === 1) interval = 6;
        else interval = Math.round(interval * easeFactor);
        repetitions += 1;
        break;
      case 'easy':
        interval = Math.round(interval * easeFactor * 1.3);
        repetitions += 1;
        easeFactor += 0.1;
        break;
      default:
        break;
    }

    return {
      ...card,
      interval,
      repetitions,
      easeFactor,
      nextReview: new Date(now.getTime() + interval * 86400000),
      lastReviewed: now
    };
  }
}