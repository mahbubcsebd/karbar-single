'use client';

import profileImgg from '@/assets/images/profile.png';
import useDictionary from '@/hooks/useDictionary';
import useUser from '@/hooks/useUser';
import { decrypt } from '@/services/encryption';
import { updateUser } from '@/utils/auth/getAuth';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const ProfileEditContent = () => {
    const { user, setUser } = useUser(); // User data from hook
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [profileImg, setProfileImg] = useState(profileImgg);
    const token = Cookies.get('userToken');
    const router = useRouter();
    const { dictionary } = useDictionary();


    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                dob: user.dob || '',
                address: user.address || '',
                currentPassword: '',
                newPassword: '',
            });
            setProfileImg(user.avatar || profileImgg);
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' })); // Clear errors on input change
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        if (formData.currentPassword && formData.currentPassword.length < 8) {
            newErrors.currentPassword =
                'Current password must be at least 8 characters';
        }
        if (formData.currentPassword && !formData.newPassword) {
            newErrors.newPassword =
                'New password is required when changing the current password';
        }
        if (formData.newPassword && formData.newPassword.length < 8) {
            newErrors.newPassword =
                'New password must be at least 8 characters';
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        const updatedData = {
            name: formData.name,
            dob: formData.dob,
            address: formData.address,
            ...(formData.currentPassword && {
                currentPassword: formData.currentPassword,
            }),
            ...(formData.newPassword && { newPassword: formData.newPassword }),
        };

        try {
            const response = await updateUser(
                JSON.stringify(updatedData),
                decrypt(token)
            );

            const updatedUser = { ...user, ...response.data };
            setUser(updatedUser);

            const existingCookie = Cookies.get('user');
            if (existingCookie) {
                const parsedCookie = JSON.parse(existingCookie);
                const newCookieData = { ...parsedCookie, ...response.data };

                Cookies.set('user', JSON.stringify(newCookieData), {
                    expires: 3,
                    secure: true,
                    sameSite: 'Strict'
                });
            }

            toast.success('Profile updated successfully', {
                position: 'bottom-right',
            });

            router.push(`/dashboard/user/${updatedUser?.username}`);
        } catch (error) {
            toast.error(error.message, {
                position: 'bottom-right',
            });
        }
    };

    return (
        <div className="bg-white px-[30px] py-12 border border-gray-400 rounded-lg">
            <form onSubmit={handleSubmit}>
                <h2 className="pb-4 text-2xl font-medium text-gray-900 border-b border-gray-400 capitalize">
                    {dictionary.Auth.editProfile}
                </h2>
                <div className="grid grid-cols-1 gap-6 pt-10 md:grid-cols-2">
                    <div className="grid gap-4 md:gap-6">
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-700">
                                {dictionary.Auth.fullName}
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Full Name"
                                className="block w-full px-[14px] py-[16px] lg:px-6 lg:py-4 3xl:px-[18px] 3xl:py-[22px] border border-[#D0D5DD] text-gray-700 ring-1 ring-inset ring-[#D0D5DD] focus:ring-1 focus:ring-blue-900 placeholder:text-gray-400 placeholder:text-base outline-hidden rounded-md input-shadow bg-white"
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">
                                    {errors.name}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-[6px] capitalize">
                                {dictionary.Auth.phone}
                            </label>
                            <input
                                type="text"
                                name="phone"
                                readOnly
                                value={formData.phone}
                                className="block w-full px-[14px] py-[16px] border border-[#D0D5DD] text-gray-700 rounded-md bg-white"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-700">
                                {dictionary.Auth.currentPass}
                            </label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleInputChange}
                                placeholder={dictionary.Auth.currentPass}
                                className="block w-full px-[14px] py-[16px] lg:px-6 lg:py-4 3xl:px-[18px] 3xl:py-[22px] border border-[#D0D5DD] text-gray-700 ring-1 ring-inset ring-[#D0D5DD] focus:ring-1 focus:ring-blue-900 placeholder:text-gray-400 placeholder:text-base outline-hidden rounded-md input-shadow bg-white"
                            />
                            {errors.currentPassword && (
                                <p className="text-sm text-red-500">
                                    {errors.currentPassword}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="grid gap-4 md:gap-6">
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-[6px] capitalize">
                                {dictionary.Auth.email}
                            </label>
                            <input
                                type="email"
                                name="email"
                                readOnly
                                value={formData.email}
                                className="block w-full px-[14px] py-[16px] border border-[#D0D5DD] text-gray-700 rounded-md bg-white"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-[6px] capitalize">
                                {dictionary.Auth.dob}
                            </label>
                            <input
                                type="date"
                                name="dob"
                                value={formData.dob}
                                onChange={handleInputChange}
                                className="block w-full px-[14px] py-[16px] border border-[#D0D5DD] text-gray-700 rounded-md bg-white"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-700">
                                {dictionary.Auth.newPass}
                            </label>
                            <input
                                type="password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleInputChange}
                                placeholder={dictionary.Auth.newPass}
                                className="block w-full px-[14px] py-[16px] lg:px-6 lg:py-4 3xl:px-[18px] 3xl:py-[22px] border border-[#D0D5DD] text-gray-700 ring-1 ring-inset ring-[#D0D5DD] focus:ring-1 focus:ring-blue-900 placeholder:text-gray-400 placeholder:text-base outline-hidden rounded-md input-shadow bg-white"
                            />
                            {errors.newPassword && (
                                <p className="text-sm text-red-500">
                                    {errors.newPassword}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="pt-5">
                    <label className="block text-gray-700 text-sm font-semibold mb-[6px]">
                        {dictionary.Auth.address}
                    </label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder={dictionary.Auth.addressPlaceholder}
                        rows="3"
                        className="block w-full px-6 py-4 border border-gray-300 rounded-md"
                    />
                </div>
                <div className="flex flex-wrap gap-4 pt-6 item-center">
                    <button
                        type="submit"
                        className="px-[30px] py-4 bg-purple-900 rounded-md text-white"
                    >
                        {dictionary.Auth.save}
                    </button>
                    <Link
                        href={`/dashboard/user/${user?.username}`}
                        onClick={() => setFormData(user)} // Reset form data
                        className="px-[30px] py-4 bg-[#FF8080] rounded-md text-white"
                    >
                        {dictionary.Auth.cancel}
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default ProfileEditContent;
