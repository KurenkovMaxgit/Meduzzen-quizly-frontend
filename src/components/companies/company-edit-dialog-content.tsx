'use client';

import { useAppDispatch } from '@/lib/hooks';
import { quizlyApi, useCompanyControllerUpdateOneByIdMutation } from '@/lib/quizly-api';
import { useDictionary } from '@/providers/dictionary-provider';
import { useGlobalToast } from '@/providers/toast-provider';
import { ReturnCompany } from '@/types/company/return-company';
import { CompanyStatus } from '@/utils/enums';
import { SelectValueChangeEvent } from '@primereact/types/shared/select';
import { Button } from '@primereact/ui/button';
import { InputText } from '@primereact/ui/inputtext';
import { Label } from '@primereact/ui/label';
import { Select } from '@primereact/ui/select';
import { Textarea } from '@primereact/ui/textarea';
import React, { useState } from 'react';

export default function EditCompanyDialogContent({
  company,
  closeDialog,
}: {
  company: ReturnCompany;
  closeDialog: () => void;
}) {
  const dictionary = useDictionary();
  const toast = useGlobalToast();

  const [updateCompany, { isLoading: isUpdating }] = useCompanyControllerUpdateOneByIdMutation();

  const [name, setName] = useState(company.name || '');
  const [description, setDescription] = useState(company.description || '');
  const [companyStatus, setCompanyStatus] = useState<CompanyStatus>(
    company.status || CompanyStatus.VISIBLE,
  );

  const dispatch = useAppDispatch();

  const handleUpdate = async () => {
    if (!name.trim()) return;

    try {
      const updatedCompany = await updateCompany({
        id: company.id,
        name: name.trim(),
        description: description.trim(),
        status: companyStatus,
      }).unwrap();

      dispatch(
        quizlyApi.util.updateQueryData(
          'companyControllerFindOneById',
          { id: company.id, relations: 'members.user' },
          (draft) => {
            if (draft?.data) {
              Object.assign(draft.data, updatedCompany.data || updatedCompany);
            }
          },
        ),
      );

      toast.showToast('success', dictionary.toast.company.update.success);

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
        <Button onClick={handleUpdate} disabled={isUpdating || !name.trim()}>
          {dictionary.common.save}
          {isUpdating && <i className='pi pi-spin pi-spinner ml-2' />}
        </Button>
      </div>
    </div>
  );
}
