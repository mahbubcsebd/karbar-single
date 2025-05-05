import { decrypt } from '@/_services/encryption';
import { getUserDetails, logOut } from '@/_utils/auth/getAuth'; // Ensure these are implemented correctly
import Cookies from 'js-cookie'; // Install via `npm install js-cookie`
import { useRouter } from 'next/navigation';
import { createContext, useEffect, useState } from 'react';


// Create a UserContext
const UserContext = createContext('');

// UserProvider component
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const router = useRouter();
    // const { state, dispatch } = useContext(ProductContext);

    // Function to fetch user data based on the token
    const fetchUserData = async (token) => {
        try {
            const userData = await getUserDetails(decrypt(token));
            setUser(userData);

            // Store user data in cookies
            Cookies.set('user', JSON.stringify(userData), {
                expires: 3, // Automatically handles expiration
                secure: true,
                sameSite: 'Strict',
            });
        } catch (error) {
            console.error('Error fetching user data:', error);
            handleLogout();
        }
    };

    // Function to handle user logout
    const handleLogout = async () => {
        try {
            const token = Cookies.get('userToken');
            if (token) {
                await logOut(decrypt(token));
                setUser(null);
                Cookies.remove('user');
                Cookies.remove('userToken');
                router.push('/');
            }

        } catch (error) {
            console.error('Error during logout:', error);
        } finally {

            // dispatch({
            //     type: 'CLEAR_CART',
            // });
        }
    };

    // useEffect to validate the token and fetch user data
    useEffect(() => {
        const token = Cookies.get('userToken');
        const storedUser = Cookies.get('user');

        if (token) {
            // If token exists, check if user data is already stored
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            } else {
                fetchUserData(decrypt(token)); // Fetch user if not in cookies
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Dependencies are correct

    return (
        <UserContext.Provider value={{ user, setUser, handleLogout }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
