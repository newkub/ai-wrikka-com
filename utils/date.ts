export function formatDate(date: Date | string): string {
  if (!date) return '';
  
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function isOverdue(date: Date | string): boolean {
  if (!date) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dueDate = new Date(date);
  dueDate.setHours(0, 0, 0, 0);
  
  return dueDate < today;
}

export function generateCalendarDays(year: number, month: number): Date[] {
  const days: Date[] = [];
  const date = new Date(year, month - 1, 1);
  
  // Get days from previous month
  const firstDayOfWeek = date.getDay();
  const prevMonthLastDay = new Date(year, month - 1, 0).getDate();
  
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    days.push(new Date(year, month - 2, prevMonthLastDay - i));
  }
  
  // Get days from current month
  const lastDay = new Date(year, month, 0).getDate();
  
  for (let i = 1; i <= lastDay; i++) {
    days.push(new Date(year, month - 1, i));
  }
  
  // Get days from next month
  const daysNeeded = 42 - days.length; // 6 weeks
  
  for (let i = 1; i <= daysNeeded; i++) {
    days.push(new Date(year, month, i));
  }
  
  return days;
}
