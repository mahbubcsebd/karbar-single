/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import useDictionary from '@/_hooks/useDictionary';
import { useSearchParams } from 'next/navigation';
import {
    useEffect,
    useState
} from 'react';
import useAuth from '../../_hooks/useAuth';
import BillTable from './BillTable';

const TallyProductsList = ({
    selectedProducts,
    customervalue,
    setCustomerValue,
    warehousevalue,
    setWarehouseValue,
    setRows,
}) => {
    const [authenticated, setAuthenticated] = useState(true);
    const [posAuth, setPosAuth] = useState(true);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const { language, dictionary } = useDictionary();
    const searchParams = useSearchParams();
    const { authToken, setAuthToken } = useAuth();

    const token = searchParams.get('token');

    useEffect(() => {
        setAuthToken(token);
        setPageLoading(false);
    }, [token]);

    if ((!authenticated && authToken) || (!authToken && !pageLoading)) {
        return (
            <div className="">
                <div className="container">
                    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center bg-white rounded-[16px]">
                        <p className="text-3xl font-semibold text-gray-500">
                            You are not authorized. Please Login
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="grid justify-end">
            <BillTable
                customervalue={customervalue}
                setCustomerValue={setCustomerValue}
                warehousevalue={warehousevalue}
                setWarehouseValue={setWarehouseValue}
                selectedProducts={selectedProducts}
                setRows={setRows}
            />
        </div>
    );
};

export default TallyProductsList;
