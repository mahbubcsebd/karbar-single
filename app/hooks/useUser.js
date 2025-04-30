import { useContext } from 'react';
import UserContext from '../context/UserContext';

const useUser = () => {
    const { user, setUser, handleLogout } = useContext(UserContext);
    return { user, setUser, handleLogout };
};

export default useUser;
