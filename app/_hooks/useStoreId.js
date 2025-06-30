import { useContext } from 'react';
import StoreIdContext from '../_context/StoreIdContext';

const useStoreId = () => {
  const { userStoreId, setUserStoreId } = useContext(StoreIdContext);

  return { userStoreId, setUserStoreId };
};

export default useStoreId;
