import LoginPage from "@/components/pages/login-page/LoginPage"

const page = () => { 
  const url = process.env.NEXT_PUBLIC_API_URL
  console.log(url)
  return (
    <div>
      <LoginPage />
    </div>
  )
}

export default page
