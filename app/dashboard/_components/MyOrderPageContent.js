'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/_components/ui/dialog';
import useDictionary from '@/_hooks/useDictionary';
import useSiteSetting from '@/_hooks/useSiteSetting';
import { decrypt } from '@/_services/encryption';
import { getMyOrders, getOrderStatus } from '@/_utils/auth/getOrders';
import { getPrintInvoice } from '@/_utils/pos/getPrintInvoice';
import Cookies from 'js-cookie';
import Link from 'next/link';
import {
    Suspense,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { BsPrinter } from 'react-icons/bs';
import { FaRegEye } from 'react-icons/fa6';


const MyOrdersPageContent = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = Cookies.get('userToken');
    const [invoice, setInvoice] = useState('');
    const [orderStatus, setOrderStatus] = useState('all');
    const [orderStatusList, setOrderStatusList] = useState([]);
    const [page, setPage] = useState(1);
    const [totalOrder, setTotalOrder] = useState(0);
    const [orderItem, setOrderItem] = useState([]);
    const loaderRef = useRef(null);
    const [isSeeMoreClick, setIsSeeMoreClick] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const { dictionary } = useDictionary();
    const { siteSetting } = useSiteSetting();

    const memoizedOrderArray = useMemo(() => {
        return orderItem;
    }, [orderItem]);

    const handleSeeMore = useCallback(() => {
        setPage((prevPage) => prevPage + 1);
        setIsSeeMoreClick(true);
    }, []);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const response = await getMyOrders(
                    decrypt(token),
                    orderStatus,
                    page,
                    1
                );
                const data = response.data;
                setOrders(data);
                setTotalOrder(response.meta.total);

                if (page === 1) {
                    setOrderItem(data);
                } else {
                    setOrderItem((prevItems) => [...prevItems, ...data]);
                }

                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };
        fetchOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, orderStatus, page]);

    useEffect(() => {
        if (orderItem.length >= totalOrder) {
            if (loaderRef.current) {
                const observer = new IntersectionObserver((entries) => {
                    if (entries[0].isIntersecting) {
                        observer.unobserve(loaderRef.current);
                    }
                });
            }
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !loading) {
                handleSeeMore();
            }
        });

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => {
            if (loaderRef.current) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                observer.unobserve(loaderRef.current);
            }
        };
    }, [loading, orderItem.length, totalOrder, handleSeeMore]);

    const handleOrderStatus = (status) => {
        setOrderStatus(status);
        setIsSeeMoreClick(false);
        setPage(1);
    };

    // Fetch the order status
    useEffect(() => {
        const fetchOrderStatus = async () => {
            setLoading(true);
            try {
                const response = await getOrderStatus(decrypt(token));
                setOrderStatusList(response.data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrderStatus();
        setPageLoading(false);
    }, [token]);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Pending':
                return 'text-[#FFA500] bg-[#FFEDB9]';
            case 'Processed':
                return 'text-[#007BFF] bg-[#BBDCFF]';
            case 'Delivered':
                return 'text-[#05825D] bg-[#81F5D2]';
            case 'Completed':
                return 'text-[#008000] bg-[#BCFFBC]';
            case 'Cancelled':
                return 'text-[#DC3545] bg-[#FFC1C7]';
            default:
                return 'text-black bg-gray-300';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'Pending':
                return dictionary.Auth.pending;
            case 'Processed':
                return dictionary.Auth.processed;
            case 'Delivered':
                return dictionary.Auth.delivered;
            case 'Completed':
                return dictionary.Auth.received;
            case 'Cancelled':
                return dictionary.Auth.cancelled;
            default:
                return 'Unknown Status';
        }
    };

    const printHandler = async (id) => {
        const invoiceData = await getPrintInvoice(decrypt(token), id);

        setInvoice(invoiceData.invoice);
    };
    return (
        <div className="h-full bg-white px-[30px] py-12 border border-gray-400 rounded-lg w-full">
            <h2 className="pb-4 mb-10 text-2xl font-medium text-gray-900 capitalize border-b border-gray-400">
                {dictionary.Auth.myOrders}
            </h2>
            <ul className="border-b border-gray-400 flex items-center gap-4 lg:gap-[30px] flex-wrap">
                <li>
                    <button
                        onClick={() => handleOrderStatus('all')}
                        className={`text-sm md:text-lg text-gray-600 font-normal border-b border-tranparent pb-1 md:pb-2 ${
                            orderStatus === 'all'
                                ? 'border-purple-900'
                                : 'border-transparent'
                        }`}
                    >
                        {dictionary.Auth.all}
                    </button>
                </li>
                {orderStatusList.map((status) => (
                    <li key={status}>
                        <button
                            onClick={() => handleOrderStatus(status)}
                            className={`text-sm md:text-lg text-gray-600 font-normal border-b border-tranparent pb-1 md:pb-2 ${
                                orderStatus === status
                                    ? 'border-purple-900'
                                    : 'border-transparent'
                            }`}
                        >
                            {getStatusText(status)}
                        </button>
                    </li>
                ))}
            </ul>

            <Suspense fallback={<h2></h2>}>
                {loading && !isSeeMoreClick ? (
                    <p></p>
                ) : memoizedOrderArray.length > 0 ? (
                    <ul className="grid gap-[18px] pt-6">
                        {memoizedOrderArray.map((order, index) => (
                            <li key={order.id}>
                                <div className="px-[18px] py-5 border border-[#E0E0E0] rounded-lg">
                                    <div className="flex flex-col items-stretch justify-between gap-6 md:flex-row">
                                        <div>
                                            <p className="mb-2 text-sm font-normal text-gray-600 md:hidden">
                                                {dictionary.Auth.placed}:{' '}
                                                {order.created_at}
                                            </p>
                                            <div className="flex items-center gap-4 mb-[18px]">
                                                <p className="text-base font-normal text-gray-600">
                                                    {dictionary.Auth.orderId}{' '}
                                                    <span className="font-semibold text-gray-700">
                                                        #{order.order_number}
                                                    </span>
                                                </p>
                                                <p
                                                    className={`text-xs inline-block font-medium px-3 py-[6px] rounded-full ${getStatusStyle(
                                                        order.status
                                                    )}`}
                                                >
                                                    {getStatusText(
                                                        order.status
                                                    )}
                                                </p>
                                            </div>
                                            <p className="text-base font-normal text-gray-600 mb-[18px]">
                                                {dictionary.Auth.orderItems}:{' '}
                                                <span className="font-semibold text-gray-700">
                                                    {order.total_quantity}
                                                </span>
                                            </p>
                                            <p className="text-base font-normal text-gray-600">
                                                {dictionary.Auth.total}:{' '}
                                                <span className="font-semibold text-gray-700">
                                                    {`${siteSetting.currency_icon || '৳'}${order.total_amount}`}
                                                </span>
                                            </p>
                                        </div>
                                        <div className="flex flex-col justify-between gap-2 items-between">
                                            <p className="hidden text-sm font-normal text-gray-600 md:block">
                                                {dictionary.Auth.placed}:{' '}
                                                <span className="font-semibold">
                                                    {order.created_at}
                                                </span>
                                            </p>
                                            <div className="flex items-center gap-4">
                                                <Link
                                                    href={`/dashboard/my-orders/${order.id}`}
                                                    class="text-sm md:text-base text-white font-medium px-[10px] md:px-[14px] py-2 md:py-2 bg-purple-900 rounded-sm flex items-center gap-2"
                                                >
                                                    <FaRegEye />{' '}
                                                    {dictionary.Auth.details}
                                                </Link>

                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <button
                                                            onClick={() =>
                                                                printHandler(
                                                                    order.id
                                                                )
                                                            }
                                                            class="text-sm md:text-base text-white font-medium px-[10px] md:px-[14px] py-2 md:py-2 bg-[#A3A3A3] rounded-sm flex items-center gap-2"
                                                        >
                                                            <BsPrinter />{' '}
                                                            {
                                                                dictionary.Auth
                                                                    .invoice
                                                            }
                                                        </button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-[350px] sm:max-w-[425px] bg-[#F6F4FD] border-[rgba(136, 49, 225, 0.20)]">
                                                        <DialogHeader className="sr-only">
                                                            <DialogTitle>
                                                                Coupon
                                                            </DialogTitle>
                                                            <DialogDescription>
                                                                Coupon
                                                                Description
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <div className="grid gap-4 py-4">
                                                            <div
                                                                className=""
                                                                dangerouslySetInnerHTML={{
                                                                    __html: invoice,
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="flex justify-center pt-10 text-gray-600">
                        {memoizedOrderArray.length < 1 && !loading && (
                            <h2 className="text-2xl font-normal">
                                {dictionary.Auth.noFound}
                            </h2>
                        )}
                    </div>
                )}
                {/* Loader element for infinite scroll */}
                <div
                    ref={loaderRef}
                    className="flex justify-center"
                >
                    {loading && orderItem.length < totalOrder && (
                        <div className="loader"></div>
                    )}
                </div>
            </Suspense>
        </div>
    );
};

export default MyOrdersPageContent;
