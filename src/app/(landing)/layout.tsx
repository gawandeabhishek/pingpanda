import { ReactNode } from "react"
import { Navbar } from "@/components/navbar"

export const runtime = "edge"

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}

export default Layout
