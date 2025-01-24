import { OrderDetail } from '@/api/item';

export const mockOrderDetailList: OrderDetail[] = [
  {
    orderId: 1001,
    orderDatetime: '2024-03-15 14:30:00',
    orderStatus: '배송완료',
    orderBookViewsList: [
      {
        title: '어린왕자',
        count: 2,
        price: 12000,
      },
      {
        title: '데미안',
        count: 1,
        price: 15000,
      },
    ],
  },
  {
    orderId: 1002,
    orderDatetime: '2024-03-14 09:15:00',
    orderStatus: '배송중',
    orderBookViewsList: [
      {
        title: '코스모스',
        count: 1,
        price: 25000,
      },
    ],
  },
  {
    orderId: 1003,
    orderDatetime: '2024-03-13 16:45:00',
    orderStatus: '배송준비중',
    orderBookViewsList: [
      {
        title: '해리포터와 마법사의 돌',
        count: 1,
        price: 18000,
      },
      {
        title: '해리포터와 비밀의 방',
        count: 1,
        price: 18000,
      },
      {
        title: '해리포터와 아즈카반의 죄수',
        count: 1,
        price: 18000,
      },
    ],
  },
  {
    orderId: 1004,
    orderDatetime: '2024-03-12 11:20:00',
    orderStatus: '배송완료',
    orderBookViewsList: [
      {
        title: '1984',
        count: 1,
        price: 16000,
      },
    ],
  },
  {
    orderId: 1005,
    orderDatetime: '2024-03-11 13:50:00',
    orderStatus: '배송준비중',
    orderBookViewsList: [
      {
        title: '동물농장',
        count: 2,
        price: 13000,
      },
    ],
  },
];
