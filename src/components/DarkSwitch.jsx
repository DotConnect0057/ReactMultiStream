import React from 'react'
import * as Switch from '@radix-ui/react-switch'
import useDarkMode from './useDarkMode'

const DarkSwitch = () => {

  const [darkTheme, setDark] = useDarkMode();
  const toggle = () => {
      setDark(!darkTheme);
  };

  return (
    <div>
        <form>
            <div className="flex items-center" style={{ display: 'flex', alignItems: 'center' }}>
                {darkTheme ? (
                    <>
                      <label className="text-white text-[15px] 
                      leading-none pr-[15px]" htmlFor="dark-mode"
                      >
                        Dark mode
                      </label>
                      <Switch.Root
                        className="w-[42px] h-[25px] bg-blackA9 
                        rounded-full relative shadow-[0_2px_10px] 
                        shadow-blackA7 focus:shadow-[0_0_0_2px] 
                        focus:shadow-black 
                        data-[state=checked]:bg-black 
                        outline-none cursor-default"
                        id="dark-mode"
                        style={{ '-webkit-tap-highlight-color': 'rgba(0, 0, 0, 0)' }}
                        defaultChecked
                        onCheckedChange={toggle}
                      >
                        <Switch.Thumb className="block w-[21px] 
                          h-[21px] bg-white rounded-full 
                          shadow-[0_2px_2px] shadow-blackA7 
                          transition-transform duration-100 
                          translate-x-0.5 will-change-transform 
                          data-[state=checked]:translate-x-[19px]" 
                        />
                      </Switch.Root>
                    </>
                ) : (
                    <>
                      <label className="text-black text-[15px] 
                      leading-none pr-[15px]" htmlFor="dark-mode"
                      >
                        Light mode
                      </label>
                      <Switch.Root
                        className="w-[42px] h-[25px] bg-blackA9 
                        rounded-full relative shadow-[0_2px_10px] 
                        shadow-blackA7 focus:shadow-[0_0_0_2px] 
                        focus:shadow-black 
                        data-[state=checked]:bg-black 
                        outline-none cursor-default"
                        id="dark-mode"
                        style={{ '-webkit-tap-highlight-color': 'rgba(0, 0, 0, 0)' }}
                        onCheckedChange={toggle}
                      >
                        <Switch.Thumb className="block w-[21px] 
                          h-[21px] bg-white rounded-full 
                          shadow-[0_2px_2px] shadow-blackA7 
                          transition-transform duration-100 
                          translate-x-0.5 will-change-transform 
                          data-[state=checked]:translate-x-[19px]" 
                        />
                      </Switch.Root>
                    </>
                )}
            </div>
        </form>
    </div>
  )
}

export default DarkSwitch