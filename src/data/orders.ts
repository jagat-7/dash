export interface OrderRecord {
  id: string
  orderNo: string
  date: string
  customer: string
  customerLocation: string
  amount: number
  salesman: string
  modifiedBy: string
  status: 'APPROVED' | 'PENDING' | 'VERIFIED' | 'DECLINED' | 'HOLD'
  notes?: string
}

export const INITIAL_ORDERS: OrderRecord[] = [
  {
    id: 'ord-819',
    orderNo: '819',
    date: '2083-04-29',
    customer: 'Aaryan Stha',
    customerLocation: 'Dharan',
    amount: 8000.0,
    salesman: 'Jagat Yadav',
    modifiedBy: '-',
    status: 'APPROVED',
  },
  {
    id: 'ord-818',
    orderNo: '818',
    date: '2083-04-28',
    customer: 'Aaryan Stha',
    customerLocation: 'Dharan',
    amount: 3990.0,
    salesman: 'Jagat Yadav',
    modifiedBy: '-',
    status: 'APPROVED',
  },
  {
    id: 'ord-817',
    orderNo: '817',
    date: '2083-04-21',
    customer: 'Aaryan Stha',
    customerLocation: 'Dharan',
    amount: 1279.2,
    salesman: 'Jagat Yadav',
    modifiedBy: '-',
    status: 'APPROVED',
  },
  {
    id: 'ord-816',
    orderNo: '816',
    date: '2083-04-18',
    customer: 'Bikash Enterprises',
    customerLocation: 'Kathmandu',
    amount: 14500.0,
    salesman: 'Rajesh Karki',
    modifiedBy: 'Admin (2083-04-19)',
    status: 'VERIFIED',
  },
  {
    id: 'ord-815',
    orderNo: '815',
    date: '2083-04-15',
    customer: 'Summit Traders',
    customerLocation: 'Biratnagar',
    amount: 22400.0,
    salesman: 'Jagat Yadav',
    modifiedBy: '-',
    status: 'PENDING',
  },
  {
    id: 'ord-814',
    orderNo: '814',
    date: '2083-04-12',
    customer: 'Karnali Mart',
    customerLocation: 'Surkhet',
    amount: 5600.0,
    salesman: 'Anita Thapa',
    modifiedBy: '-',
    status: 'APPROVED',
  },
  {
    id: 'ord-813',
    orderNo: '813',
    date: '2083-04-10',
    customer: 'Lumbini Suppliers',
    customerLocation: 'Butwal',
    amount: 18950.0,
    salesman: 'Bipin Shrestha',
    modifiedBy: 'Admin (2083-04-11)',
    status: 'HOLD',
  },
]
