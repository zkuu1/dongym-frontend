
import { cookies } from "next/headers";
import Usertable from "../components/table/userTable";
import Membershiptable from "../components/table/membershipTable";

export default async function AdminPage() {

  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  



  return (

    <div className="">
          <Usertable/>
         <div className="mt-10">
             <Membershiptable/>
         </div>
         
    </div>
   
  );
}