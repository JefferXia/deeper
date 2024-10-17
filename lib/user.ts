'use server'

import cache from '@/lib/cache';
import { cookies } from 'next/headers';
import { createUser } from '@/lib/db'
import { decrypt } from "./cookie";

export interface UserInfo {
  uid: string
  name?: string
  phone?: string
  email?: string
  picture?: string
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

    if (userToken) {
      const userInfo:any = cache.get(`user:token:${userToken}`)
      if (userInfo) {
        return JSON.parse(userInfo) as UserInfo
      }
    }

    // const anonymousToken = cookieStore.get('anonymousToken')?.value
    // if (anonymousToken) {
    //   try {
    //     return {
    //       uid: decrypt(anonymousToken),
    //     }
    //   } catch (e) {
    //     console.error(e)
    //     token = anonymousToken
    //   }
    // }
  }

  // console.log('userToken', userToken)

  // if (!userToken) return undefined

  const cacheUserInfo:any = cache.get(`user:token:${userToken}`)
  if(cacheUserInfo) {
    return JSON.parse(cacheUserInfo) as UserInfo
  }
  // return undefined
}