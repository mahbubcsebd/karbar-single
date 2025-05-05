'use server'

import { toast } from 'react-toastify';
import { loginUser, registerUser } from '../_utils/auth/getAuth';

 const authHandler = async (data, authType) => {
     if (authType === 'signUp') {
         // Handle sign in logic here
         const userData = {
             name: data.fullName,
             phone: data.phone,
             email: data.email,
             password: data.password,
             password_confirmation: data.confirmPassword,
         };

         try {
             const response = await registerUser(JSON.stringify(userData));

             if (response.ok) {
                 const responseData = await response.json();

                 if (responseData.success) {
                     toast.success(`${responseData.message}`, {
                         position: 'bottom-right',
                     });
                 } else {
                     toast.error(`${responseData.message}`, {
                         position: 'bottom-right',
                     });
                 }
             } else {
                 throw new Error('Failed to submit Order');
             }
         } catch (error) {
             console.error('Error submitting review:', error);
         }
     } else if (authType === 'signIn') {
         // Handle sign in logic here
         const userData = {
             email_username: data.email,
             password: data.password,
             remember: data.remember,
         };

         try {
             const response = await loginUser(JSON.stringify(userData));

             if (response.ok) {
                 const responseData = await response.json();

                 if (responseData.success) {
                     toast.success(`${responseData.message}`, {
                         position: 'bottom-right',
                     });
                 } else {
                     toast.error(`${responseData.message}`, {
                         position: 'bottom-right',
                     });
                 }
             } else {
                 throw new Error('Failed to submit Order');
             }
         } catch (error) {
             console.error('Error submitting review:', error);
         }
     }
 };


 export default authHandler;