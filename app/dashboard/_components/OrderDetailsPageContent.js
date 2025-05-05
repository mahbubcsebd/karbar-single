'use client';

import useDictionary from '@/_hooks/useDictionary';
import useSiteSetting from '@/_hooks/useSiteSetting';
import { decrypt } from '@/_services/encryption';
import { getOrderStatus, getSingleOrder } from '@/_utils/auth/getOrders';
import myOrderIcon from '@/assets/icons/my-orders-icon.svg';
import orderInfoIcon from '@/assets/icons/order-info-icon.svg';
import productsIcon from '@/assets/icons/products-icon.svg';
import shippingIcon from '@/assets/icons/shipping-icon.svg';
import trackingMapIcon from '@/assets/icons/track-map-icon.svg';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import OrderTrackingTimeline from './OrderTrackingTimeline ';

const OrderDetailsPageContent = ({ orderId }) => {
    const [order, setOrder] = useState(null); // Set to `null` initially
    const [orderStatus, setOrderStatus] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = Cookies.get('userToken');
    const [showTracking, setShowTracking] = useState(false);
    const { dictionary } = useDictionary();
    const { siteSetting } = useSiteSetting();

    const trackingHandler = () => {
        setShowTracking((prev) => !prev);
    };

    // Fetch the single order
    useEffect(() => {
        const fetchOrder = async () => {
            setLoading(true);
            try {
                const response = await getSingleOrder(decrypt(token), orderId);
                setOrder(response.data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [token, orderId]);

    // Fetch the order status
    useEffect(() => {
        const fetchOrderStatus = async () => {
            setLoading(true);
            try {
                const response = await getOrderStatus(decrypt(token));
                setOrderStatus(response.data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrderStatus();
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

    if (!order) return null;

    return (
        <div className="max-w-[900px]">
            <div className="p-6 mb-5 bg-white border border-gray-400 rounded-lg">
                <div
                    className={`flex flex-col md:flex-row gap-4 justify-between items-start  ${
                        showTracking && 'border-b border-gray-400 pb-5'
                    }`}
                >
                    <div className="flex items-center gap-4">
                        <div>
                            <div className="w-24 h-24 overflow-hidden">
                                <Image
                                    src={myOrderIcon}
                                    alt="my order"
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        </div>
                        <div>
                            <h3 className="mb-2 text-2xl font-bold text-gray-900 capitalize">
                                {dictionary.Auth.myOrders}
                            </h3>
                            <p className="mb-2 text-base font-medium text-gray-900">
                                {dictionary.Auth.orderId}:{' '}
                                <span className="font-semibold text-gray-900">
                                    #{order?.order_number || 'Loading...'}
                                </span>
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                                {order.order_at}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <p
                            className={`text-base inline-block px-3 py-[10px] rounded-md ${getStatusStyle(
                                order?.status || 'Pending'
                            )}`}
                        >
                            {getStatusText(order?.status || 'Pending')}
                        </p>
                        <button
                            onClick={trackingHandler}
                            className="text-base font-medium text-white px-3 py-[10px] gap-2 bg-purple-900 flex item-center rounded-md"
                        >
                            <Image
                                src={trackingMapIcon}
                                alt="tracking map"
                            />
                            {dictionary.Auth.tracking}
                        </button>
                    </div>
                </div>
                {order && order.order_tracking && showTracking && (
                    <div>
                        <OrderTrackingTimeline
                            orderStatus={orderStatus}
                            orderTracking={order.order_tracking} // Pass dynamic value here
                        />
                    </div>
                )}
            </div>
            <div className="bg-white px-[30px] py-6 border border-gray-400 rounded-lg mb-5">
                <h3 className="flex items-center gap-2 pb-2 mb-2 text-lg font-semibold text-gray-900 border-b border-gray-400">
                    <Image
                        src={shippingIcon}
                        alt="products icon"
                    />
                    {dictionary.Auth.shipping}
                </h3>
                <div className="grid gap-1">
                    <p className="text-lg font-medium text-gray-800">
                        {order.customer.name}
                    </p>
                    <p className="text-base font-normal text-gray-600">
                        {order.customer.phone}
                    </p>
                    <p className="text-base font-normal text-gray-600">
                        {order.customer.address}
                    </p>
                </div>
            </div>
            <div className="bg-white px-[30px] py-6 border border-gray-400 rounded-lg mb-5">
                <h3 className="flex items-center gap-2 pb-2 mb-2 text-lg font-semibold text-gray-900 border-b border-gray-400">
                    <Image
                        src={productsIcon}
                        alt="products icon"
                    />
                    {dictionary.Auth.products}
                </h3>

                <div className="overflow-y-auto ">
                    <ul className="grid gap-5 min-w-[500px] divide-y">
                        {order?.order_items?.map((item, index) => (
                            <li
                                key={index}
                                className="pt-5"
                            >
                                <div className="flex items-center justify-between gap-5">
                                    <div className="flex items-start gap-3">
                                        <div className="w-[90px] h-[90px] rounded-md border border-gray-400 overflow-hidden">
                                            <Image
                                                src={item.product_image}
                                                alt={item.product_name}
                                                width={90}
                                                height={90}
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                        <div className="grid gap-4 max-w-[300px]">
                                            <h4 className="text-lg font-normal text-gray-900">
                                                {item.product_name}
                                            </h4>
                                            <div className="flex items-center gap-4">
                                                {item.attributes.map(
                                                    (attr, idx) =>
                                                        attr.name ===
                                                        'color' ? (
                                                            <div
                                                                key={idx}
                                                                className="flex items-center"
                                                            >
                                                                <p className="flex items-center">
                                                                    {attr.name}{' '}
                                                                    :{' '}
                                                                    <span
                                                                        style={{
                                                                            backgroundColor: `#${attr.value}`,
                                                                        }}
                                                                        className="inline-block w-4 h-4 ml-2 border border-gray-400 rounded-full"
                                                                    ></span>
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <div
                                                                key={idx}
                                                                className="flex items-center capitalize"
                                                            >
                                                                <p>
                                                                    {attr.name}{' '}
                                                                    :{' '}
                                                                    <span className="font-semibold">
                                                                        {
                                                                            attr.value
                                                                        }
                                                                    </span>
                                                                </p>
                                                            </div>
                                                        )
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="mb-6 text-base font-medium text-gray-700">
                                            {dictionary.Auth.total}:{' '}
                                            <span className="font-semibold text-gray-800">
                                                {`${siteSetting.currency_icon || '৳'}${item.total}`}
                                            </span>
                                        </p>
                                        <p className="text-base font-medium text-gray-700">
                                            {dictionary.Auth.quantity}:{' '}
                                            <span className="font-semibold text-gray-800">
                                                {item.quantity}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="bg-white px-[30px] py-6 border border-gray-400 rounded-lg">
                <h3 className="flex items-center gap-2 pb-2 mb-2 text-lg font-semibold text-gray-900 border-b border-gray-400">
                    <Image
                        src={orderInfoIcon}
                        alt="products icon"
                    />
                    {dictionary.Auth.orderInfo}
                </h3>
                <ul className="grid">
                    <li className="py-3 border-b border-gray-400 border-dashed md:py-5">
                        <div className="flex items-center justify-between">
                            <p className="text-base font-normal text-gray-700 md:text-lg">
                                {dictionary.Auth.paymentMethod} :
                            </p>
                            <p className="text-base font-semibold text-gray-700 capitalize md:text-lg">
                                {order.payment_method}
                            </p>
                        </div>
                    </li>
                    <li className="py-3 border-b border-gray-400 border-dashed md:py-5">
                        <div className="flex items-center justify-between">
                            <p className="text-base font-normal text-gray-700 md:text-lg">
                                {dictionary.Auth.subTotal} :
                            </p>
                            <p className="text-base font-semibold text-gray-700 md:text-lg">
                                {`${siteSetting.currency_icon || '৳'}${order.sub_total}`}
                            </p>
                        </div>
                    </li>
                    <li className="py-3 border-b border-gray-400 border-dashed md:py-5">
                        <div className="flex items-center justify-between">
                            <p className="text-base font-normal text-gray-700 md:text-lg">
                                {dictionary.Auth.deliveryFee} :
                            </p>
                            <p className="text-base font-semibold text-gray-700 md:text-lg">
                                {`${siteSetting.currency_icon || '৳'}${order.delivery_fee}`}
                            </p>
                        </div>
                    </li>
                    <li className="pt-5">
                        <div className="flex items-center justify-between">
                            <p className="text-base font-normal text-gray-700 md:text-lg">
                                {dictionary.Auth.totalPay} :
                            </p>
                            <p className="text-base font-semibold text-gray-800 md:text-lg">
                                {`${siteSetting.currency_icon || '৳'}${order.total_amount}`}
                            </p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default OrderDetailsPageContent;
