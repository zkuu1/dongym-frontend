import CategorySection from "@/components/Category"
import MemberCard from "@/components/Member"
import WheyProducts from "@/components/Product"
import GallerySlider from "@/components/Gallery"
import FAQComponent from "@/components/Faq"

export default function Muscle () {


  return (
    <div className="">
      <CategorySection />
      {/* <FindUsSection /> */}
      <MemberCard />
      <WheyProducts />
       <GallerySlider/>  
       <FAQComponent/>

    </div>
  )
}