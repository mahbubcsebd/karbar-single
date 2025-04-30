// import PosProvider from '@/context/PosProductContext';

import { PosProvider } from "../context/PosProductContext";
import AuthProvider from "../provider/authProvider";

const PosLayout = ({ children }) => {
    return (
        <div>
            <AuthProvider>
                <PosProvider>{children}</PosProvider>
            </AuthProvider>
        </div>
    );
};

export default PosLayout;
