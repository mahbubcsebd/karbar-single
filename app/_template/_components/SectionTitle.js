import useSiteSetting from '@/_hooks/useSiteSetting';

const SectionTitle = ({ preTitle, postTitle, position }) => {
  const { siteSetting } = useSiteSetting();
  return (
    <div
      className={`flex md:mb-[60px] mb-6 ${
        position === 'start' ? '' : 'justify-center'
      }`}
    >
      <h2 className="text-2xl font-semibold text-gray-800 capitalize md:text-4xl">
        {preTitle}{' '}
        <span
          style={{ color: siteSetting?.btn_bg_color }}
          // className="text-[#348E29]"
        >
          {' '}
          {postTitle}
        </span>
      </h2>
    </div>
  );
};

export default SectionTitle;
