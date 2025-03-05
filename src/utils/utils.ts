import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// url 을 새 창으로 열기
export const toBookSite = (url: string) => {
  window.open(url, '_blank');
};
