import Sidebar from "@/components/SideBar"
import { TopBar } from "@/components/TopBar"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div>{children}</div>
}
