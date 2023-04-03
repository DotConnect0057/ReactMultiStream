import React from 'react'
import DarkSwitch from './DarkSwitch'
import SearchBox from './SearchBox'
import ScreenSelector from './ScreenSelector'
import ResetScreen from './ResetScreen'
import AddFavorite from './AddFavorite'

const Navbar = () => {
  return (
    <div className="flex w-full justify-between">
      <SearchBox />
      <ScreenSelector />
      <ResetScreen />
      <AddFavorite />
      <DarkSwitch />
    </div>
  )
}

export default Navbar