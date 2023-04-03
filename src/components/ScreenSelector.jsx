import React from 'react'
import { useStateContext } from '../context/ContextProvider'
import * as Select from '@radix-ui/react-select';
import classnames from 'classnames';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';


const ScreenSelector = () => {

  const {activeScreen, setActiveScreen} = useStateContext();
  const screens = ["1", "2", "3", "4"];
  const handleScreen = (screen) => {
    setActiveScreen(() => (screen));
  }

  return (
    <Select.Root value={activeScreen} onValueChange={handleScreen}>
    <Select.Trigger
      className="inline-flex items-center justify-center rounded 
      px-[15px] text-[13px] leading-none h-[35px] gap-[5px] 
      bg-white dark:bg-[#2a2a2d] text-black dark:text-white
      shadow-[0_2px_10px] shadow-black/10 hover:bg-mauve3 
      focus:shadow-[0_0_0_2px] focus:shadow-black 
      data-[placeholder]:text-[#121212]] outline-none border
      dark:border-slate-700"
      aria-label="Food"
    >
      <Select.Value placeholder="Select Screen" />
      <Select.Icon className="text-[#121212] dark:text-white">
        <ChevronDownIcon />
      </Select.Icon>
    </Select.Trigger>
    <Select.Portal>
      <Select.Content className="overflow-hidden bg-white dark:bg-[#2a2a2d]
        rounded-md shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),
        0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]"
      >
        <Select.ScrollUpButton className="flex items-center 
          justify-center h-[25px] bg-white dark:bg-[#2a2a2d] 
          text-black dark:text-white cursor-default"
        >
          <ChevronUpIcon />
        </Select.ScrollUpButton>
        <Select.Viewport className="p-[5px]">
          <Select.Group>
            {screens.map((option) => (
              <SelectItem value={option}>Active Screen: {option}</SelectItem>
            ))}
          </Select.Group>
        </Select.Viewport>
        <Select.ScrollDownButton className="flex items-center 
          justify-center h-[25px] bg-white dark:bg-[#2a2a2d] 
          text-black dark:text-white cursor-default"
        >
          <ChevronDownIcon />
        </Select.ScrollDownButton>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
);}


const SelectItem = React.forwardRef(({ children, className, ...props }, forwardedRef) => {
  return (
    <Select.Item
      className={classnames(
        'text-[13px] leading-none text-black dark:text-white rounded-[3px] flex items-center h-[25px] pr-[35px] pl-[25px] relative select-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-violet1',
        className
      )}
      {...props}
      ref={forwardedRef}
    >
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
        <CheckIcon />
      </Select.ItemIndicator>
    </Select.Item>
  );
});


export default ScreenSelector