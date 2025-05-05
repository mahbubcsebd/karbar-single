import {
    Dialog,
    DialogContent,
    DialogTrigger
} from '@/_components/ui/dialog';

const CartModal = ({ children }) => {
    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <div className="">Cart Content Here....</div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CartModal;
