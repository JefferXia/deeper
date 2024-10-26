'use server'

import prisma from '@/lib/prisma'
import { UserInfo } from '@/lib/user'

interface Record {
  type: string
  amount: string | number
  createdAt: Date
}
type ValueType = {
  [key: string]: number; // 定义对象的键为字符串，值为数字
};

export async function createUser(user: UserInfo) {
  if (!user.uid) {
    return null
  }

  // upsert
  const existingUser = await prisma.user.findUnique({
    where: { id: user.uid }
  })
  const dateTime = new Date()
  const { uid, ...rest } = user;
  const newUser = { id: uid, ...rest, updatedAt: dateTime, createdAt: dateTime }
  if (existingUser) {
    const accountInfo = await prisma.account.findFirst({
      where: {
        userId: uid,
      }
    });
    return {
      ...user,
      accountId: accountInfo?.id,
      totalBalance: accountInfo?.totalBalance.toNumber(),
      giftTokens: accountInfo?.giftTokens.toNumber(),
      rechargeTokens: accountInfo?.rechargeTokens.toNumber(),
      earnedTokens: accountInfo?.earnedTokens.toNumber(),
      grade: accountInfo?.grade,
      createdAt: new Date(existingUser.createdAt).toLocaleString()
    }
  } else {
    await prisma.user.create({
      data: newUser
    })
    // 建立初始账户
    const account = await prisma.account.create({
      data: {
        userId: uid,
        totalBalance: 50,
        giftTokens: 50
      }
    })
    // 赠送50积分
    const giftRecord = await prisma.giftRecord.create({
      data: {
        accountId: account.id,
        amount: 50,
        type: 'gift'
      }
    })

    return {
      ...user,
      accountId: account?.id,
      totalBalance: account?.totalBalance.toNumber(),
      giftTokens: account?.giftTokens.toNumber(),
      rechargeTokens: account?.rechargeTokens.toNumber(),
      earnedTokens: account?.earnedTokens.toNumber(),
      grade: account?.grade,
      createdAt: new Date(account.createdAt).toLocaleString()
    }
  }
}
export async function findUser(userId: string) {
  const user:any = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      createdAt: true,
      accounts: true,
    },
  })
  if(user) {
    const { id, createdAt, accounts, ...rest } = user
    return {
      uid: id,
      ...rest,
      accountId: accounts[0]?.id,
      totalBalance: accounts[0]?.totalBalance.toNumber(),
      giftTokens: accounts[0]?.giftTokens.toNumber(),
      rechargeTokens: accounts[0]?.rechargeTokens.toNumber(),
      earnedTokens: accounts[0]?.earnedTokens.toNumber(),
      grade: accounts[0]?.grade,
      createdAt: new Date(createdAt).toLocaleString()
    }
  }
}

// 添加充值记录
export async function createRecharge(accountId: number, amount: number) {
  const rechargeTransaction = await prisma.$transaction([
    // 1. 创建充值记录
    prisma.rechargeRecord.create({
      data: {
        accountId,
        amount,
        orderNumber: 'ORD123456', // 生成或传入唯一订单号
        source: 'WeChat',         // 充值来源，如：支付宝、微信等
        status: 'COMPLETED',      // 充值状态：成功
      },
    }),
    // 2. 更新账户余额和充值代币
    prisma.account.update({
      where: { id: accountId },
      data: {
        totalBalance: {
          increment: amount, // 增加总余额
        },
        rechargeTokens: {
          increment: amount, // 增加充值代币余额
        },
      },
    }),
  ]);

  console.log('Recharge record created:', rechargeTransaction);
}

// 添加交易记录
export async function createTransaction(accountId: number, type: string) {
  const getValueByType: ValueType = {
    'video_analysis': 10
  }
  const transaction = await prisma.$transaction([
    prisma.transactionRecord.create({
      data: {
        accountId,
        amount: -1 * getValueByType[type],
        type,
      },
    }),
    prisma.account.update({
      where: { id: accountId },
      data: {
        totalBalance: {
          decrement: getValueByType[type],
        },
        giftTokens: {
          decrement: getValueByType[type],
        },
      },
    }),
  ]);

  return transaction
  // console.log('Transaction record created:', transaction);
}

export async function accountDetails(userId: string) {
  // 查询账户及其关联的收支记录
  const accountWithDetails = await prisma.account.findFirst({
    where: {
      userId: userId,
    },
    include: {
      gifts: true,            // 包含 GiftRecord 赠送记录
      recharges: true,        // 包含 RechargeRecord 充值记录
      transactions: true,     // 包含 TransactionRecord 消费记录
    },
  });

  // 确保账户存在
  if (!accountWithDetails) {
    throw new Error('Account not found for this user');
  }

  // 合并 GiftRecord、TransactionRecord 和 RechargeRecord
  const combinedRecords = [
    ...accountWithDetails.gifts.map(record => ({
      type: '赠送积分',                 // 赠送记录的类型
      amount: `+${record.amount}`,        // 积分变动（正数）
      createdAt: record.createdAt,        // 记录的时间
    })),
    ...accountWithDetails.transactions.map(record => ({
      type: `消耗积分-${record.type}`,    // 消费记录的类型
      amount: `${record.amount}`,              // 积分变动（负数）
      createdAt: record.createdAt,        // 记录的时间
    })),
    ...accountWithDetails.recharges
      .filter(record => record.status === 'COMPLETED') // 只包含已完成的充值
      .map(record => ({
        type: `充值积分-${record.source}`, // 充值记录的类型
        amount: `+${record.amount}`,       // 积分变动（正数）
        createdAt: record.createdAt,       // 记录的时间
      })),
  ];

  // 按照时间进行排序
  const sortedRecords = combinedRecords.sort((a: Record, b: Record) => {
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  // 格式化输出
  const formattedRecords = sortedRecords.map(record => ({
    type: record.type,
    amount: record.amount,
    createdAt: new Date(record.createdAt).toLocaleString(),
  }));

  return formattedRecords
}