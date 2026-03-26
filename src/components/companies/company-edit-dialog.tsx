'use client';

import { mockCompany } from '@/mock/company-mock';
import { CompanyStatus } from '@/utils/enums';
import { DialogContentInstance } from '@primereact/types/shared/dialog';
import { SelectValueChangeEvent } from '@primereact/types/shared/select';
import { Button } from '@primereact/ui/button';
import { Dialog } from '@primereact/ui/dialog';
import { FloatLabel } from '@primereact/ui/floatlabel';
import { InputText } from '@primereact/ui/inputtext';
import { Label } from '@primereact/ui/label';
import { Select } from '@primereact/ui/select';
import { Textarea } from '@primereact/ui/textarea';
import * as React from 'react';

export default function EditCompanyDialog({ company }: { company: typeof mockCompany }) {
  const [companyStatus, setCompanyStatus] = React.useState<CompanyStatus>(CompanyStatus.VISIBLE);

  return (
    <Dialog.Root modal position='center' draggable={false}>
      <Dialog.Trigger>
        <i className='pi pi-pencil' />

        <h3 className='hidden sm:block'>Edit Company</h3>
      </Dialog.Trigger>

      <Dialog.Backdrop className='cursor-pointer' />

      <Dialog.Portal className='w-[95vw] max-w-full sm:w-md'>
        <Dialog.Header>
          <Dialog.Title>Edit Company</Dialog.Title>
          <Dialog.HeaderActions>
            <Dialog.Close>
              <i className='pi pi-times' />
            </Dialog.Close>
          </Dialog.HeaderActions>
        </Dialog.Header>

        <Dialog.Content>
          {(instance: DialogContentInstance) => {
            const { dialog } = instance;

            return (
              <div className='flex flex-col gap-6'>
                <div className='flex flex-col gap-1'>
                  <Label htmlFor='name' className='text-sm'>
                    Company Name
                  </Label>

                  <InputText id='name' defaultValue={company.name} className='w-full' />
                </div>

                <div className='flex flex-col gap-1'>
                  <Label htmlFor='description' className='text-sm'>
                    Description
                  </Label>

                  <Textarea
                    id='description'
                    defaultValue={company.description}
                    rows={4}
                    className='w-full resize-none'
                  />
                </div>

                <div className='mt-2 flex flex-col gap-1'>
                  <FloatLabel>
                    <Select.Root
                      onValueChange={(e: SelectValueChangeEvent) =>
                        setCompanyStatus(e.value as CompanyStatus)
                      }
                      options={[
                        { label: 'Visible to everyone', value: CompanyStatus.VISIBLE },
                        { label: 'Hidden from public', value: CompanyStatus.HIDDEN },
                      ]}
                      optionLabel='label'
                      optionValue='value'
                      className='w-full'
                    >
                      <Select.Trigger id='company_status'>
                        <Select.Value />
                        <Select.Icon>
                          <i className='pi pi-chevron-down text-surface-500' />
                        </Select.Icon>
                      </Select.Trigger>

                      <Select.Portal>
                        <Select.Positioner style={{ zIndex: 3000 }}>
                          <Select.Panel>
                            <Select.List>
                              <Select.Options />
                            </Select.List>
                          </Select.Panel>
                        </Select.Positioner>
                      </Select.Portal>
                    </Select.Root>
                    <Label htmlFor='company_status'>Company visibility</Label>
                  </FloatLabel>
                </div>

                <div className='mt-2 flex shrink-0 justify-end gap-2'>
                  <Button severity='secondary' onClick={dialog?.close}>
                    Cancel
                  </Button>

                  <Button onClick={dialog?.close}>Save Changes</Button>
                </div>
              </div>
            );
          }}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
