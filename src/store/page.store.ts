import { create } from 'zustand';

// 리뷰 페이지
interface PageType {
  page: number;
  changePage(page: number): void;
};

export const pageStore = create<PageType>((set) => ({
  page: 0,
  changePage: (newPage: number) => set({ page: newPage }),
}));

export const usePage = () => pageStore((state) => state.page);
export const useChangePage = () => pageStore((state) => state.changePage);
