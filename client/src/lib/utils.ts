import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function getCurrentDate(): string {
  return formatDate(new Date());
}

export function calculatePagesRead(fromPage: number, toPage: number): number {
  if (fromPage > toPage) return 0;
  return toPage - fromPage + 1;
}

export function generatePageRange(startPage: number, endPage: number): number[] {
  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  return pages;
}
