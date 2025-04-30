import Input from '@/components/form/Input';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';

const UserCreateModal = ({ submitHandler, isOpen, setIsOpen }) => {
    const [errors, setErrors] = useState({
        name: '',
        phone: '',
    });

    const validateForm = (formData) => {
        const newErrors = {};
        let isValid = true;

        // Name validation
        if (!formData.get('name').trim()) {
            newErrors.name = 'Name is required';
            isValid = false;
        }

        // Phone validation
        if (!formData.get('phone').trim()) {
            newErrors.phone = 'Phone number is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);

        if (validateForm(formData)) {
            submitHandler(event);
        }
    };

    return (
        <div>
            <Dialog
                open={isOpen}
                onOpenChange={setIsOpen}
            >
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-10 h-[36px] border-[#E7E6EC] text-sm font-normal rounded-none rounded-l-md"
                    >
                        +
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-white border-[rgba(136, 49, 225, 0.20)]">
                    <DialogHeader>
                        <DialogTitle>Add Customer</DialogTitle>
                        <DialogDescription className="sr-only">
                            Add Customer Description
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <form
                            onSubmit={handleSubmit}
                            id="cart-form"
                            className="cart-form"
                        >
                            <div className="grid gap-4">
                                <div>
                                    <Input
                                        label="Name"
                                        type="text"
                                        name="name"
                                        placeholder="Enter your name"
                                        required
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Input
                                        label="Email"
                                        type="email"
                                        name="email"
                                        placeholder="example@example.com"
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Input
                                        label="Phone Number"
                                        type="text"
                                        name="phone"
                                        placeholder="+8801xxxxxxxxx"
                                        required
                                    />
                                    {errors.phone && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.phone}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Input
                                        label="Address"
                                        type="text"
                                        name="address"
                                        placeholder="House No, Road No, Thana, Zila"
                                    />
                                    {errors.address && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.address}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-start pt-5">
                                <button
                                    type="submit"
                                    className="text-xs bg-purple-900 text-white hover:bg-transparent hover:text-purple-900 font-medium py-[14px] px-[30px] border border-purple-900 transition-all duration-150 rounded"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default UserCreateModal;
