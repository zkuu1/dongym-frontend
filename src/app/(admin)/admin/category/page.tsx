
import { cookies } from "next/headers";


export default async function CategoryPage() {

  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  



  return (

    <div className="">
        <h1>category</h1>
    </div>
   
  );
}