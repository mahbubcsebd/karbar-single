// import PosProvider from '@/_context/PosProductContext';

import { PosProvider } from "../_context/PosProductContext";
import AuthProvider from "../_provider/authProvider";

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
