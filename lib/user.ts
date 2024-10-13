'use server'

import cache from '@/lib/cache';
import { cookies } from 'next/headers';
// import kysely from '@/kysely/db'
// import { getUTC8ISOString } from '@/lib/utils'
import { decrypt } from "./cookie";

export interface UserInfo {
  uid: string
  name?: string
  email?: string
  picture?: string
} 
export async function saveUser(token: string, user: UserInfo) {
  cache.set(`user:token:${token}`, JSON.stringify(user))
  // const dateTime = getUTC8ISOString()
  // await kysely
  //   .insertInto('User')
  //   .values({
  //     id: user.uid,
  //     email: user.email,
  //     name: user.name,
  //     picture: user.picture,
  //     updatedAt: dateTime,
  //     createdAt: dateTime
  //   })
  //   .onConflict((oc) => {
  //     return oc
  //       .column('id')
  //       .doNothing()
  //   })
  //   .executeTakeFirst()
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

  if (!userToken) return { uid: 'anonymous' }

  const userInfo = cache.get(`user:token:${userToken}`) ?? { uid: 'anonymous' }

  return userInfo as UserInfo
}