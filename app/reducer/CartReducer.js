/* eslint-disable no-case-declarations */
const initialState = {
    cartItems: [],
    cartTotal: 0,
    quantity: 1,
};

const saveToLocalStorage = (cartItems) => {
    const data = {
        items: JSON.parse(cartItems),
        timestamp: new Date().getTime(),
    };
    localStorage.setItem('cartItems', JSON.stringify(data));
};

// Action types
const ADD_TO_CART = 'ADD_TO_CART';
const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
const INCREMENT_QUANTITY = 'INCREMENT_QUANTITY';
const DECREMENT_QUANTITY = 'DECREMENT_QUANTITY';
const CLEAR_CART = 'CLEAR_CART';
const SET_CART = 'SET_CART';

const calculateCartTotal = (cartItems) => {
    return cartItems.reduce(
        (total, item) =>
            total +
            (item.sale_price > 0 ? item.sale_price : item.unit_price) *
                item.quantity,
        0
    );
};

const cartReducer = (state, action) => {
    switch (action.type) {
        case ADD_TO_CART:
            const itemInCart = state.cartItems.find(
                (item) => item.id === action.payload.id
            );
            let updatedCartItems;
            if (itemInCart) {
                updatedCartItems = state.cartItems.map((item) =>
                    item.id === action.payload.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                updatedCartItems = [...state.cartItems, { ...action.payload }];
            }

            saveToLocalStorage(JSON.stringify(updatedCartItems));
            return {
                ...state,
                cartItems: updatedCartItems,
                cartTotal: calculateCartTotal(updatedCartItems),
            };
        case REMOVE_FROM_CART:
            const remainingItems = state.cartItems.filter(
                (x) => x.id !== action.payload
            );
            saveToLocalStorage(JSON.stringify(remainingItems));
            return {
                ...state,
                cartItems: remainingItems,
                cartTotal: calculateCartTotal(remainingItems),
            };
        case INCREMENT_QUANTITY:
            const incrementedItems = state.cartItems.map((x) =>
                x.id === action.payload ? { ...x, quantity: x.quantity + 1 } : x
            );
            saveToLocalStorage(JSON.stringify(incrementedItems));
            return {
                ...state,
                cartItems: incrementedItems,
                quantity: incrementedItems.quantity,
                cartTotal: calculateCartTotal(incrementedItems),
            };
        case DECREMENT_QUANTITY:
            const decrementedItems = state.cartItems.map((item) => {
                if (item.id === action.payload) {
                    return {
                        ...item,
                        quantity: Math.max(item.quantity - 1, 1),
                    };
                }
                return item;
            });

            saveToLocalStorage(JSON.stringify(decrementedItems));
            return {
                ...state,
                cartItems: decrementedItems,
                cartTotal: calculateCartTotal(decrementedItems),
            };
        case CLEAR_CART:
            const clearCartItems = [];
            const clearCartTotal = 0;
            saveToLocalStorage(JSON.stringify(clearCartItems));
            return {
                ...state,
                cartItems: clearCartItems,
                cartTotal: clearCartTotal,
            };
        case SET_CART:
            if (typeof window === undefined) return;
            const storedData = localStorage.getItem('cartItems');
            if (!storedData) return { ...state, cartItems: [], cartTotal: 0 };

            const parsedData = JSON.parse(storedData);
            const currentTime = new Date().getTime();

            // Check if 24 hours have passed
            if (currentTime - parsedData.timestamp > 24 * 60 * 60 * 1000) {
                localStorage.removeItem('cartItems');
                return { ...state, cartItems: [], cartTotal: 0 };
            }

            const getLocalData = parsedData.items || [];
            return {
                ...state,
                cartItems: getLocalData,
                cartTotal: calculateCartTotal(getLocalData),
            };

        default:
            return state;
    }
};

export { cartReducer, initialState };
