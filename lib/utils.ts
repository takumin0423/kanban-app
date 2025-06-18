import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isTaskOverdue(dueDate: Date | null): boolean {
  if (!dueDate) return false
  return new Date() > dueDate
}

export function getOverdueDays(dueDate: Date): number {
  const now = new Date()
  const diffTime = now.getTime() - dueDate.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export function formatOverdueText(dueDate: Date): string {
  const days = getOverdueDays(dueDate)
  if (days === 1) {
    return "1日前に期限切れ"
  }
  return `${days}日前に期限切れ`
}
