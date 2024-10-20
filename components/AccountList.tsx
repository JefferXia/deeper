'use client';
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Crown } from 'lucide-react';
import { useGlobalContext } from '@/app/globalcontext'
import { useTranslations } from 'use-intl'

interface Item {
  type: string;
  amount: string | number;
  createdAt: string;
}
type ListProps = {
  list?: Item[];
};

export function AccountList({ list }: ListProps) {
  // const [list, setList] = useState([])
  const { userInfo } = useGlobalContext()
  const t = useTranslations()

  useEffect(() => {}, []);

  return (
    <div className="mt-7">
      <h2 className='mb-3 text-xl font-bold'>积分收支明细</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>类型</TableHead>
            <TableHead>积分变动数量</TableHead>
            <TableHead className="text-left">时间</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {list?.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{item.type}</TableCell>
              <TableCell>{item.amount}</TableCell>
              <TableCell>{item.createdAt}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
