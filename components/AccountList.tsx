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
      <h2 className='mb-3 text-xl font-bold'>{t('profile.credits_details')}</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('profile.details_type')}</TableHead>
            <TableHead>{t('profile.details_num')}</TableHead>
            <TableHead className="text-left">{t('profile.details_time')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {list?.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{t(`profile.${item.type}`)}</TableCell>
              <TableCell>{item.amount}</TableCell>
              <TableCell>{item.createdAt}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
