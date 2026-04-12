'use client';

import { useAppDispatch } from '@/lib/hooks';
import { quizlyApi, useCompanyControllerUpdateOneByIdMutation } from '@/lib/quizly-api';
import { useGlobalToast } from '@/providers/toast-provider';
import { ReturnCompany } from '@/types/company/return-company';
import { CompanyStatus } from '@/utils/enums';
import { SelectValueChangeEvent } from '@primereact/types/shared/select';
import { Button } from '@primereact/ui/button';
import { InputText } from '@primereact/ui/inputtext';
import { Label } from '@primereact/ui/label';
import { Select } from '@primereact/ui/select';
import { Textarea } from '@primereact/ui/textarea';
import { useMessages } from 'next-intl';
import React, { useState } from 'react';
import { CreateCompany } from '@/types/company/create-company';
import { validateCompany } from '@/utils/company-form-validation-rules';

export default function EditCompanyDialogContent({
  company,
  closeDialog,
}: {
  company: ReturnCompany;
  closeDialog: () => void;
}) {
  const dictionary = useMessages();
  const toast = useGlobalToast();
  const dispatch = useAppDispatch();

  const [updateCompany, { isLoading: isUpdating }] = useCompanyControllerUpdateOneByIdMutation();

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [formData, setFormData] = useState<CreateCompany>({
    name: company.name || '',
    description: company.description || '',
    status: company.status || CompanyStatus.VISIBLE,
  });

  const updateField = (field: keyof typeof formData, value: string | CompanyStatus) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const hasChanges =
    formData.name !== (company.name || '') ||
    formData.description !== (company.description || '') ||
    formData.status !== (company.status || CompanyStatus.VISIBLE);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const validationErrors = validateCompany(formData, dictionary);

    if (validationErrors.length > 0) {
      setErrorMessage(validationErrors.join(', '));

      return;
    }

    if (!formData.name.trim()) return;

    try {
      const updatedCompany = await updateCompany({
        id: company.id,
        name: formData.name.trim(),
        description: formData.description.trim(),
        status: formData.status,
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
      toast.showToast('error', dictionary.toast.company.update.error);
    }
  };

  const statusOptions = [
    {
      label: dictionary.companies.details.statusVisible,
      value: CompanyStatus.VISIBLE,
    },
    {
      label: dictionary.companies.details.statusHidden,
      value: CompanyStatus.HIDDEN,
    },
  ];

  return (
    <form onSubmit={handleSubmit} className='mt-2 flex flex-col gap-6'>
      {errorMessage && (
        <div className='rounded-md bg-red-50 p-3 text-center text-sm font-medium text-red-600 dark:bg-red-900/20 dark:text-red-400'>
          {errorMessage}
        </div>
      )}

      <div className='flex flex-col gap-1'>
        <Label htmlFor='name' className='text-sm'>
          {dictionary.companies.editDialog.name}
        </Label>
        <InputText
          id='name'
          value={formData.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('name', e.target.value)}
          className='w-full'
          autoFocus
        />
      </div>

      <div className='flex flex-col gap-1'>
        <Label htmlFor='description' className='text-sm'>
          {dictionary.companies.editDialog.description}
        </Label>
        <Textarea
          id='description'
          value={formData.description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            updateField('description', e.target.value)
          }
          rows={4}
          className='w-full resize-none'
        />
      </div>

      <div className='flex flex-col gap-1'>
        <Label htmlFor='company_status'>{dictionary.companies.editDialog.visibility}</Label>
        <Select.Root
          value={formData.status}
          onValueChange={(e: SelectValueChangeEvent) =>
            updateField('status', e.value as CompanyStatus)
          }
          options={statusOptions}
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
        <Button
          type='button'
          severity='contrast'
          variant='outlined'
          onClick={closeDialog}
          disabled={isUpdating}
        >
          {dictionary.common.cancel}
        </Button>
        <Button type='submit' disabled={isUpdating || !formData.name.trim() || !hasChanges}>
          {dictionary.common.save}
          {isUpdating && <i className='pi pi-spin pi-spinner ml-2' />}
        </Button>
      </div>
    </form>
  );
}
