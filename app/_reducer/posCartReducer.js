/* eslint-disable no-case-declarations */
const posInitialState = {
    posCartItems: [],
    cartTotal: 0,
    quantity: 1,
};

const saveToLocalStorage = (posCartItems) => {
    localStorage.setItem('posCartItems', posCartItems);
};

// Action types
const ADD_TO_CART = 'ADD_TO_CART';
const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
const INCREMENT_QUANTITY = 'INCREMENT_QUANTITY';
const DECREMENT_QUANTITY = 'DECREMENT_QUANTITY';
const CLEAR_CART = 'CLEAR_CART';
const SET_CART = 'SET_CART';

const calculateCartTotal = (posCartItems) => {
    return posCartItems.reduce(
        (total, item) =>
            total +
            (item.sale_price > 0 ? item.sale_price : item.unit_price) *
                item.quantity,
        0
    );
};

const posCartReducer = (state, action) => {
    switch (action.type) {
        case ADD_TO_CART:
            const itemInCart = state.posCartItems.find(
                (item) => item.barcode_or_sku_code === action.payload.barcode_or_sku_code
            );
            let updatedCartItems;
            if (itemInCart) {
                updatedCartItems = state.posCartItems.map((item) =>
                    item.barcode_or_sku_code === action.payload.barcode_or_sku_code
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                updatedCartItems = [
                    ...state.posCartItems,
                    { ...action.payload },
                ];
            }

            saveToLocalStorage(JSON.stringify(updatedCartItems));
            return {
                ...state,
                posCartItems: updatedCartItems,
                cartTotal: calculateCartTotal(updatedCartItems),
            };
        case REMOVE_FROM_CART:
            const remainingItems = state.posCartItems.filter(
                (x) => x.barcode_or_sku_code !== action.payload
            );
            saveToLocalStorage(JSON.stringify(remainingItems));
            //  saveToLocalStorage(remainingItems);
            return {
                ...state,
                posCartItems: remainingItems,
                cartTotal: calculateCartTotal(remainingItems),
            };
        case INCREMENT_QUANTITY:
            const incrementedItems = state.posCartItems.map((x) =>
                x.barcode_or_sku_code === action.payload ? { ...x, quantity: x.quantity + 1 } : x
            );
            saveToLocalStorage(JSON.stringify(incrementedItems));
            return {
                ...state,
                posCartItems: incrementedItems,
                quantity: incrementedItems.quantity,
                cartTotal: calculateCartTotal(incrementedItems),
            };
        case DECREMENT_QUANTITY:
            const decrementedItems = state.posCartItems.map((item) => {
                if (item.barcode_or_sku_code === action.payload) {
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
                posCartItems: decrementedItems,
                cartTotal: calculateCartTotal(decrementedItems),
            };
        case CLEAR_CART:
            const clearCartItems = [];
            const clearCartTotal = 0;
            saveToLocalStorage(JSON.stringify(clearCartItems));
            // saveToLocalStorage(JSON.stringify(decrementedItems));
            return {
                ...state,
                posCartItems: clearCartItems,
                cartTotal: clearCartTotal,
            };
        case SET_CART:
            if (typeof window === undefined) return;
            const getLocalData =
                JSON.parse(localStorage.getItem('posCartItems')) || [];
            return {
                ...state,
                posCartItems: getLocalData,
                cartTotal: calculateCartTotal(getLocalData),
            };

        default:
            return state;
    }
};

export { posCartReducer, posInitialState };
