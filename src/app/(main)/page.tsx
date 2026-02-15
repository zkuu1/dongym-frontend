import Image from "next/image";
import Navbar from "../../components/Appbar";
import HeroSection from "@/components/Hero";
import Equipments from "@/components/Equipments";
import BestForSection from "@/components/BestFor";
import FindUsSection from "@/components/FindUs";



export default function Home() {
  return (
    <div>
      
        <Navbar/>
        <HeroSection />
        <Equipments />
        <BestForSection />
        <FindUsSection />


    </div>
  
  );
}