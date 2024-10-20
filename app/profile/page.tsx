import Image from "next/image";
import { getUser } from '@/lib/user';
import { accountDetails, main } from "@/lib/db"
import { AccountInfo } from "@/components/AccountInfo"
import { AccountList } from "@/components/AccountList"

export default async function ProfilePage() {
  const userInfo = await getUser();
  // await main();
  if(!userInfo) {
    return null
  }
  const res = await accountDetails(userInfo.uid)
  return (
    <div className="pt-16 lg:pt-24">
      <AccountInfo />
      <AccountList list={res} />
    </div>
    
  );
}