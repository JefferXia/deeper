import Image from "next/image";
import { accountDetails, main } from "@/lib/db"
import { AccountList } from "@/components/AccountList"

export default async function ProfilePage() {
  // await main();
  const res = await accountDetails('utest1')
  console.log(res)
  return (
    <div className="w-full min-h-screen">
      <AccountList list={res} />
    </div>
    
  );
}