export const bookPrevDataListMock: BookPrevData[] = [
  {
    isbn: 'isbn1',
    bookImg:
      'https://images.unsplash.com/photo-1725695787909-bd20f6b47ef9?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'title1',
    author: 'author1',
    price: 10000,
    discountPercent: 10,
  },
  {
    isbn: 'isbn2',
    bookImg:
      'https://images.unsplash.com/photo-1736771932149-26287a969645?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'title2',
    author: 'author2',
    price: 10000,
    discountPercent: 10,
  },
  {
    isbn: 'isbn3',
    bookImg:
      'https://images.unsplash.com/photo-1736771932149-26287a969645?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'title3',
    author: 'author3',
    price: 10000,
    discountPercent: 10,
  },
];

export const userListMock = [
  {
    email: 'test1@test.com',
    datetime: '2024.12.12',
    point: 1222,
    commentCount: 29,
  },
  {
    email: 'test2@test.com',
    datetime: '2024.12.12',
    point: 12,
    commentCount: 2,
  },
  {
    email: 'test3@test.com',
    datetime: '2024.12.12',
    point: 1222,
    commentCount: 29009,
  },
];

export const recommendBookmock = {
  title: 'test title',
  author: 'author1',
  bookImg:
    'https://plus.unsplash.com/premium_photo-1670598267085-053235b0d6de?q=80&w=3686&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  publisher: 'publisher1',
};
export interface BookPrevData {
  isbn: string;
  bookImg: string;
  title: string;
  author: string;
  price: number;
  discountPercent: number;
}
