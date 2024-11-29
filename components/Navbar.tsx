import React from 'react'
import { UserProfile } from './UserProfile'
import { SidebarTrigger } from './ui/sidebar'
import { Separator } from './ui/separator'

type Props = {}

const Navbar = (props: Props) => {
  return (
    <header className="absolute flex flex-col z-10 pt-2 top-0 bg-white dark:bg-black w-full items-center justify-between gap-2 px-2 h-14">
      <div className="flex items-center px-4 justify-between w-full mx-auto">
          <UserProfile />
          <div className="flex flex-row items-center">
          </div>
          <SidebarTrigger />
      </div>
      <Separator/>
    </header>
  )
}

export default Navbar