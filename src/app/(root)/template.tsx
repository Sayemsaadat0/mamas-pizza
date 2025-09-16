import Footer from "@/components/core/Footer"
import Navbar from "@/components/core/Navbar"

const template = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <Navbar />
            {children}
            <Footer />
        </div>
    )
}
export default template