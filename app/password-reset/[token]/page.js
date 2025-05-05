'use client';

import KarbarButton from '@/_components/KarbarButton';
import { postResetPassword } from '@/_utils/forgotPassword';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

const PasswordReset = () => {
  const params = useParams();
  const searchParams = useSearchParams();

  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');

  const router = useRouter()

  useEffect(() => {
    const tokenParam = params.token;
    const emailParam = searchParams.get('email');

    if (tokenParam) setToken(tokenParam);
    if (emailParam) setEmail(emailParam);
  }, [params, searchParams]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    try {
        const response = await postResetPassword({
        token,
        email,
        password: data.password,
        password_confirmation: data.password_confirmation,
        });


        if (response.ok) {

        const responseData = await response.json();

        console.log(responseData);
        if (responseData.success) {
          toast.success(responseData.message, {
            position: 'bottom-right',
          });
          router.push('/');
        } else {
          toast.error(responseData.message, {
            position: 'bottom-right',
          });
        }
      } else {
        throw new Error(responseData.message || 'Failed to reset password');
      }
    } catch (error) {
      toast.error(error.message || 'Something went wrong!', {
        position: 'bottom-right',
      });
    }
  };

  return (
    <div className="forgot-pass-page">
      <div className="container">
        <div className="min-h-screen flex justify-center items-center">
          <div className="w-[350px] rounded-xl sm:max-w-[425px] p-6 border border-gray-400">
            <h2 className="mb-4 text-3xl font-semibold text-center text-gray-900">
              Reset Password
            </h2>
            <p className="mb-4 text-base font-normal text-center text-gray-700">
              Enter your new password below.
            </p>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Password Input */}
              <input
                type="password"
                placeholder="Enter new password"
                className={`block w-full px-[14px] py-[16px] lg:px-6 lg:py-4 3xl:px-[18px] 3xl:py-[22px] border border-[#D0D5DD] text-gray-700 ring-1 ring-inset ring-[#D0D5DD] focus:ring-1 focus:ring-blue-900 placeholder:text-gray-400 placeholder:text-base outline-hidden rounded-md input-shadow bg-white" ${
                  errors.password ? 'border-red-500' : 'border-[#D0D5DD]'
                }`}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}

              {/* Confirm Password Input */}
              <input
                type="password"
                placeholder="Confirm new password"
                className={`block w-full px-[14px] py-[16px] lg:px-6 lg:py-4 3xl:px-[18px] 3xl:py-[22px] border text-gray-700 ring-1 ring-inset ring-[#D0D5DD] focus:ring-1 focus:ring-blue-900 placeholder:text-gray-400 placeholder:text-base outline-hidden rounded-md input-shadow bg-white" mt-4 ${
                  errors.password_confirmation
                    ? 'border-red-500'
                    : 'border-[#D0D5DD]'
                }`}
                {...register('password_confirmation', {
                  required: 'Please confirm your password',
                  validate: (value) =>
                    value === password || 'Passwords do not match',
                })}
              />
              {errors.password_confirmation && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password_confirmation.message}
                </p>
              )}

              <KarbarButton
                type="submit"
                className="mt-5 w-full block text-center py-[10px] px-5 md:py-4 text-[10px] sm:text-base md:text-xs lg:text-base font-normal rounded-[4px] capitalize"
              >
                Submit
              </KarbarButton>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
