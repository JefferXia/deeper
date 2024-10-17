'use server'

import cache from '@/lib/cache';
import { cookies } from 'next/headers';
import { createUser, findUser } from '@/lib/db'
import { getUserByToken } from '@/lib/auth/firebase-admin';

export interface UserInfo {
  uid: string
  name?: string
  phone?: string
  email?: string
  picture?: string
  accounts?: any
} 
export async function saveUser(token: string, user: UserInfo) {
  await createUser(user)
  cache.set(`user:token:${token}`, JSON.stringify(user))
}

export async function getUser(token?: string) {
  let userToken: string | undefined = token

  if (!userToken) {
    const cookieStore = cookies()
    userToken = cookieStore.get('firebaseToken')?.value
  }

  if (userToken) {
    const userInfo:any = cache.get(`user:token:${userToken}`)
    if (userInfo) {
      return JSON.parse(userInfo) as UserInfo
    }

    // 通过firebase admin校验cookie
    const verifyUserInfo = await getUserByToken(userToken)
    if(verifyUserInfo?.id) {
      const userData = await findUser(verifyUserInfo.id)
      cache.set(`user:token:${userToken}`, JSON.stringify(userData))
      return userData
    }
  }
}