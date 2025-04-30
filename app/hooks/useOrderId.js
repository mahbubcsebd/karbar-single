import OrderIdContext from "@/context/orderIdContext";
import { useContext } from "react";

const useOrderId = () => {
    const {orderId, setOrderId} = useContext(OrderIdContext)

    return {orderId, setOrderId}
}

export default useOrderId;