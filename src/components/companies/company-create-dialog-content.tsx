'use client';

import { ApiResponse } from '@/interfaces/common/api-response-interface';
import { useAppDispatch } from '@/lib/hooks';
import { useCompanyControllerCreateMutation } from '@/lib/quizly-api';
import { setActiveCompany } from '@/lib/slices/company-slice';
import { useCurrentLocale, useDictionary } from '@/providers/dictionary-provider';
import { useGlobalToast } from '@/providers/toast-provider';
import { ReturnCompany } from '@/types/company/return-company';
import { CompanyRole, CompanyStatus } from '@/utils/enums';
import { SelectValueChangeEvent } from '@primereact/types/shared/select';
import { Button } from '@primereact/ui/button';
import { InputText } from '@primereact/ui/inputtext';
import { Label } from '@primereact/ui/label';
import { Select } from '@primereact/ui/select';
import { Textarea } from '@primereact/ui/textarea';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function CreateCompanyDialogContent({ closeDialog }: { closeDialog: () => void }) {
  const dictionary = useDictionary();
  const currentLocale = useCurrentLocale();
  const router = useRouter();
  const toast = useGlobalToast();

  const [createCompany, { isLoading: isUpdating }] = useCompanyControllerCreateMutation();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [companyStatus, setCompanyStatus] = useState<CompanyStatus>(CompanyStatus.VISIBLE);

  const dispatch = useAppDispatch();

  const handleCreate = async () => {
    if (!name.trim()) return;
    try {
      const createdCompany: ApiResponse<ReturnCompany> = await createCompany({
        name: name.trim(),
        description: description.trim(),
        status: companyStatus,
      }).unwrap();

      if (createdCompany.data) {
        dispatch(setActiveCompany({ company: createdCompany.data, role: CompanyRole.OWNER }));

        router.push(`${currentLocale}/companies/${createdCompany.data.id}`);
      }

      toast.showToast('success', dictionary.toast.company.create.success);

      closeDialog();
    } catch (error) {
      console.error('Failed to update company:', error);
    }
  };

  return (
    <div className='mt-2 flex flex-col gap-6'>
      <div className='flex flex-col gap-1'>
        <Label htmlFor='name' className='text-sm'>
          {dictionary.companies.editDialog.name}
        </Label>
        <InputText
          id='name'
          value={name}
          onInput={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.currentTarget.value)}
          className='w-full'
        />
      </div>

      <div className='flex flex-col gap-1'>
        <Label htmlFor='description' className='text-sm'>
          {dictionary.companies.editDialog.description}
        </Label>
        <Textarea
          id='description'
          value={description}
          onInput={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setDescription(e.currentTarget.value)
          }
          rows={4}
          className='w-full resize-none'
        />
      </div>
      <div className='flex flex-col gap-1'>
        <Label htmlFor='company_status'>{dictionary.companies.editDialog.visibility}</Label>
        <Select.Root
          value={companyStatus}
          onValueChange={(e: SelectValueChangeEvent) => setCompanyStatus(e.value as CompanyStatus)}
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
      </div>

      <div className='mt-2 flex shrink-0 justify-end gap-2'>
        <Button severity='contrast' variant='outlined' onClick={closeDialog} disabled={isUpdating}>
          {dictionary.common.cancel}
        </Button>
        <Button onClick={handleCreate} disabled={isUpdating || !name.trim()}>
          {dictionary.common.save}
          {isUpdating && <i className='pi pi-spin pi-spinner ml-2' />}
        </Button>
      </div>
    </div>
  );
}
