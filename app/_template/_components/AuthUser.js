import orderIcon from '@/assets/icons/order.svg';
import profileIcon from '@/assets/icons/profile.svg';
import profileImg from '@/assets/images/profile.png';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useDictionary from '@/hooks/useDictionary';
import useUser from '@/hooks/useUser';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { TbLogout } from "react-icons/tb";

const AuthUser = ({theme}) => {
    const [open, setOpen] = useState(false);
    const { user, handleLogout } = useUser();
    const { dictionary } = useDictionary();

    const handleMenuItemClick = () => {
        setOpen(false); // Close the dropdown when an item is clicked
    };

    return (
        <div>
            <DropdownMenu
                open={open}
                onOpenChange={setOpen}
            >
                <DropdownMenuTrigger>
                    <div className="flex items-center gap-2 cursor-pointer">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden p-[1px] border border-purple-900">
                            <Image
                                src={user?.avatar ? user?.avatar : profileImg}
                                width={40}
                                height={40}
                                alt="profile picture"
                                className="w-full h-full rounded-full"
                            />
                        </div>
                        <p
                            className={`items-center hidden gap-2 text-base font-semibold lg:flex ${
                                theme === 'dark'
                                    ? 'text-white'
                                    : 'text-gray-800'
                            }`}
                        >
                            {user?.name.split(' ')[0]} <IoIosArrowDown />
                        </p>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="min-w-[250px]">
                    <DropdownMenuItem
                        onClick={handleMenuItemClick}
                        className="p-0 px-2 pt-2"
                    >
                        <Link href={`/dashboard/user/${user?.username}`}>
                            <div className="flex items-center gap-2 cursor-pointer">
                                <div>
                                    <Image
                                        src={
                                            user?.avatar
                                                ? user?.avatar
                                                : profileImg
                                        }
                                        width={40}
                                        height={40}
                                        alt="profile picture"
                                        className="w-12 h-12 rounded-full"
                                    />
                                </div>
                                <div className="grid gap-1">
                                    <h3 className="text-base font-semibold text-gray-800 capitalize">
                                        {user?.name ? user?.name : 'Demo User'}
                                    </h3>
                                    <p className="text-sm font-normal text-gray-500 capitalize">
                                        {user?.role ? user?.role : 'Customer'}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-2" />
                    <DropdownMenuItem
                        onClick={handleMenuItemClick}
                        className="p-0"
                    >
                        <Link
                            href={`/dashboard/user/${user?.username}`}
                            className="flex items-center w-full gap-2 px-3 py-2 text-base font-normal text-gray-800 transition-all duration-150 rounded-sm auth-link hover:bg-gray-300 capitalize"
                        >
                            <Image
                                src={profileIcon}
                                alt="profile icon"
                                className="auth-icon"
                            />
                            {dictionary.Auth.profile}
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={handleMenuItemClick}
                        className="p-0"
                    >
                        <Link
                            href="/dashboard/my-orders"
                            className="flex items-center w-full gap-2 px-3 py-2 text-base font-normal text-gray-800 transition-all duration-150 rounded-sm auth-link hover:bg-gray-300 capitalize"
                        >
                            <Image
                                src={orderIcon}
                                alt="orders icon"
                                className="auth-icon"
                            />
                            {dictionary.Auth.myOrders}
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="p-0">
                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-center w-full gap-2 px-4 py-3 text-base text-white bg-purple-900 rounded"
                        >
                            <TbLogout size={18} /> {dictionary.Auth.logout}
                        </button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default AuthUser;
