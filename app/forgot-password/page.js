"use client"
import KarbarButton from "@/_components/KarbarButton";
import { postForgotPassword } from "@/_utils/forgotPassword";
import { useState } from "react";
import { toast } from "react-toastify";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const submitHandler = async (e) =>{
        e.preventDefault();

        try {
          const response = await postForgotPassword({email});

          if(!email) {
            setEmailError('Email is required');
          } else {
             setEmailError(null);
          }

          // Check for successful response
          if (response.ok) {
            const responseData = await response.json();

            if (responseData.status) {
              setEmail('');
              toast.success(`${responseData.status}`, {
                position: 'bottom-right',
              });

              setSuccessMessage(`Reset password link is send your email.`);
            }
          } else {
            throw new Error('Failed to submit email');
          }
        } catch (error) {
          console.error('Error submitting email:', error);
        }
    }
  return (
    <div className="forgot-pass-page">
      <div className="container">
        <div className="min-h-screen flex justify-center items-center">
          <div className="w-[350px] rounded-xl sm:max-w-[425px] p-6 border border-gray-400">
            <h2 className="mb-4 text-3xl font-semibold text-center text-gray-900">
              Forgot Password
            </h2>
            <p className="mb-4 text-base font-normal text-center text-gray-700">
              Please provide your account email address for reset your password.
            </p>
            {successMessage && (
              <p className="bg-green-200 border border-green-300 text-base font-normal text-green-600 p-2 rounded-md mb-3">
                {successMessage}
              </p>
            )}
            <form onSubmit={submitHandler}>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourmail@gmail.com"
                className="block w-full px-[14px] py-[16px] lg:px-6 lg:py-4 3xl:px-[18px] 3xl:py-[22px] border border-[#D0D5DD] text-gray-700 ring-1 ring-inset ring-[#D0D5DD] focus:ring-1 focus:ring-blue-900 placeholder:text-gray-400 placeholder:text-base outline-hidden rounded-md input-shadow bg-white"
              />
              {emailError && (
                <small className="mt-1 text-red-500">{emailError}</small>
              )}
              <div className="pt-5">
                <KarbarButton
                  type="submit"
                  className="w-full block text-center py-[10px] px-5 md:py-4 text-[10px] sm:text-base md:text-xs lg:text-base font-normal rounded-[4px] capitalize"
                >
                  Submit
                </KarbarButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage