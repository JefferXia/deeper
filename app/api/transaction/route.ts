import { NextRequest, NextResponse } from 'next/server';
import { createTransaction } from '@/lib/db'
import { getUser, updateUser } from '@/lib/user';

export async function POST(req: NextRequest) {
  const userInfo = await getUser();
  // const { searchParams } = req.nextUrl;
  // const paramValue = searchParams.get('type');
  const body = await req.json();
  const { type } = body;
  
  try {
    const result = await createTransaction(userInfo.accountId, type)
    
    if(!result) {
      return NextResponse.json({ error: 'account error' }, { status: 404 });
    }
    const updatedUserInfo = {
      ...userInfo,
      totalBalance: result[1]?.totalBalance,
      giftTokens: result[1]?.giftTokens,
      rechargeTokens: result[1]?.rechargeTokens,
      earnedTokens: result[1]?.earnedTokens
    }
    updateUser(updatedUserInfo)

    return new NextResponse(JSON.stringify(updatedUserInfo), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}