import CategorySection from "@/components/Category"

import MemberCard from "@/components/Member"
import WheyProducts from "@/components/Product"
import GallerySlider from "@/components/Gallery"
import FAQComponent from "@/components/Faq"
import HeroSection from "@/components/Hero"




export default function Muscle () {



  const productImages = [
    {
      id: 1,
      name: "Evoline Whey",
      kategori: "Whey",
      image: "/images/whey.jpg"
    },
    {
      id: 2,
      name: "Protein Bar",
      kategori: "Snack",
      image: "/images/protein-bar.jpg"
    },
    {
      id: 3,
      name: "BCAA",
      kategori: "Amino",
      image: "/images/bcaa.jpg"
    },
    // Tambahkan lebih banyak produk di sini
  ];


  return (
    <div className="">
      <HeroSection/>
      <CategorySection />
      {/* <FindUsSection /> */}
      <MemberCard />
      <WheyProducts />
       <GallerySlider/>  
       <FAQComponent/>

    </div>
  )
}