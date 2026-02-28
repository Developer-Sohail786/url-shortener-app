import Navbar from "../Components/Navbar";



export default function MainLayout({ children }) {
  return (
    <>
       <Navbar/>
      {children}
     
    </>
  )
}