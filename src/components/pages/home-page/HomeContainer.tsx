import HeroSection from "./HeroSection"
import MenuSection from "./MenuSection"
import ProcessSection from "./ProcessSection"
import WhyChooseUsSection from "./WhyChooseUsSection"
// import MapSection from "./MapSection"
// import ReviewSection from "./ReviewSection"

const HomeContainer = () => {
    return (
        <div>
            <HeroSection />
            <ProcessSection />
            <MenuSection />
            {/* <MapSection /> */}
            <WhyChooseUsSection />
            {/* <ReviewSection /> */}
        </div>
    )
}
export default HomeContainer