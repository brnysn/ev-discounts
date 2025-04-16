'use client';

import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';

import { cn } from '@/lib/utils';

type SwitchProps = React.ComponentPropsWithoutRef<
  typeof SwitchPrimitives.Root
> & {
  leftIcon?: React.ElementType;
  rightIcon?: React.ElementType;
  thumbIcon?: React.ElementType;
};

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(
  (
    {
      className,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      thumbIcon: ThumbIcon,
      ...props
    },
    ref,
  ) => {
    return (
      <SwitchPrimitives.Root
        className={cn(
          'relative inline-flex h-6 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
          className
        )}
        {...props}
        ref={ref}
      >
        {LeftIcon && (
          <div className="absolute left-1 top-1/2 -translate-y-1/2 dark:text-neutral-500 text-neutral-400 data-[state=unchecked]:opacity-0 data-[state=checked]:opacity-100">
            <LeftIcon className="size-3" />
          </div>
        )}

        {RightIcon && (
          <div className="absolute right-1 top-1/2 -translate-y-1/2 dark:text-neutral-400 text-neutral-500 data-[state=checked]:opacity-0 data-[state=unchecked]:opacity-100">
            <RightIcon className="size-3" />
          </div>
        )}

        <SwitchPrimitives.Thumb
          className={cn(
            "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0",
            ThumbIcon ? "flex items-center justify-center" : ""
          )}
        >
          {ThumbIcon && <ThumbIcon className="size-3" />}
        </SwitchPrimitives.Thumb>
      </SwitchPrimitives.Root>
    );
  },
);
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch, type SwitchProps }; 