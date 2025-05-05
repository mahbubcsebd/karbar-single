'use client';

import useDictionary from '@/_hooks/useDictionary';
import useUser from '@/_hooks/useUser';
import { decrypt } from '@/_services/encryption';
import { updateUserProfilePicture } from '@/_utils/auth/getAuth';
import profileImgg from '@/assets/images/profile.png';
import Cookies from 'js-cookie';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FiEdit3 } from 'react-icons/fi';
import { toast } from 'react-toastify';

const UserPageContent = ({userName}) => {
    const { user, setUser } = useUser();
    const [profileImg, setProfileImg] = useState(profileImgg);
    const { dictionary } = useDictionary();

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Create FormData to send the file
        const formData = new FormData();
        formData.append('avatar', file);

        try {
            // Access token from the context instead of localStorage
            const token = Cookies.get('userToken'); // Using the getCookie utility from context or manually define

            if (!token) {
                toast.error('You are not authorized. Please Login', {
                    position: 'bottom-right',
                });
                return;
            }

            // Send the request to upload the image
            const response = await updateUserProfilePicture(
                formData,
                decrypt(token)
            );

            if (response && response.data) {
                // Update local state
                setProfileImg(response.data);

                // Update user context with new avatar
                const updatedUser = { ...user, avatar: response.data };
                setUser(updatedUser);

                // Update cookies properly
                const existingCookie = Cookies.get('user');
                if (existingCookie) {
                    const parsedCookie = JSON.parse(existingCookie);
                    const newCookieData = { ...parsedCookie, avatar: response.data };

                    Cookies.set('user', JSON.stringify(newCookieData), {
                        expires: 3,
                        secure: true,
                        sameSite: 'Strict'
                    });
                }

                toast.success('Profile picture updated successfully!', {
                    position: 'bottom-right',
                });
            }
        } catch (error) {
            toast.error(`Error uploading image: ${error.message}`, {
                position: 'bottom-right',
            });
            console.error('Error uploading image:', error.message);
        }
    };

    return (
      <div className="bg-white px-[30px] py-12 border border-gray-400 rounded-lg">
        <h2 className="pb-4 text-2xl font-medium text-gray-900 capitalize border-b border-gray-400">
          {dictionary.Auth.accountDetails}
        </h2>
        <div className="pt-10">
          <h3 className="mb-3 text-lg font-medium text-gray-900">
            {dictionary.Auth.profilePhoto}
          </h3>
          <div className="flex items-center gap-[18px] w-[94px] h-[94px] relative">
            <div className="w-[94px] h-[94px] rounded-full border-2 overflow-hidden border-purple-900 p-[2px] relative">
              <Image
                src={profileImg}
                width={94}
                height={94}
                alt="profile picture"
                className="object-cover w-full h-full"
              />
              <input
                id="profileImageUpload"
                type="file"
                name="avatar"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            <label
              htmlFor="profileImageUpload"
              className="absolute bottom-1 w-[34px] h-[34px] flex items-center justify-center right-1 bg-[#E7D6F9] text-bold text-purple-900 border border-[#CFADF3] p-1 rounded-full cursor-pointer hover:bg-purple-900 hover:text-white transition-all duration-150"
            >
              <FiEdit3 />
            </label>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 pt-10 md:grid-cols-2">
          <div className="grid gap-4 md:gap-6">
            <div>
              <h3 className="mb-2 text-base font-medium text-gray-900 capitalize">
                {dictionary.Auth.fullName}
              </h3>
              <p className="text-lg font-normal text-gray-500">
                {user?.name ? user?.name : 'N/A'}
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-base font-medium text-gray-900 capitalize">
                {dictionary.Auth.phone}
              </h3>
              <p className="text-lg font-normal text-gray-500">
                {user?.phone ? user?.phone : 'N/A'}
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-base font-medium text-gray-900">
                {dictionary.Auth.role}
              </h3>
              <p className="text-lg font-normal text-gray-500 capitalize">
                {user?.role ? user?.role : 'N/A'}
              </p>
            </div>
          </div>
          <div className="grid gap-4 md:gap-6">
            <div>
              <h3 className="mb-2 text-base font-medium text-gray-900">
                {dictionary.Auth.email}
              </h3>
              <p className="text-lg font-normal text-gray-500">
                {user?.email ? user.email : 'N/A'}
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-base font-medium text-gray-900">
                {dictionary.Auth.dob}
              </h3>
              <p className="text-lg font-normal text-gray-500">
                {user?.dob ? user?.dob : 'N/A'}
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-base font-medium text-gray-900">
                {dictionary.Auth.address}
              </h3>
              <p className="text-lg font-normal text-gray-500">
                {user?.address ? user?.address : 'N/A'}
              </p>
            </div>
          </div>
          <div className="pt-5">
            <Link
              href="/dashboard/edit"
              className="px-[30px] py-4 bg-purple-900 rounded-md text-white text-base font-medium"
            >
              {dictionary.Auth.editProfile}
            </Link>
          </div>
        </div>
      </div>
    );
};

export default UserPageContent;
