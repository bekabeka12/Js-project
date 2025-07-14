export function borrowedDaysCalculator(date1, date2) {
  return Math.floor((date1 - date2) / (1000 * 60 * 60 * 24));
}

export function calculatePenaltyPoints(daysOverdue) {
  if (daysOverdue <= 10) {
    return (daysOverdue * (daysOverdue + 1)) / 2 * 0.1;
  }

  return 5.5;
}

export function rateGenerator(){
    return Number((Math.random() * 5).toFixed(1));
}

export function formatDateLocale(date) {
  return date.toLocaleDateString('en-CA');
}