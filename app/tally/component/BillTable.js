'use client';


import Input from '@/components/form/Input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

import useAdManager from '@/hooks/useAdManager';
import useAuth from '@/hooks/useAuth';
import useDictionary from '@/hooks/useDictionary';
import { getSiteSettings } from '@/utils/getSiteSettings';
import { getPosUser } from '@/utils/pos/getPosUser';
import { useEffect, useState } from 'react';
import { BiSolidEdit } from 'react-icons/bi';
import { IoCartOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { trackEvent } from '../../utils/facebookPixel';
import { getCoupon } from '../../utils/getCoupon';
import { salePost } from '../../utils/pos/salePost';
import CouponModal from './modal/CouponModal';
import NoteModal from './modal/NoteModal';
import RecentSaleModal from './modal/RecentSaleModal';
import ShippingModal from './modal/ShippingModal';

const BillTable = ({
    customervalue,
    setCustomerValue,
    warehousevalue,
    setWarehouseValue,
    selectedProducts,
    setRows,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isVatOpen, setIsVatOpen] = useState(false);
    const [isDiscountOpen, setIsDiscountOpen] = useState(false);
    const [vatPercent, setVatPercent] = useState(0);
    const [storeVatPercent, setStoreVatPercent] = useState(0);
    const [totalVat, setTotalVat] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [couponAmount, setCouponAmount] = useState(0);
    const [shippingAmount, setShippingAmount] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);
    const [couponValue, setCouponValue] = useState(0);
    const [bkashNumber, setBkashNumber] = useState(null);
    const [cardNumber, setCardNumber] = useState(null);
    const [shipping, setShipping] = useState('');
    const [note, setNote] = useState('');
    const [cash, setCash] = useState(0);
    const [bkash, setBkash] = useState(0);
    const [card, setCard] = useState(0);
    const [due, setDue] = useState(0);
    const [partial, setPartial] = useState(0);

    const { authToken } = useAuth();
    // Separate isOpen states for each field
    const [isCouponOpen, setIsCouponOpen] = useState(false);
    const [isShippingOpen, setIsShippingOpen] = useState(false);
    const [isNoteOpen, setIsNoteOpen] = useState(false);
    const [isCashOpen, setIsCashOpen] = useState(false);
    const [isBkashOpen, setIsBkashOpen] = useState(false);
    const [isCardOpen, setIsCardOpen] = useState(false);
    const [isDueOpen, setIsDueOpen] = useState(false);
    const [isPartialOpen, setIsPartialOpen] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState('cash');
    const [discountType, setDiscountType] = useState('flat');
    const [subTotal, setSubtotal] = useState(0);
    const [couponCode, setCouponCode] = useState('');
    const [discountValue, setDiscountValue] = useState(0);
    const [couponApply, setCouponApply] = useState(true);
    const [invoice, setInvoice] = useState('');
    const [user, setUser] = useState({});
    const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
    const { language } = useDictionary();
    const { adManager } = useAdManager();

    const [cartTotal, setCartTotal] = useState(0);
    // const { state, dispatch } = usePos();
    // const { selectedProducts, cartTotal } = state;

    useEffect(() => {
        const fetchSiteSettings = async () => {
            const settings = await getSiteSettings(language);
            setStoreVatPercent(settings.data.vat);
            setVatPercent(settings.data.vat);
        };

        fetchSiteSettings();
    }, [language]);

    const couponChange = (event) => {
        setCouponCode(event.target.value);
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getPosUser(authToken);
                setUser(userData.data);
            } catch (error) {
                console.error('Failed to fetch pos user:', error);
            }
        };

        fetchUser();
    }, [authToken]);

    useEffect(() => {
        const cartTotalCal = selectedProducts.reduce(
            (acc, product) => acc + product.totalPrice,
            0
        );

        console.log(selectedProducts);
        console.log(cartTotalCal);

        setCartTotal(cartTotalCal);
    }, [selectedProducts]);

    // setSubtotal(cartTotal);
    useEffect(() => {
        setSubtotal(cartTotal - discountValue);
    }, [cartTotal, discountValue]);

    const handleApply = async (event) => {
        event.preventDefault();
        try {
            const data = new FormData(event.target);
            const coupon = data.get('coupon');
            // setShipping(value);
            setIsCouponOpen(false);

            if (coupon === '') {
                toast.error(`কুপন কোড দিন`, {
                    position: 'bottom-right',
                });
            }

            let couponData = await getCoupon(coupon);
            if (couponData.success && coupon) {
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

    const paymentMethods = [
        {
            id: 1,
            name: 'cash',
        },
        {
            id: 2,
            name: 'bkash',
        },
        {
            id: 3,
            name: 'card',
        },
        {
            id: 4,
            name: 'due',
        },
        {
            id: 5,
            name: 'partial',
        },
    ];

    // Handle payment method selection
    const handleMethod = (method) => {
        setSelectedMethod(method);
    };

    // calculate total items product
    const totalItems = selectedProducts.length;

    // vat
    const submitVatHandler = async (event) => {
        event.preventDefault();

        const data = new FormData(event.target);
        const vat = data.get('vat');
        if (!vat) {
            console.warn('VAT field not found in form data.');
            return;
        }
        const vatPercent = parseFloat(vat); // Convert string to number
        setVatPercent(vatPercent);
        setIsVatOpen(false);
    };

    // total vat calculatation
    useEffect(() => {
        const newTotalVat = (cartTotal * vatPercent) / 100;
        setTotalVat(Math.round(newTotalVat));
    }, [vatPercent, cartTotal]);

    const handleDiscountType = (event) => {
        setDiscountType(event.target.value);
    };

    // Discount
    const submitDiscountHandler = async (event) => {
        event.preventDefault();

        const data = new FormData(event.target);
        const discountValue = parseFloat(data.get('discount_value')); // Parse the discount value
        const discountType = data.get('discount_type'); // Get the discount type

        if (isNaN(discountValue) || discountValue <= 0) {
            // Add validation to ensure a valid discount value is entered
            console.error('Please enter a valid discount amount');
            return;
        }

        if (discountType === 'flat') {
            setDiscount(Math.floor(discountValue)); // Set the flat discount directly
        } else if (discountType === 'percentage') {
            setDiscount(Math.floor((cartTotal * discountValue) / 100)); // Apply percentage-based discount
        }

        setIsDiscountOpen(false); // Close the discount form
    };

    // Common form handler
    const submitFormHandler = (
        event,
        fieldName,
        setStateCallback,
        setIsOpenCallback
    ) => {
        event.preventDefault();
        const data = new FormData(event.target);
        const value = data.get(fieldName);

        const floatValue = parseFloat(value);
        setStateCallback(Math.round(floatValue));
        setIsOpenCallback(false); // Close the form after submission
    };

    // Handlers for each form with separate isOpen state control
    // const submitCouponHandler = (event) => {
    //     submitFormHandler(event, 'coupon', setCoupon, setIsCouponOpen);

    // };

    const submitShippingHandler = (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        const value = data.get('shipping');
        setShipping(value);
        setIsShippingOpen(false);
        // submitFormHandler(event, 'shipping', setShipping, setIsShippingOpen);
    };

    const submitNoteHandler = (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        const value = data.get('note');
        setNote(value);
        setIsNoteOpen(false);
        // submitFormHandler(event, 'note', setNote, setIsNoteOpen);
    };

    // grand total calculation
    useEffect(() => {
        const grandTotal = subTotal + totalVat - (discount + couponValue);

        setGrandTotal(grandTotal);
        setFormData({ ...formData, received_amount: grandTotal });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subTotal, totalVat, discount, couponValue]);

    const orderedProduct = [];
    selectedProducts.map((product) =>
        orderedProduct.push({
            product_name: product.productName,
            product_id: product.productId,
            quantity: product.quantity,
            price: product.unitPrice,
            total: product.totalPrice,
            attributes: {
                color: null,
                size: null,
            },
        })
    );

    // Single state object to store form data
    const [formData, setFormData] = useState({
        received_amount: '',
        payment_amount: '',
        change_amount: '',
    });

    const handleAmount = (e) => {
        const { name, value } = e.target;

        setFormData((prevFormData) => {
            const updatedData = { ...prevFormData, [name]: value };

            // Calculate change_amount when payment_amount is updated
            if (name === 'payment_amount' && prevFormData.received_amount) {
                const receivedAmount = parseFloat(prevFormData.received_amount);
                const paymentAmount = parseFloat(value);

                // Ensure both values are numbers and valid for calculation
                if (!isNaN(receivedAmount) && !isNaN(paymentAmount)) {
                    updatedData.change_amount = paymentAmount - receivedAmount;
                } else {
                    updatedData.change_amount = ''; // Reset if invalid
                }
            }

            return updatedData;
        });
    };

    // Destructuring values for convenience
    const { received_amount, payment_amount, change_amount } = formData;

    const submitSaleHandler = async (e) => {
        e.preventDefault();

        const orderData = {
            products: orderedProduct,
            customer_id: customervalue,
            warehouse_id: warehousevalue,
            sub_total: subTotal,
            vat_amount: totalVat,
            vat: vatPercent,
            discount_amount: discount,
            total_quantity: totalItems,
            total_amount: grandTotal,
            payment_method: selectedMethod,
            shipping_address: shipping,
            note: note,
            billed_by: user.id,
            order_type: 'tally',
        };

        if (selectedMethod === 'bkash') {
            orderData.bkash_number = bkashNumber;
        }

        if (selectedMethod === 'card') {
            orderData.card_number = cardNumber;
        }

        if (selectedMethod === 'partial') {
            orderData.paid_amount = formData.payment_amount;
            orderData.due_amount = Math.abs(formData.change_amount);
        } else if (selectedMethod === 'due') {
            orderData.due_amount = grandTotal;
        }

        try {
            // setOrderLoading(true);
            const response = await salePost(
                authToken,
                JSON.stringify(orderData)
            );
            if (response.ok) {
                // setOrderLoading(false);
                const responseData = await response.json();

                if (responseData.success) {
                    setIsCardOpen(false);
                    setSelectedMethod('cash');
                    setInvoice(responseData.invoice);
                    setInvoiceModalOpen(true);
                    setDiscount(0);
                    setVatPercent(storeVatPercent);
                    setDiscountValue(0);
                    setShipping('');
                    setNote('');
                    // router.push('/order-successfull');
                    toast.success(`${responseData.success}`, {
                        position: 'bottom-right',
                    });

                    setFormData({
                        received_amount: '',
                        payment_amount: '',
                        change_amount: '',
                    });

                    const newRows = [
                        {
                            id: 1,
                            productName: '',
                            quantity: 1,
                            unitPrice: '',
                            price: 0,
                            productId: null,
                        },
                    ];

                    setRows(newRows);

                    // dispatch({
                    //     type: 'CLEAR_CART',
                    // });
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
                    // setOrderLoading(false);
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

    return (
        <>
            <div className="flex flex-col justify-between border border-gray-400 rounded-[20px] p-6">
                {selectedProducts.length > 0 ? (
                    <div>
                        <div className="flex justify-end pr-3">
                            <div className="min-w-full bg-white">
                                <div className="border-b border-gray-400 py-[14px]">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-medium text-gray-700">
                                            Subtotal
                                        </p>
                                        <p className="text-xs font-medium text-gray-700">
                                            {subTotal} TK
                                        </p>
                                    </div>
                                </div>

                                <div className="border-b border-gray-400 py-[14px]">
                                    <div className="flex items-center justify-between">
                                        <p className="flex items-center gap-1 text-xs font-medium text-gray-700">
                                            Discount
                                            <Dialog
                                                open={isDiscountOpen}
                                                onOpenChange={setIsDiscountOpen}
                                            >
                                                <DialogTrigger asChild>
                                                    <button className="font-medium">
                                                        <BiSolidEdit />
                                                    </button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[425px] bg-[#F6F4FD] border-[rgba(136, 49, 225, 0.20)]">
                                                    <DialogHeader className="sr-only">
                                                        <DialogTitle>
                                                            Discount
                                                        </DialogTitle>
                                                        <DialogDescription>
                                                            Discount Description
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="grid gap-4 py-4">
                                                        <form
                                                            onSubmit={
                                                                submitDiscountHandler
                                                            }
                                                            id="cart-form"
                                                            className="cart-form"
                                                        >
                                                            <div className="grid gap-4">
                                                                <select
                                                                    name="discount_type"
                                                                    onChange={
                                                                        handleDiscountType
                                                                    }
                                                                    className="block w-full px-[14px] py-[16px] lg:px-6 lg:py-4 3xl:px-[18px] 3xl:py-[22px] border border-[#D0D5DD] text-gray-700 ring-1 ring-inset ring-[#D0D5DD] focus:ring-1 focus:ring-blue-900 placeholder:text-gray-400 placeholder:text-base outline-hidden rounded-md input-shadow bg-white"
                                                                >
                                                                    <option
                                                                        selected
                                                                        value="flat"
                                                                    >
                                                                        Flat
                                                                    </option>
                                                                    <option value="percentage">
                                                                        Percentage
                                                                    </option>
                                                                </select>
                                                                <Input
                                                                    label="Discount"
                                                                    type="text"
                                                                    name="discount_value"
                                                                    placeholder="Enter Discount amount"
                                                                    optional="percentage"
                                                                    required
                                                                />
                                                            </div>
                                                        </form>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </p>
                                        <p className="text-xs font-medium text-gray-700">
                                            {discount} TK
                                        </p>
                                    </div>
                                </div>
                                <div className="border-b border-gray-400 py-[14px]">
                                    <div className="flex items-center justify-between">
                                        <p className="flex items-center gap-1 text-xs font-medium text-gray-700">
                                            Vat{' '}
                                            <span className="text-gray-600">
                                                ({vatPercent}%)
                                            </span>
                                            <Dialog
                                                open={isVatOpen}
                                                onOpenChange={setIsVatOpen}
                                            >
                                                <DialogTrigger asChild>
                                                    <button className="font-medium">
                                                        <BiSolidEdit />
                                                    </button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[425px] bg-[#F6F4FD] border-[rgba(136, 49, 225, 0.20)]">
                                                    <DialogHeader className="sr-only">
                                                        <DialogTitle>
                                                            Vat
                                                        </DialogTitle>
                                                        <DialogDescription>
                                                            Vat Description
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="grid gap-4 py-4">
                                                        <form
                                                            onSubmit={
                                                                submitVatHandler
                                                            }
                                                            id="cart-form"
                                                            className="cart-form"
                                                        >
                                                            <div className="grid gap-4">
                                                                <Input
                                                                    label="Vat"
                                                                    type="text"
                                                                    name="vat"
                                                                    value={
                                                                        vatPercent
                                                                    }
                                                                    placeholder="Enter Vat amount in percentage"
                                                                    optional="percentage"
                                                                    required
                                                                />
                                                            </div>
                                                        </form>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </p>
                                        <p className="text-xs font-medium text-gray-700">
                                            {totalVat} TK
                                        </p>
                                    </div>
                                </div>
                                <div className="py-[14px]">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-semibold text-gray-700">
                                            Total
                                        </p>
                                        <p className="text-xs font-semibold text-gray-700">
                                            {grandTotal} TK
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid items-center justify-center w-full min-h-[400px]">
                        <p className="text-2xl font-semibold text-gray-700">
                            No product in cart
                        </p>
                    </div>
                )}
                <div className="border-t border-[#DFDFDF] pt-5">
                    <div className="flex items-center xl:gap-[50px] gap-5 flex-wrap mb-5">
                        <div className="text-xs text-gray-700 font-medium flex items-center gap-[10px]">
                            <p>Items:</p>
                            <p>
                                {selectedProducts.length}{' '}
                                <span>({totalItems})</span>
                            </p>
                        </div>
                        <CouponModal
                            submitHandler={handleApply}
                            discountValue={discountValue}
                            couponChange={couponChange}
                            isOpen={isCouponOpen}
                            setIsOpen={setIsCouponOpen}
                        />
                        <ShippingModal
                            submitHandler={submitShippingHandler}
                            isOpen={isShippingOpen}
                            setIsOpen={setIsShippingOpen}
                        />
                        <NoteModal
                            submitHandler={submitNoteHandler}
                            isOpen={isNoteOpen}
                            setIsOpen={setIsNoteOpen}
                        />
                    </div>
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-[10px] mb-[30px]">
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-gray-700">
                                Pay Via:
                            </p>
                        </div>
                        <ul className="flex items-center gap-[10px] flex-wrap">
                            {paymentMethods.map((paymentMethod) => (
                                <li key={paymentMethod.id}>
                                    <button
                                        onClick={() =>
                                            handleMethod(paymentMethod.name)
                                        }
                                        type="button"
                                        className={`flex items-center gap-1 px-4 py-2 text-xs font-medium text-purple-900 transition-all duration-150 border border-purple-900 rounded hover:bg-purple-900 hover:text-white capitalize ${
                                            selectedMethod == paymentMethod.name
                                                ? 'text-white bg-purple-900'
                                                : ''
                                        }`}
                                    >
                                        {paymentMethod.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-[10px]">
                        {selectedMethod === 'due' ? (
                            <button
                                onClick={submitSaleHandler}
                                className="w-full text-sm h-12 md:h-[56px] md:text-base bg-[#4C20CD] text-white flex justify-center items-center gap-1 rounded-md"
                            >
                                <IoCartOutline />
                                Sale
                            </button>
                        ) : (
                            <Dialog
                                open={isCardOpen}
                                onOpenChange={setIsCardOpen}
                            >
                                <DialogTrigger asChild>
                                    <button className="w-full text-sm h-12 md:h-[56px] bg-[#4C20CD] text-white flex justify-center items-center gap-1 rounded-md">
                                        <IoCartOutline />
                                        Sale
                                    </button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px] bg-[#F6F4FD] border-[rgba(136, 49, 225, 0.20)]">
                                    <DialogHeader className="sr-only">
                                        <DialogTitle>Partial</DialogTitle>
                                        <DialogDescription>
                                            Partial Description
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <form
                                            onSubmit={submitSaleHandler}
                                            id="cart-form"
                                            className="cart-form"
                                        >
                                            <div className="grid gap-4">
                                                {/* Received Amount Input */}
                                                <div className="single-input">
                                                    <label className="block text-gray-700 text-sm font-semibold mb-[6px] capitalize">
                                                        Payable Amount
                                                    </label>
                                                    <input
                                                        type="number"
                                                        name="received_amount"
                                                        value={received_amount}
                                                        placeholder="Enter received amount"
                                                        onChange={handleAmount}
                                                        readOnly
                                                        className="block w-full px-[14px] py-[16px] lg:px-6 lg:py-4 3xl:px-[18px] 3xl:py-[22px] border border-[#D0D5DD] text-gray-700 ring-1 ring-inset ring-[#D0D5DD] focus:ring-1 focus:ring-blue-900 placeholder:text-gray-400 placeholder:text-base outline-hidden rounded-md input-shadow bg-white"
                                                    />
                                                </div>

                                                {/* Payment Amount Input */}
                                                <div className="single-input">
                                                    <label className="block text-gray-700 text-sm font-semibold mb-[6px] capitalize">
                                                        Recieved Amount
                                                    </label>
                                                    <input
                                                        type="number"
                                                        name="payment_amount"
                                                        value={payment_amount}
                                                        placeholder="Enter payment amount"
                                                        onChange={handleAmount}
                                                        required
                                                        className="block w-full px-[14px] py-[16px] lg:px-6 lg:py-4 3xl:px-[18px] 3xl:py-[22px] border border-[#D0D5DD] text-gray-700 ring-1 ring-inset ring-[#D0D5DD] focus:ring-1 focus:ring-blue-900 placeholder:text-gray-400 placeholder:text-base outline-hidden rounded-md input-shadow bg-white"
                                                    />
                                                </div>

                                                {/* Change Amount Input */}
                                                <div className="single-input">
                                                    <label className="block text-gray-700 text-sm font-semibold mb-[6px] capitalize">
                                                        {selectedMethod ===
                                                        'partial'
                                                            ? 'Due Amount'
                                                            : 'Change Amount'}
                                                    </label>
                                                    <input
                                                        type="number"
                                                        name="change_amount"
                                                        value={
                                                            selectedMethod ===
                                                            'partial'
                                                                ? Math.abs(
                                                                      change_amount
                                                                  )
                                                                : change_amount
                                                        }
                                                        placeholder="Enter change amount"
                                                        onChange={handleAmount}
                                                        readOnly
                                                        className="block w-full px-[14px] py-[16px] lg:px-6 lg:py-4 3xl:px-[18px] 3xl:py-[22px] border border-[#D0D5DD] text-gray-700 ring-1 ring-inset ring-[#D0D5DD] focus:ring-1 focus:ring-blue-900 placeholder:text-gray-400 placeholder:text-base outline-hidden rounded-md input-shadow bg-white"
                                                    />
                                                </div>
                                                {/* Bkash Number Input */}
                                                {selectedMethod === 'bkash' && (
                                                    <div className="single-input">
                                                        <label className="block text-gray-700 text-sm font-semibold mb-[6px] capitalize">
                                                            Bkash Mobile Number
                                                        </label>
                                                        <input
                                                            type="number"
                                                            name="change_amount"
                                                            value={bkashNumber}
                                                            placeholder="Enter bKash number"
                                                            onChange={(e) =>
                                                                setBkashNumber(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className="block w-full px-[14px] py-[16px] lg:px-6 lg:py-4 3xl:px-[18px] 3xl:py-[22px] border border-[#D0D5DD] text-gray-700 ring-1 ring-inset ring-[#D0D5DD] focus:ring-1 focus:ring-blue-900 placeholder:text-gray-400 placeholder:text-base outline-hidden rounded-md input-shadow bg-white"
                                                        />
                                                    </div>
                                                )}

                                                {/* Change Amount Input */}
                                                {selectedMethod === 'card' && (
                                                    <div className="single-input">
                                                        <label className="block text-gray-700 text-sm font-semibold mb-[6px] capitalize">
                                                            Card Number
                                                        </label>
                                                        <input
                                                            type="number"
                                                            name="change_amount"
                                                            value={cardNumber}
                                                            placeholder="Enter card number"
                                                            onChange={(e) =>
                                                                setCardNumber(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className="block w-full px-[14px] py-[16px] lg:px-6 lg:py-4 3xl:px-[18px] 3xl:py-[22px] border border-[#D0D5DD] text-gray-700 ring-1 ring-inset ring-[#D0D5DD] focus:ring-1 focus:ring-blue-900 placeholder:text-gray-400 placeholder:text-base outline-hidden rounded-md input-shadow bg-white"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex justify-start pt-5">
                                                <button
                                                    type="submit"
                                                    className="text-xs bg-purple-900 text-white hover:bg-transparent hover:text-purple-900 font-medium py-[14px] px-[30px] border border-purple-900 transition-all duration-150 rounded"
                                                >
                                                    Sale
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        )}
                        <RecentSaleModal />
                        <div className="">
                            <button className="w-full text-sm h-12 md:h-[56px] bg-[#627CFF] text-white flex justify-center items-center gap-1 rounded-md">
                                Save Draft
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="">
                <Dialog
                    open={invoiceModalOpen}
                    onOpenChange={setInvoiceModalOpen}
                >
                    <DialogContent className="sm:max-w-[425px] bg-[#F6F4FD] border-[rgba(136, 49, 225, 0.20)]">
                        <DialogHeader className="sr-only">
                            <DialogTitle>Coupon</DialogTitle>
                            <DialogDescription>
                                Coupon Description
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
        </>
    );
};

export default BillTable;
