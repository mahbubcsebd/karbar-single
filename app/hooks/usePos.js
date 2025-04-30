import { useContext } from 'react';
import PosProductContext from '../context/PosProductContext';

const usePos = () => {
    const { state, dispatch } = useContext(PosProductContext);
    return { state, dispatch };
};

export default usePos;
