import React from 'react'
import { BiReset } from 'react-icons/bi'
import { ContextProvider, useStateContext } from '../context/ContextProvider'

const ResetScreen = () => {
  const {streamData, setStreamData} = useStateContext();
  const handleReset = () => {
    setStreamData([]);
  }
  return (
    <div className="flex w-10 h-10 items-center justify-center 
      text-black dark:text-white dark:bg-[#2a2a2d] 
      rounded-lg border dark:border-slate-700 p-2
    " onClick={handleReset}
    >
        <button>
            <BiReset />
        </button>
    </div>
  )
}

export default ResetScreen