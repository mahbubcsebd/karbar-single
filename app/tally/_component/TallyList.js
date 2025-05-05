'use client';

import useAuth from '@/_hooks/useAuth';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa6';
import { RiDeleteBin6Line } from 'react-icons/ri';
import CreatableSelect from 'react-select/creatable';
// import getTallyProducts from '../../utils/getTallyProducts';
import { getTallyProducts } from '../../_utils/getTallyProducts';
import CustomerList from './CustomerList';
import TallyProductsList from './TallyProductsList';

// const products = [
//     { id: 1, name: 'Product A' },
//     { id: 2, name: 'Product B' },
//     { id: 3, name: 'Product C' },
// ];

const TallyList = () => {
    const [showWarning, setShowWarning] = useState(false);
    const [duplicateWarning, setDuplicateWarning] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [cartProducts, setCartProducts] = useState([]);
    const searchParams = useSearchParams();

    // Customer and Warehouse
    const [customervalue, setCustomerValue] = useState('');
    const [warehousevalue, setWarehouseValue] = useState('');

    const priceInputRefs = useRef({});
    const [products, setProducts] = useState([]);
    const { authToken, setAuthToken } = useAuth();
    const loaderRef = useRef(null);

    const token = searchParams.get('token');

    useEffect(() => {
        setAuthToken(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    useEffect(() => {
        const fetchTallyPeoducts = async () => {
            try {
                if (token) {
                    const response = await getTallyProducts(token);
                    if (response.message === 'Unauthenticated') {
                        console.log('Unauthenticated');
                    } else {
                        setProducts(response.data);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch tally products:', error);
            }
        };
        fetchTallyPeoducts();

    }, [token]);

    const [rows, setRows] = useState([
        {
            id: 1,
            productName: '',
            quantity: 1,
            unitPrice: '',
            price: 0,
            productId: null,
        },
    ]);

    const focusUnitPriceInput = (rowId) => {
        setTimeout(() => {
            if (priceInputRefs.current[rowId]) {
                priceInputRefs.current[rowId].focus();
            }
        }, 0);
    };

    const getAvailableProducts = (rowId) => {
        const otherSelectedProducts = rows
            .filter((row) => row.id !== rowId && row.productId)
            .map((row) => row.productId);

        return products.map((product) => ({
            label: product.name,
            value: product.id,
            isDisabled: otherSelectedProducts.includes(product.id),
        }));
    };

    const createOption = (label) => {
        // Replace spaces with hyphens for the ID
        const id = label.toLowerCase().replace(/\s+/g, '-');
        return {
            label,
            value: id,
        };
    };

    const isProductNameDuplicate = (productName) => {
        // Check against initial products
        const existingInitialProduct = products.find(
            (product) =>
                product.name.toLowerCase() === productName.toLowerCase()
        );
        if (existingInitialProduct) return true;

        // Check against custom products in rows
        return rows.some(
            (row) =>
                row.productName &&
                row.productName.toLowerCase() === productName.toLowerCase()
        );
    };

    const handleCreateOption = (inputValue, rowId) => {
        setDuplicateWarning('');

        if (isProductNameDuplicate(inputValue)) {
            setDuplicateWarning(
                `Product "${inputValue}" already exists. Please use a different name.`
            );
            return;
        }

        const newOption = createOption(inputValue);

        setRows((prevRows) =>
            prevRows.map((row) =>
                row.id === rowId
                    ? {
                          ...row,
                          productName: inputValue,
                          productId: newOption.value,
                      }
                    : row
            )
        );

        focusUnitPriceInput(rowId);
        updateSelectedProducts(rows);
    };

    const handleSelectChange = (selectedOption, rowId) => {
        setShowWarning(false);
        setDuplicateWarning('');

        setRows((prevRows) => {
            const newRows = prevRows.map((row) =>
                row.id === rowId
                    ? {
                          ...row,
                          productName: selectedOption
                              ? selectedOption.label
                              : '',
                          productId: selectedOption
                              ? selectedOption.value
                              : null,
                          unitPrice: '', // Reset price
                          price: 0, // Reset total price
                          quantity: 1, // Reset quantity to 1
                      }
                    : row
            );

            updateSelectedProducts(newRows);
            return newRows;
        });

        if (selectedOption) {
            focusUnitPriceInput(rowId);
        }
    };

    const handleQuantityChange = (rowId, increment) => {
        setShowWarning(false);
        setRows((prevRows) => {
            const newRows = prevRows.map((row) => {
                if (row.id === rowId) {
                    // If quantity is 1 and trying to decrement, keep it at 1
                    const newQuantity =
                        row.quantity === 1 && increment === -1
                            ? 1
                            : Math.max(1, row.quantity + increment);

                    return {
                        ...row,
                        quantity: newQuantity,
                        price: newQuantity * (parseFloat(row.unitPrice) || 0),
                    };
                }
                return row;
            });
            updateSelectedProducts(newRows);
            return newRows;
        });
    };

    const handlePriceChange = (rowId, value) => {
        setShowWarning(false);
        setRows((prevRows) => {
            const newRows = prevRows.map((row) =>
                row.id === rowId
                    ? {
                          ...row,
                          unitPrice: value,
                          price: parseFloat(value || 0) * row.quantity,
                      }
                    : row
            );
            updateSelectedProducts(newRows);
            return newRows;
        });
    };

    const updateSelectedProducts = (currentRows) => {
        const newSelectedProducts = currentRows
            .filter((row) => row.productId && typeof row.productId === 'number')
            .map((row) => row.productId);

        setSelectedProducts(newSelectedProducts);

        const selectionData = currentRows
            .filter((row) => row.productId && row.unitPrice)
            .map((row) => ({
                productName: row.productName,
                productId: row.productId,
                quantity: row.quantity,
                unitPrice: parseFloat(row.unitPrice),
                totalPrice: row.price,
            }));
        setCartProducts(selectionData);
    };

    const isRowFilled = (row) => {
        return row.productId && row.unitPrice && parseFloat(row.unitPrice) > 0;
    };

    const handleAddRow = () => {
        // Check if any row has empty fields
        const hasEmptyFields = rows.some((row) => !isRowFilled(row));

        if (hasEmptyFields) {
            setShowWarning(true);
            return;
        }

        setShowWarning(false);

        const newRows = [
            ...rows,
            {
                id: rows.length + 1,
                productName: '',
                quantity: 1,
                unitPrice: '',
                price: 0,
                productId: null,
            },
        ];

        setRows(newRows);
        updateSelectedProducts(newRows);
    };

    const handleDeleteRow = (rowId) => {
        setShowWarning(false);
        setDuplicateWarning('');

        if (rows.length === 1) {
            // Reset the last row instead of deleting
            const resetRow = {
                id: 1,
                productName: '',
                quantity: 1,
                unitPrice: '',
                price: 0,
                productId: null,
            };
            setRows([resetRow]);
            updateSelectedProducts([resetRow]);
        } else {
            // Delete row and reindex remaining rows
            const newRows = rows
                .filter((row) => row.id !== rowId)
                .map((row, index) => ({ ...row, id: index + 1 }));

            setRows(newRows);
            updateSelectedProducts(newRows);
        }
    };

    const handleKeyPress = (e, rowId) => {
        if (e.key === 'Enter') {
            const currentRow = rows.find((row) => row.id === rowId);
            if (isRowFilled(currentRow)) {
                handleAddRow();
            }
        }
    };

    const handleFinalSelection = () => {
        updateSelectedProducts(rows);
    };

    return (
        <div>
            <div className="grid justify-end mb-5">
                <CustomerList
                    customervalue={customervalue}
                    setCustomerValue={setCustomerValue}
                    warehousevalue={warehousevalue}
                    setWarehouseValue={setWarehouseValue}
                />
            </div>
            <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="text-sm font-normal text-left text-gray-800">
                                <th className="w-10 md:w-20 px-2 md:px-4 py-2">
                                    No
                                </th>
                                <th className="px-2 md:px-4 py-2 min-w-[300px]">
                                    Product Name
                                </th>
                                <th className="px-2 md:px-4 py-2 w-[150px]">
                                    Quantity
                                </th>
                                <th className="px-2 md:px-4 py-2 w-[200px]">
                                    Unit Price
                                </th>
                                <th className="px-2 md:px-4 py-2 w-[200px]">
                                    Price
                                </th>
                                <th className="w-10 px-4 py-2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row) => (
                                <tr
                                    key={row.id}
                                    className="border-t"
                                >
                                    <td className="px-4 py-2">{row.id}</td>
                                    <td className="px-4 py-2">
                                        <CreatableSelect
                                            options={getAvailableProducts(
                                                row.id
                                            )}
                                            value={
                                                row.productName
                                                    ? {
                                                          label: row.productName,
                                                          value: row.productId,
                                                      }
                                                    : null
                                            }
                                            onChange={(selectedOption) =>
                                                handleSelectChange(
                                                    selectedOption,
                                                    row.id
                                                )
                                            }
                                            onCreateOption={(inputValue) =>
                                                handleCreateOption(
                                                    inputValue,
                                                    row.id
                                                )
                                            }
                                            placeholder="Select or type product"
                                            isClearable
                                            menuPortalTarget={document.body} // Render the dropdown outside
                                            styles={{
                                                menuPortal: (base) => ({
                                                    ...base,
                                                    zIndex: 9999, // Ensure dropdown is on top
                                                }),
                                                menu: (base) => ({
                                                    ...base,
                                                    maxHeight:
                                                        window.innerWidth < 768
                                                            ? '400px'
                                                            : '800px', // Responsive max height
                                                    overflowY: 'auto', // Enable scrolling for overflow
                                                }),
                                            }}
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <div className="flex justify-between items-center w-[106px] h-[46px] border border-gray-400 rounded-md">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        row.id,
                                                        -1
                                                    )
                                                }
                                                className="flex items-center justify-center w-10 h-10 text-xs text-gray-600 bg-white quantity-decrement"
                                                disabled={!row.productId}
                                            >
                                                <FaMinus />
                                            </button>
                                            <div className="text-xs text-gray-600 quantity">
                                                {row.quantity}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        row.id,
                                                        1
                                                    )
                                                }
                                                className="flex items-center justify-center w-10 h-10 text-xs text-gray-600 bg-white quantity-increment"
                                                disabled={!row.productId}
                                            >
                                                <FaPlus />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="number"
                                            value={row.unitPrice}
                                            onChange={(e) =>
                                                handlePriceChange(
                                                    row.id,
                                                    e.target.value
                                                )
                                            }
                                            onKeyPress={(e) =>
                                                handleKeyPress(e, row.id)
                                            }
                                            className="block w-full py-[10px] px-[18px] border border-[#D0D5DD] text-gray-700 ring-1 ring-inset ring-[#D0D5DD] focus:ring-1 focus:ring-blue-900 placeholder:text-gray-400 placeholder:text-base outline-hidden rounded-md input-shadow bg-white"
                                            min="0"
                                            disabled={!row.productId}
                                            placeholder="0"
                                            ref={(el) =>
                                                (priceInputRefs.current[
                                                    row.id
                                                ] = el)
                                            }
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="number"
                                            value={row.price}
                                            className="block w-full py-[10px] px-[18px] border border-[#D0D5DD] text-gray-700 ring-1 ring-inset ring-[#D0D5DD] focus:ring-1 focus:ring-blue-900 placeholder:text-gray-400 placeholder:text-base outline-hidden rounded-md input-shadow bg-white"
                                            min="0"
                                            readOnly
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() =>
                                                handleDeleteRow(row.id)
                                            }
                                            className="text-red-500"
                                        >
                                            <RiDeleteBin6Line />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex flex-col gap-4 mt-4 mb-5 md:mb-0">
                {showWarning && (
                    <div className="p-3 text-red-500 bg-red-100 rounded">
                        Please fill all required fields before adding a new one.
                    </div>
                )}

                {duplicateWarning && (
                    <div className="p-3 text-red-500 bg-red-100 rounded">
                        {duplicateWarning}
                    </div>
                )}

                <div className="flex gap-4">
                    <button
                        onClick={handleAddRow}
                        className="flex items-center gap-2 text-purple-900 font-normal"
                    >
                        <FaPlus /> <span className="underline">Add</span>
                    </button>
                </div>
            </div>

            <div className="">
                <TallyProductsList
                    selectedProducts={cartProducts}
                    customervalue={customervalue}
                    setCustomerValue={setCustomerValue}
                    warehousevalue={warehousevalue}
                    setWarehouseValue={setWarehouseValue}
                    setRows={setRows}
                />
            </div>
        </div>
    );
};

export default TallyList;
