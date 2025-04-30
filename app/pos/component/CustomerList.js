'use client';

import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import useAuth from '@/hooks/useAuth';
import usePos from '@/hooks/usePos';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { LuRefreshCw } from 'react-icons/lu';
import { getWarehouse } from '../../utils/pos/getWarehouse';
import { createCustomer, getCustomers } from '../../utils/pos/posCustomers';
import UserCreateModal from './modal/UserCreateModal';


const CustomerList = ({
    customervalue,
    setCustomerValue,
    warehousevalue,
    setWarehouseValue,
}) => {
    const [open, setOpen] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [defaultCustomer, setDefaultCustomer] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    // const [customervalue, setCustomerValue] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const { dispatch } = usePos();
    const {authToken} = useAuth();

    const handleRefresh = () => {
        // Clear the cart
        dispatch({
            type: 'CLEAR_CART',
        });

        // Reset user to "Walk in Customer"
        const walkInCustomer = customers.find(
            (customer) => customer.name.trim() === 'Walk in Customer'
        )?.id;

        // Reset warehouse to the first one (default)
        if (warehouses.length > 0) {
            setWarehouseValue(warehouses[0].id);
        }

        setCustomerValue(walkInCustomer);
    };

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const customersData = await getCustomers(authToken);
                setCustomers(customersData.data);
                const defaultCustomer = customersData.data.find(
                    (customer) => customer.name.trim() === 'Walk in Customer'
                )?.id;
                setCustomerValue(defaultCustomer);
            } catch (error) {
                console.error('Failed to fetch customers:', error);
            }
        };

        fetchCustomers();
    }, [setCustomerValue, authToken]);

    // Fetch warehouse data
    useEffect(() => {
        const fetchWarehouse = async () => {
            try {
                const warehouseData = await getWarehouse(authToken);
                setWarehouses(warehouseData.data);

                // Set the first warehouse as the default selected value
                if (warehouseData.data.length > 0) {
                    setWarehouseValue(warehouseData.data[0].id);
                }
            } catch (error) {
                console.error('Failed to fetch warehouse:', error);
            }
        };

        fetchWarehouse();
    }, [setWarehouseValue, authToken]);

    // Handle value change
    const handleValueChange = (value) => {
        setWarehouseValue(value);
        console.log('Selected warehouse ID:', value);
    };

    // Create User
    const submitHandler = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await createCustomer(
                authToken,
                JSON.stringify(data)
            );

            // Check for successful response
            if (response.ok) {
                const newCustomer = await response.json();

                setCustomers((prevCustomers) => [
                    ...prevCustomers,
                    newCustomer,
                ]);

                // Automatically select the newly created customer
                setCustomerValue(newCustomer.id);

                setIsOpen(false); // Close the modal after submission
            } else {
                throw new Error('Failed to submit review');
            }
        } catch (error) {
            console.error('Failed to create customer:', error);
        }
    };
    return (
        <div className="flex items-center gap-4 flex-wrap">
            <div>
                <Popover
                    open={open}
                    onOpenChange={setOpen}
                >
                    <div className="flex">
                        <UserCreateModal
                            submitHandler={submitHandler}
                            isOpen={isOpen}
                            setIsOpen={setIsOpen}
                        />
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-[200px] text-xs font-normal justify-between px-3 py-2 border-[#E7E6EC] rounded-none rounded-r-md"
                                area-label="combobox button"
                            >
                                {customervalue
                                    ? customers.find(
                                          (customer) =>
                                              customer.id === customervalue
                                      )?.name // Show name based on selected id
                                    : 'Walk in Customer'}
                                <CaretSortIcon className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                            </Button>
                        </PopoverTrigger>
                    </div>

                    <PopoverContent className="w-[200px] p-0">
                        <Command>
                            <CommandInput
                                placeholder="Search customer..."
                                className="h-9"
                            />
                            <CommandList>
                                <CommandEmpty>No Customer found.</CommandEmpty>
                                <CommandGroup>
                                    {customers.map((customer) => (
                                        <CommandItem
                                            key={customer.id}
                                            className="text-[12px]"
                                            value={customer.id.toString()} // Use id as value
                                            onSelect={(currentValue) => {
                                                setCustomerValue(
                                                    Number(currentValue) ===
                                                        customervalue
                                                        ? ''
                                                        : Number(currentValue)
                                                ); // Set the selected customer's id
                                                setOpen(false);
                                            }}
                                        >
                                            {customer.name}
                                            <CheckIcon
                                                className={cn(
                                                    'ml-auto h-4 w-4',
                                                    customervalue ===
                                                        customer.id
                                                        ? 'opacity-100'
                                                        : 'opacity-0'
                                                )}
                                            />
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
            <div>
                <Select
                    onValueChange={handleValueChange}
                    value={warehousevalue}
                >
                    <SelectTrigger className="w-[150px] text-xs font-normal justify-between px-3 py-2 border-[#E7E6EC]">
                        <SelectValue placeholder="Select Warehouse">
                            {warehouses.find((wh) => wh.id === warehousevalue)
                                ?.name || 'Select Warehouse'}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {warehouses.map((warehouse) => (
                                <SelectItem
                                    key={warehouse.id}
                                    value={warehouse.id}
                                    selected={warehousevalue === warehouse.id} // Check if it's the selected warehouse
                                >
                                    {warehouse.name}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <button
                onClick={handleRefresh}
                className="w-[34px] h-[34px] flex justify-center items-center bg-gray-200 rounded"
            >
                <LuRefreshCw />
            </button>
        </div>
    );
};

export default CustomerList;
