import { usePasswordStrength } from '@/hooks/use-password-strength';
import { useDictionary } from '@/providers/dictionary-provider';
import { cn } from '@/utils/cn';
import {
  PasswordMaskChangeEvent,
  PasswordValueChangeEvent,
} from '@primereact/types/shared/password';
import { FloatLabel } from '@primereact/ui/floatlabel';
import { IconField } from '@primereact/ui/iconfield';
import { Password } from '@primereact/ui/password';
import { Popover } from '@primereact/ui/popover';
import { ProgressBar } from '@primereact/ui/progressbar';
import { Tag } from '@primereact/ui/tag';
import { useState } from 'react';

export function CreatePasswordInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const dictionary = useDictionary();

  const [mask, setMask] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);

  const { rules, score, strengthProps, strengthLabel } = usePasswordStrength(value, dictionary);

  return (
    <Popover.Root open={open}>
      <Popover.Trigger as='div' className='w-full'>
        <FloatLabel>
          <IconField.Root>
            <Password
              id='password'
              mask={mask}
              onMaskChange={(e: PasswordMaskChangeEvent) => setMask(e.value)}
              value={value}
              fluid
              onValueChange={(e: PasswordValueChangeEvent) => onChange(e.value)}
              onFocus={() => setOpen(true)}
              onBlur={() => setOpen(false)}
              required
              className='w-full'
            />
            <IconField.Icon>
              {mask ? (
                <i className='pi pi-eye cursor-pointer' onClick={() => setMask(false)} />
              ) : (
                <i className='pi pi-eye-slash cursor-pointer' onClick={() => setMask(true)} />
              )}
            </IconField.Icon>
          </IconField.Root>
          <label htmlFor='password' className='text-surface-900 dark:text-surface-0 font-medium'>
            {dictionary.auth.signUp.password}
          </label>
        </FloatLabel>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner sideOffset={12} side='bottom' align='start'>
          <Popover.Content className='border-surface-200 bg-surface-0 dark:border-surface-700 dark:bg-surface-900 w-72 rounded-xl border p-3 shadow-lg'>
            <div className='flex flex-col gap-3'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <i className='pi pi-shield text-surface-500 text-xl' />
                  <span className='text-surface-900 dark:text-surface-0 text-sm font-semibold'>
                    {dictionary.auth.signUp.passwordStrength.title}
                  </span>
                </div>
                {strengthLabel && <Tag severity={strengthProps.severity}>{strengthLabel}</Tag>}
              </div>

              <ProgressBar.Root value={score}>
                <ProgressBar.Track className='bg-surface-200 dark:bg-surface-700 h-1.5! overflow-hidden rounded-md'>
                  <ProgressBar.Indicator
                    className={cn(
                      'h-full transition-all duration-300',
                      score <= 20
                        ? 'bg-red-400!'
                        : score <= 40
                          ? 'bg-amber-400!'
                          : score <= 60
                            ? 'bg-blue-400!'
                            : 'bg-green-400!',
                    )}
                  />
                </ProgressBar.Track>
              </ProgressBar.Root>

              <div className='m-0 flex flex-col gap-2 p-0'>
                {rules.map((rule) => {
                  const met = rule.test(value);

                  return (
                    <div key={rule.id} className='flex items-center gap-2 text-xs'>
                      <i
                        className={cn(
                          met ? 'pi pi-check text-green-500' : 'pi pi-times text-red-400',
                        )}
                      />
                      <span
                        className={cn(
                          met
                            ? 'text-surface-500 dark:text-surface-400'
                            : 'text-surface-700 dark:text-surface-200',
                        )}
                      >
                        {rule.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <Popover.Arrow />
          </Popover.Content>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
