'use client';

import { ApiResponse } from '@/interfaces/common/api-response-interface';
import { useAppDispatch } from '@/lib/hooks';
import { useCompanyControllerCreateMutation } from '@/lib/quizly-api';
import { setActiveCompany } from '@/lib/slices/company-slice';
import { useMessages } from 'next-intl';
import { useGlobalToast } from '@/providers/toast-provider';
import { ReturnCompany } from '@/types/company/return-company';
import { CompanyRole, CompanyStatus } from '@/utils/enums';
import { SelectValueChangeEvent } from '@primereact/types/shared/select';
import { Button } from '@primereact/ui/button';
import { InputText } from '@primereact/ui/inputtext';
import { Label } from '@primereact/ui/label';
import { Select } from '@primereact/ui/select';
import { Textarea } from '@primereact/ui/textarea';
import { useRouter } from '@/i18n/routing';
import React, { useState } from 'react';
import { validateCompany } from '@/utils/company-form-validation-rules';

export default function CreateCompanyDialogContent({ closeDialog }: { closeDialog: () => void }) {
  const dictionary = useMessages();
  const router = useRouter();
  const toast = useGlobalToast();
  const dispatch = useAppDispatch();

  const [createCompany, { isLoading: isCreating }] = useCompanyControllerCreateMutation();

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: CompanyStatus.VISIBLE,
  });

  const updateField = (field: keyof typeof formData, value: string | CompanyStatus) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const validationErrors = validateCompany(formData, dictionary);

    if (validationErrors.length > 0) {
      setErrorMessage(validationErrors.join(', '));

      return;
    }

    if (!formData.name.trim()) return;

    try {
      const createdCompany: ApiResponse<ReturnCompany> = await createCompany({
        name: formData.name.trim(),
        description: formData.description.trim(),
        status: formData.status,
      }).unwrap();

      if (createdCompany.data) {
        dispatch(setActiveCompany({ company: createdCompany.data, role: CompanyRole.OWNER }));

        router.push(`/companies/${createdCompany.data.id}`);
      }

      toast.showToast('success', dictionary.toast.company.create.success);
      closeDialog();
    } catch (error) {
      console.error('Failed to create company:', error);
      toast.showToast('error', dictionary.toast.company.create.error);
    }
  };

  const statusOptions = [
    { label: dictionary.companies.details.statusVisible, value: CompanyStatus.VISIBLE },
    { label: dictionary.companies.details.statusHidden, value: CompanyStatus.HIDDEN },
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
          disabled={isCreating}
        >
          {dictionary.common.cancel}
        </Button>
        <Button
          type='submit'
          disabled={isCreating || !formData.name.trim() || !formData.description.trim()}
        >
          {dictionary.common.save}
          {isCreating && <i className='pi pi-spin pi-spinner ml-2' />}
        </Button>
      </div>
    </form>
  );
}
