import { useState, useEffect } from 'react';
import { useMessages } from 'next-intl';
import { useGlobalToast } from '@/providers/toast-provider';
import { useAppDispatch } from '@/lib/hooks';
import { useAuthControllerSignupMutation } from '@/lib/quizly-api';
import { setCurrentUser } from '@/lib/slices/auth-slice';
import { HttpExceptionResponse } from '@/interfaces/common/api-exception-interface';
import { CreateUser } from '@/types/user/create-user';
import { validateSignup } from '@/utils/signup-form-validation-rules';
import { HOME_ROUTE } from '@/utils/router-constants';
import { useRouter } from '@/i18n/routing';

export function useSignupForm() {
  const dictionary = useMessages();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const toast = useGlobalToast();

  const [signup, { isLoading, isSuccess }] = useAuthControllerSignupMutation();

  const [formData, setFormData] = useState<CreateUser & { confirmPassword: string }>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errorMessage, setErrorMessage] = useState<string>('');

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errorMessage) setErrorMessage('');
  };

  useEffect(() => {
    if (isSuccess) {
      toast.showToast('success', dictionary.toast.signup.success);
    }
  }, [isSuccess, toast, dictionary]);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const validationErrors = validateSignup(formData, dictionary);

    if (validationErrors.length > 0) {
      setErrorMessage(validationErrors.join(', '));

      return;
    }

    try {
      const response = await signup({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
      }).unwrap();

      if (response.data) {
        dispatch(setCurrentUser({ user: response.data }));
        router.push(HOME_ROUTE);
      }
    } catch (error) {
      const apiError = (error as { data: HttpExceptionResponse }).data;

      if (apiError?.statusCode === 409) {
        setErrorMessage(dictionary.auth.signUp.validationErrors.accountAlreadyExists);
      } else if (Array.isArray(apiError?.details) && apiError.details.length > 0) {
        const validationMessages = apiError.details
          .flatMap((detail) => detail.messages || [])
          .join(', ');
        setErrorMessage(validationMessages);
      } else {
        setErrorMessage('An unexpected error occurred.');
      }
    }
  };

  return {
    formData,
    errorMessage,
    isLoading,
    updateField,
    handleSubmit,
  };
}
