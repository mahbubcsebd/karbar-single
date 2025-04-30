
import { MdOutlineContentCopy } from 'react-icons/md';
import { TiTick } from 'react-icons/ti';
const CopyToClipboard = ({ pathUrl, copy, setCopy }) => {
    const copyToClipboardHandler = () => {
        navigator.clipboard.writeText(pathUrl);
        setCopy(true);
        setTimeout(() => {
            setCopy(false)
        }, 3000);
    };
    return (
        <button
            className={`${copy ? 'text-green-500 text-2xl' : 'text-lg' }`}
            onClick={copyToClipboardHandler} title="লিংক কপি করুন"
        >
            {copy ? <TiTick /> : <MdOutlineContentCopy />}
        </button>
    );
};

export default CopyToClipboard