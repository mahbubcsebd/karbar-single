'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa6';
import { RxCross2 } from 'react-icons/rx';
import { toast } from 'react-toastify';
import Input from '../../../_components/form/Input';
import PaymentRadio from '../../../_components/form/PaymentRadio';
import { ProductContext } from '../../../_context/cartContext';
import useAdManager from '../../../_hooks/useAdManager';
import useDictionary from '../../../_hooks/useDictionary';
import useOrderId from '../../../_hooks/useOrderId';
import bkash from '../../../assets/icons/checkout-bkash.svg';
import cod from '../../../assets/icons/checkout-cod.svg';
import nagad from '../../../assets/icons/checkout-nagad.svg';
// import KarbarButton from '../../../KarbarButton';
import KarbarButton from '@/_components/KarbarButton';
import { trackEvent } from '../../../_utils/facebookPixel';
import { getCoupon } from '../../../_utils/getCoupon';
import { orderPost } from '../../../_utils/orderPost';

const LandingCheckoutPage = ({
    siteSettings,
    paymentMethod,
    is_multiple_quantity_allow,
    is_combo_product,
    combo,
    is_coupon_field_visible,
}) => {
    const [total, setTotal] = useState(0);
    const [couponApply, setCouponApply] = useState(true);
    const [orderLoading, setOrderLoading] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [productStock, setProductStock] = useState(0);
    const [discountValue, setDiscountValue] = useState(null);
    const { dictionary } = useDictionary();
    const { adManager } = useAdManager();
    const { orderId, setOrderId } = useOrderId();

    const {
        formTitle,
        orderTitle,
        paymentTitle,
        dicSubTotal,
        dicDeliveryFee,
        dicCouponProvide,
        dicTotal,
        dicConfirm,
        dicConfirmProcessing,
        Form,
        cartEmpty,
        bkashMsgBefore,
        bkashMsgAfter,
        nagadMsgBefore,
        nagadMsgAfter,
        provideBkashNumber,
        provideNagadNumber,
        bkashTransactionID,
        nagadTransactionID,
    } = dictionary.Checkout;

    const {
        nameLabel,
        namePlaceholder,
        phoneLabel,
        phonePlaceholder,
        emailLabel,
        emailPlaceholder,
        areaLabel,
        insideDhaka,
        outsideDhaka,
        dhakaSubArea,
        freeDelevery,
        currency,
        addressLabel,
        addressPlaceholder,
        noteLabel,
        optional,
        notePlaceholder,
    } = Form;

    const handleCodeChange = (event) => {
        setCouponCode(event.target.value);
    };

    const bkashNum = paymentMethod.find(
        (method) => method.name === 'bkash'
    )?.number;
    const nagadNum = paymentMethod.find(
        (method) => method.name === 'nagad'
    )?.number;

    const cashDetails = paymentMethod.find(
        (method) => method.name === 'cash'
    )?.details;
    const bkashDetails = paymentMethod.find(
        (method) => method.name === 'bkash'
    )?.details;
    const nagadDetails = paymentMethod.find(
        (method) => method.name === 'nagad'
    )?.details;

    const { inside_dhaka, outside_dhaka, dhaka_sub_area } = siteSettings;

    const insideDhakaDC = inside_dhaka ? Number(inside_dhaka) : 0;
    const outsideDhakaDC = outside_dhaka ? Number(outside_dhaka) : 0;
    const dhakaSub = dhaka_sub_area ? Number(dhaka_sub_area) : 0;

    const router = useRouter();
    const [selectedValue, setSelectedValue] = useState('inside_dhaka');
    const [selectedPayment, setSelectedPayment] = useState('cash');
    const [shippingCost, setShippingCost] = useState(insideDhakaDC);

    const [nameWarningMessage, setNameWarningMessage] = useState(null);
    // const [emailWarningMessage, setEmailWarningMessage] = useState(null);
    const [phoneWarningMessage, setPhoneWarningMessage] = useState(null);
    const [phoneValidMsg, setPhoneValidMsg] = useState(null);
    const [addressWarningMessage, setAddressWarningMessage] = useState(null);

    const { state, dispatch } = useContext(ProductContext);
    const { cartItems, cartTotal } = state;
    const [subTotal, setSubtotal] = useState(null);
    const [save, setSave] = useState(null);

    // setSubtotal(cartTotal);
    useEffect(() => {
        setSubtotal(cartTotal);
    }, [cartTotal]);

    useEffect(() => {
        setTotal(subTotal + shippingCost - save);
    }, [subTotal, shippingCost, cartTotal, save]);

    useEffect(() => {
        const totalQuantity = cartItems.reduce((accumulator, currentObject) => {
            return accumulator + currentObject.quantity;
        }, 0);

        console.log('Total Quantity:', totalQuantity);

        // Initialize save amount
        let saveAmount = 0;

        // Check for applicable discounts based on total quantity
        const applicableCombo = combo.find(
            (c) => totalQuantity === parseInt(c.quantity)
        );

        if (applicableCombo) {
            if (applicableCombo.discount_type === 'percentage') {
                // Percentage discount
                saveAmount =
                    (cartTotal * parseInt(applicableCombo.discount_amount)) /
                    100;
            } else if (applicableCombo.discount_type === 'flat') {
                // Flat discount
                saveAmount = parseInt(applicableCombo.discount_amount);
            }
        }

        setSave(Math.round(saveAmount));

        // Log saveAmount directly
        console.log('Save Amount:', save);
    }, [cartItems, combo, cartTotal, save]);

    const handleSelectChange = (event) => {
        const value = event.target.value;
        setSelectedValue(value);

        if (value === 'inside_dhaka') {
            setShippingCost(insideDhakaDC);
        } else if (value === 'outside_dhaka') {
            setShippingCost(outsideDhakaDC);
        } else if (value === 'dhaka_sub_area') {
            setShippingCost(dhakaSub);
        }
    };

    const handleApply = async () => {
        try {
            if (couponCode === '') {
                toast.error(`কুপন কোড দিন`, {
                    position: 'bottom-right',
                });
            }

            let couponData = await getCoupon(couponCode);
            if (couponData.success && couponCode) {
                if (!couponApply) {
                    toast.error(`আপনি কুপন ব্যবহার করে ফেলেছেন`, {
                        position: 'bottom-right',
                    });
                }
                const { type, discount } = couponData.data;

                if (type === 'Flat' && couponApply) {
                    setSubtotal(subTotal - discount);
                    setDiscountValue(discount);
                    setCouponApply(false);
                    toast.success(`"কুপন সফল হয়েছে"`, {
                        position: 'bottom-right',
                    });
                }

                if (type === 'Percentage' && couponApply) {
                    const discountAmount = subTotal * (discount / 100);
                    setSubtotal(subTotal - discountAmount);
                    setDiscountValue(discountAmount);
                    setCouponApply(false);
                    toast.success(`"কুপন সফল হয়েছে"`, {
                        position: 'bottom-right',
                    });
                }
            } else {
                if (couponCode) {
                    toast.error(`"কুপন সফল হয়নি"`, {
                        position: 'bottom-right',
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching coupon:', error);
        }
    };

    const orderedProduct = [];
    cartItems.map((product) =>
        orderedProduct.push({
            product_name: product.name,
            product_id: product.id,
            quantity: product.quantity,
            price:
                product.sale_price > 0
                    ? product.sale_price
                    : product.unit_price,
            size: product.size_name,
            color: product.color_name,
            total:
                product.quantity *
                (product.sale_price > 0
                    ? product.sale_price
                    : product.unit_price),
            attributes: product.attributes,
        })
    );

    const totalQuantity = cartItems.reduce((accumulator, currentObject) => {
        return accumulator + currentObject.quantity;
    }, 0);

    const handleRemoveFromCart = (id) => {
        dispatch({
            type: 'REMOVE_FROM_CART',
            payload: id,
        });
        const product = cartItems.find((item) => item.id === id);
        toast.success(`Removed ${product.name} from Cart!`, {
            position: 'bottom-right',
        });
    };

    const handleIncrement = (id) => {
        if (is_combo_product) {
            if (is_multiple_quantity_allow) {
                dispatch({
                    type: 'INCREMENT_QUANTITY',
                    payload: id,
                });
            }
        } else {
            dispatch({
                type: 'INCREMENT_QUANTITY',
                payload: id,
            });
        }
    };
    const handleDecrement = (id) => {
        dispatch({
            type: 'DECREMENT_QUANTITY',
            payload: id,
        });
    };

    // const handleChange = (event) => {
    //     setSelectedValue(event.target.value);

    //     if (event.target.value === 'inside_dhaka') {
    //         setShippingCost(80);
    //     }

    //     if (event.target.value === 'outside_dhaka') {
    //         setShippingCost(120);
    //     }
    // };

    const handlePaymentChange = (event) => {
        setSelectedPayment(event.target.value);
    };

    const submitHandler = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
        const { name, address, phone, spacial_instruction } = data;

        if (name === '' || name === null || name === undefined) {
            setNameWarningMessage('নাম আবশ্যক');
        } else {
            setNameWarningMessage(null);
        }

        if (phone === '' || phone === null || phone === undefined) {
            setPhoneWarningMessage('ফোন নাম্বার আবশ্যক');
        } else {
            if (phone.length === 11) {
                setPhoneWarningMessage(null);
            } else {
                setPhoneWarningMessage('আপনি ভুল নাম্বার দিয়েছেন');
                return;
            }
        }

        if (address === '' || address === null || address === undefined) {
            setAddressWarningMessage('ঠিকানা আবশ্যক');
        } else {
            setAddressWarningMessage(null);
        }

        const orderData = {
            ...data,
            products: orderedProduct,
            delivery_fee: shippingCost,
            total_quantity: totalQuantity,
            total_amount: total,
            delivery_location: selectedValue,
            spacial_instruction: spacial_instruction,
            currency: 'bdt',
            discount_amount: discountValue ? discountValue : 0,
            sub_total: subTotal,
        };

        try {
            setOrderLoading(true);
            const response = await orderPost(JSON.stringify(orderData));
            if (response.ok) {
                setOrderLoading(false);
                const responseData = await response.json();

                if (responseData.success) {
                    setOrderId(responseData.order_number);
                    console.log(responseData);
                    console.log(orderId);
                    router.push('/order-successfull');
                    toast.success(`${responseData.success}`, {
                        position: 'bottom-right',
                    });

                    dispatch({
                        type: 'CLEAR_CART',
                    });
                    // For Google tag manager
                    if (adManager?.tag_manager_id) {
                        window.dataLayer.push({
                            event: 'purchase',
                            ecommerce: {
                                items: orderData,
                            },
                        });
                    }

                    // For Facebook Pixels
                    trackEvent('Purchase', orderData);
                } else {
                    setOrderLoading(false);
                    toast.error(
                        `দুঃখিত! আপনার অর্ডারটি সফল হয়নি। ${responseData.message}`,
                        {
                            position: 'bottom-right',
                        }
                    );
                }
            } else {
                throw new Error('Failed to submit Order');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    // For Google tag manager
    useEffect(() => {
        if (adManager?.tag_manager_id) {
            window.dataLayer.push({
                event: 'begin_checkout',
                ecommerce: {
                    items: cartItems,
                },
            });
        }

        // For Facebook Pixels
        trackEvent('Checkout', cartItems);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div
            id="cart-page"
            className="pt-10 pb-20 lg:pt-28 md:py-20 cart-page"
        >
            <div className="cart-area">
                <div className="container">
                    <form
                        onSubmit={submitHandler}
                        id="cart-form"
                        className="cart-form"
                    >
                        <div className="grid grid-cols-12 gap-[30px]">
                            <div className="col-span-12 lg:col-span-6 xxl:col-span-7">
                                <h2 className="text-base sm:text-xl md:text-2xl lg:text-2xl xxl:text-3xl text-gray-900 font-semibold mb-5 lg:mb-[30px] flex flex-col gap-1 md:leading-[36px] lg:leading-[40px]">
                                    {formTitle}
                                    <span className="w-9 h-[2px] bg-[#086CD9] lg:hidden"></span>
                                </h2>
                                <div className="lg:p-[30px] lg:rounded-[20px] lg:bg-white">
                                    <div className="grid gap-[18px] lg:gap-6">
                                        <Input
                                            label={nameLabel}
                                            type="text"
                                            name="name"
                                            placeholder={namePlaceholder}
                                            message={
                                                nameWarningMessage
                                                    ? nameWarningMessage
                                                    : null
                                            }
                                            required
                                        />
                                        <Input
                                            label={phoneLabel}
                                            type="number"
                                            name="phone"
                                            placeholder={phonePlaceholder}
                                            message={
                                                phoneWarningMessage
                                                    ? phoneWarningMessage
                                                    : null
                                            }
                                            required
                                        />
                                        <Input
                                            label={emailLabel}
                                            type="text"
                                            name="email"
                                            placeholder={emailPlaceholder}
                                            optional={optional}
                                        />
                                        <div className="delivary-area">
                                            <label className="block text-gray-700 text-sm font-semibold mb-[6px]">
                                                {areaLabel}
                                            </label>
                                            <select
                                                className="block w-full px-[14px] py-[16px] lg:px-6 lg:py-4 3xl:px-[18px] 3xl:py-[22px] border border-[#D0D5DD] text-gray-700 ring-1 ring-inset ring-[#D0D5DD] focus:ring-1 focus:ring-blue-900 placeholder:text-gray-400 placeholder:text-base outline-hidden rounded-md input-shadow bg-white cursor-pointer"
                                                value={selectedValue}
                                                onChange={handleSelectChange}
                                            >
                                                <option value="inside_dhaka">
                                                    {insideDhaka} -{' '}
                                                    {insideDhakaDC > 0
                                                        ? `${insideDhakaDC} ${currency}`
                                                        : freeDelevery}
                                                </option>
                                                <option value="outside_dhaka">
                                                    {outsideDhaka} -{' '}
                                                    {outsideDhakaDC > 0
                                                        ? `${outsideDhakaDC} ${currency}`
                                                        : freeDelevery}
                                                </option>
                                                <option value="dhaka_sub_area">
                                                    {dhakaSubArea} -{' '}
                                                    {dhakaSub > 0
                                                        ? `${dhakaSub} ${currency}`
                                                        : freeDelevery}
                                                </option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-sm font-semibold mb-[6px]">
                                                {addressLabel}
                                            </label>
                                            <textarea
                                                type="text"
                                                name="address"
                                                placeholder={addressPlaceholder}
                                                message={
                                                    addressWarningMessage
                                                        ? addressWarningMessage
                                                        : null
                                                }
                                                rows="3"
                                                required
                                                className="block w-full px-6 py-4 3xl:px-[18px] 3xl:py-[22px] border border-[#D0D5DD] text-gray-700 ring-1 ring-inset ring-[#D0D5DD] focus:ring-1 focus:ring-blue-900 placeholder:text-gray-400 placeholder:text-base outline-hidden rounded-md input-shadow"
                                            />
                                            <small
                                                className={`mt-1 text-red-500 ${
                                                    addressWarningMessage ===
                                                        '' ||
                                                    addressWarningMessage ===
                                                        null ||
                                                    addressWarningMessage
                                                        ? ''
                                                        : 'hidden'
                                                }`}
                                            >
                                                {addressWarningMessage}
                                            </small>
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-sm font-semibold mb-[6px]">
                                                {noteLabel}
                                                <span className="text-gray-600">
                                                    ({optional})
                                                </span>
                                            </label>
                                            <textarea
                                                type="text"
                                                name="spacial_instruction"
                                                placeholder={notePlaceholder}
                                                rows="3"
                                                className="block w-full px-6 py-4 3xl:px-[18px] 3xl:py-[22px] border border-[#D0D5DD] text-gray-700 ring-1 ring-inset ring-[#D0D5DD] focus:ring-1 focus:ring-blue-900 placeholder:text-gray-400 placeholder:text-base outline-hidden rounded-md input-shadow"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-12 lg:col-span-6 xxl:col-span-5">
                                <div className="mb-10 cart-payment-amount">
                                    <h2 className="text-base sm:text-xl md:text-2xl lg:text-2xl xxl:text-3xl text-gray-900 font-semibold mb-5 lg:mb-[30px] flex flex-col gap-1 md:leading-[36px] lg:leading-[40px]">
                                        {orderTitle}
                                        <span className="w-9 h-[2px] bg-[#086CD9] lg:hidden"></span>
                                    </h2>
                                    <div className="p-[30px] rounded-[20px] bg-white">
                                        {save > 0 && (
                                            <h3 className="mb-6 text-base font-normal text-green-800">
                                                Congratulations! you are saved{' '}
                                                <span className="font-semibold text-[#F93754]">
                                                    {save}
                                                </span>{' '}
                                                {siteSettings.currency}.
                                            </h3>
                                        )}
                                        {cartItems.length > 0 ? (
                                            <div>
                                                <ul className="grid gap-3">
                                                    {cartItems.map(
                                                        (
                                                            product,
                                                            index,
                                                            cartArray
                                                        ) => (
                                                            <li
                                                                key={product.id}
                                                            >
                                                                <div
                                                                    className={`flex items-start gap-[14px] ${
                                                                        index ===
                                                                        cartArray.length -
                                                                            1
                                                                            ? 'border-b-0'
                                                                            : 'pb-3 border-b border-gray-400'
                                                                    }`}
                                                                >
                                                                    <div>
                                                                        <div className="w-[90px] h-[104px] sm:w-[95px] sm:h-[112px] md:w-[110px] md:h-[118px] lg:w-[84px] lg:h-[90px] xl:w-[110px] xl:h-[120px] rounded-[10px] overflow-hidden">
                                                                            <Image
                                                                                className="object-cover w-full h-full"
                                                                                src={
                                                                                    product.preview_image
                                                                                }
                                                                                alt={
                                                                                    product.name
                                                                                }
                                                                                width={
                                                                                    84
                                                                                }
                                                                                height={
                                                                                    84
                                                                                }
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex-auto">
                                                                        <div className="flex justify-between gap-2 mb-[10px]">
                                                                            <h2 className="text-sm sm:text-base lg:text-lg text-gray-900 font-semibold ellipsis-2 h-10 sm:h-12 md:h-[54px]">
                                                                                {
                                                                                    product.name
                                                                                }
                                                                            </h2>
                                                                            <div>
                                                                                <button
                                                                                    onClick={() =>
                                                                                        handleRemoveFromCart(
                                                                                            product.id
                                                                                        )
                                                                                    }
                                                                                    type="button"
                                                                                    className="pt-[2px] text-xl text-gray-400"
                                                                                >
                                                                                    <RxCross2 />
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex items-center gap-6 mb-2">
                                                                            {is_multiple_quantity_allow && (
                                                                                <div className="flex justify-between items-center w-[90px] h-[30px] border bg-[#EAEAEA] rounded-md px-[3px]">
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() =>
                                                                                            handleDecrement(
                                                                                                product.id
                                                                                            )
                                                                                        }
                                                                                        className="flex items-center justify-center w-6 h-6 text-xs text-gray-600 bg-white rounded-md quantity-decrement"
                                                                                    >
                                                                                        <FaMinus />
                                                                                    </button>
                                                                                    <div className="text-xs text-gray-600 quantity">
                                                                                        {
                                                                                            product.quantity
                                                                                        }
                                                                                    </div>
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() =>
                                                                                            handleIncrement(
                                                                                                product.id
                                                                                            )
                                                                                        }
                                                                                        className="flex items-center justify-center w-6 h-6 text-xs text-gray-600 bg-white rounded-md quantity-increment"
                                                                                    >
                                                                                        <FaPlus />
                                                                                    </button>
                                                                                </div>
                                                                            )}
                                                                            <p className="text-sm lg:text-lg text-[#F93754] font-semibold">
                                                                                {
                                                                                    siteSettings.currency_icon || '৳'
                                                                                }
                                                                                {product.sale_price >
                                                                                0
                                                                                    ? ' ' +
                                                                                      product.sale_price
                                                                                    : ' ' +
                                                                                      product.unit_price}
                                                                            </p>
                                                                        </div>
                                                                        <div className="flex items-center justify-between">
                                                                            <div className="flex items-center gap-2">
                                                                                {Object.entries(
                                                                                    product.attributes
                                                                                ).map(
                                                                                    ([
                                                                                        key,
                                                                                        value,
                                                                                    ]) =>
                                                                                        key.toLocaleLowerCase() ===
                                                                                        'color' ? (
                                                                                            <div
                                                                                                key={
                                                                                                    key
                                                                                                }
                                                                                                className=""
                                                                                            >
                                                                                                <div
                                                                                                    className="w-4 h-4 rounded-full shadow-lg border border-gray-600 p-[2px]"
                                                                                                    style={{
                                                                                                        backgroundColor: `#${value}`,
                                                                                                    }}
                                                                                                ></div>
                                                                                            </div>
                                                                                        ) : (
                                                                                            <p
                                                                                                key={
                                                                                                    key
                                                                                                }
                                                                                                className="text-[9px] bg-gray-900 text-white py-[2px] rounded-lg leading-[12px] px-2"
                                                                                            >
                                                                                                {
                                                                                                    value
                                                                                                }
                                                                                            </p>
                                                                                        )
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                                <hr className="mt-3 border-gray-400 lg:mt-5 lg:mb-2" />
                                                <ul className="">
                                                    <li className="flex items-center justify-between py-3 border-b border-gray-400 lg:py-5">
                                                        <p className="text-sm font-semibold text-gray-700 lg:text-lg">
                                                            {dicSubTotal} :
                                                        </p>
                                                        <p className="text-sm font-semibold text-gray-700 lg:text-lg">
                                                            {cartTotal}{' '}
                                                            {currency}
                                                        </p>
                                                    </li>
                                                    <li className="flex items-center justify-between py-3 border-b border-gray-400 lg:py-5">
                                                        <p className="text-sm font-semibold text-gray-700 lg:text-lg">
                                                            {dicDeliveryFee} :
                                                        </p>
                                                        <p className="text-sm font-semibold text-gray-700 lg:text-lg">
                                                            {shippingCost}{' '}
                                                            {currency}
                                                        </p>
                                                    </li>
                                                    {is_coupon_field_visible && (
                                                        <li className="py-3 border-b border-gray-400 lg:py-5">
                                                            <div className="relative flex items-center justify-between">
                                                                <input
                                                                    type="text"
                                                                    placeholder={
                                                                        dicCouponProvide
                                                                    }
                                                                    value={
                                                                        couponCode
                                                                    }
                                                                    onChange={
                                                                        handleCodeChange
                                                                    }
                                                                    className="w-full px-0 text-sm font-normal text-gray-700 border-0 focus:outline-hidden focus:ring-0 active:outline-hidden lg:text-lg"
                                                                />
                                                                <button
                                                                    onClick={
                                                                        handleApply
                                                                    }
                                                                    type="button"
                                                                    className="absolute right-0 text-sm font-medium text-purple-900 border-b border-purple-900 lg:text-base"
                                                                >
                                                                    Apply
                                                                </button>
                                                            </div>
                                                        </li>
                                                    )}
                                                    {save > 0 && (
                                                        <li className="flex items-center justify-between py-3 border-b border-gray-400 lg:py-5">
                                                            <p className="text-sm font-semibold text-gray-700 lg:text-lg">
                                                                Discount :
                                                            </p>
                                                            <p className="text-sm font-semibold text-[#F93754] lg:text-lg">
                                                                - {save}{' '}
                                                                {currency}
                                                            </p>
                                                        </li>
                                                    )}
                                                    <li className="flex items-center justify-between pt-3 lg:pt-5">
                                                        <p className="text-sm font-semibold text-gray-700 lg:text-lg">
                                                            {dicTotal} :
                                                        </p>
                                                        <p className="text-sm font-semibold text-gray-700 lg:text-lg">
                                                            {total} {currency}
                                                        </p>
                                                    </li>
                                                </ul>
                                            </div>
                                        ) : (
                                            <p className="text-base font-semibold text-gray-800">
                                                {cartEmpty}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="cart-payment-option">
                                    <h2 className="text-base sm:text-xl md:text-2xl lg:text-2xl xxl:text-3xl text-gray-900 font-semibold mb-5 lg:mb-[30px] flex flex-col gap-1 md:leading-[36px] lg:leading-[40px] capitalize">
                                        {paymentTitle}
                                        <span className="w-9 h-[2px] bg-[#086CD9] lg:hidden"></span>
                                    </h2>
                                    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 2xl:grid-cols-3">
                                        {paymentMethod.map((method) => {
                                            let imgClass;
                                            switch (method.name) {
                                                case 'cash':
                                                    imgClass = 'w-[160px]';
                                                    break;
                                                case 'bkash':
                                                    imgClass = 'w-[74px]';
                                                    break;
                                                case 'nagad':
                                                    imgClass = 'w-[78px]';
                                                    break;
                                                default:
                                                    imgClass = 'w-[100px]'; // default width if needed
                                            }

                                            return (
                                                <PaymentRadio
                                                    key={method.id}
                                                    value={method.name}
                                                    icon={
                                                        method.name === 'cash'
                                                            ? cod
                                                            : method.name ===
                                                              'bkash'
                                                            ? bkash
                                                            : nagad
                                                    }
                                                    name="payment_method"
                                                    imgClass={imgClass}
                                                    checked={
                                                        selectedPayment ===
                                                        method.name
                                                    }
                                                    onChange={
                                                        handlePaymentChange
                                                    }
                                                />
                                            );
                                        })}
                                    </div>
                                    {selectedPayment === 'cash' && (
                                        <p className="pt-[30px] text-base text-gray-700 font-normal">
                                            {cashDetails}
                                        </p>
                                    )}
                                    {(selectedPayment === 'bkash' ||
                                        selectedPayment === 'nagad') && (
                                        <div>
                                            {selectedPayment === 'bkash' ? (
                                                <p className="pt-[30px] text-base text-gray-700 font-normal">
                                                    {bkashDetails}
                                                </p>
                                            ) : (
                                                <p className="pt-[30px] text-base text-gray-700 font-normal">
                                                    {nagadDetails}
                                                </p>
                                            )}
                                            <div className="grid sm:grid-cols-2 gap-[18px] lg:gap-6 pt-6">
                                                <div className="">
                                                    <label
                                                        htmlFor="phoneNumber"
                                                        className="block text-gray-700 text-sm font-semibold mb-[6px]"
                                                    >
                                                        {selectedPayment ===
                                                        'bkash'
                                                            ? provideBkashNumber
                                                            : provideNagadNumber}
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        name="phone_number"
                                                        placeholder="017XXXXXXXX"
                                                        className="block w-full px-[14px] py-[16px] lg:px-6 lg:py-4 3xl:px-[18px] 3xl:py-[22px] border border-[#D0D5DD] text-gray-700 ring-1 ring-inset ring-[#D0D5DD] focus:ring-1 focus:ring-blue-900 placeholder:text-gray-400 placeholder:text-base outline-hidden rounded-md input-shadow bg-white"
                                                    />
                                                </div>
                                                <div>
                                                    <label
                                                        htmlFor="transactionId"
                                                        className="block text-gray-700 text-sm font-semibold mb-[6px]"
                                                    >
                                                        {selectedPayment ===
                                                        'bkash'
                                                            ? bkashTransactionID
                                                            : nagadTransactionID}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="transaction_id"
                                                        placeholder="7XP59GS33F"
                                                        className="block w-full px-[14px] py-[16px] lg:px-6 lg:py-4 3xl:px-[18px] 3xl:py-[22px] border border-[#D0D5DD] text-gray-700 ring-1 ring-inset ring-[#D0D5DD] focus:ring-1 focus:ring-blue-900 placeholder:text-gray-400 placeholder:text-base outline-hidden rounded-md input-shadow bg-white"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div className=" mt-[30px]">
                                        <KarbarButton
                                            preserveHover="true"
                                            type="submit"
                                            className={`gap-2 px-[30px] py-4 rounded-md w-full capitalize text-lg ${
                                                orderLoading
                                                    ? 'bg-gray-500'
                                                    : 'bg-gray-900 '
                                            }`}
                                            disabled={orderLoading}
                                        >
                                            {orderLoading
                                                ? dicConfirmProcessing
                                                : dicConfirm}
                                            {orderLoading && (
                                                <div className="spin-loader"></div>
                                            )}
                                        </KarbarButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LandingCheckoutPage;
