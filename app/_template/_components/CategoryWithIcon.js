import catIcon from '@/assets/icons/catIcon.svg';
import Image from 'next/image';

const CategoryWithIcon = () => {
  const categories = [
    {
      id: 1,
      title: 'vegitables',
      slug: 'vegitables',
      icon: catIcon,
    },
    {
      id: 2,
      title: 'vegitables',
      slug: 'vegitables',
      icon: catIcon,
    },
    {
      id: 3,
      title: 'vegitables',
      slug: 'vegitables',
      icon: catIcon,
    },
    {
      id: 4,
      title: 'vegitables',
      slug: 'vegitables',
      icon: catIcon,
    },
    {
      id: 5,
      title: 'vegitables',
      slug: 'vegitables',
      icon: catIcon,
    },
    {
      id: 6,
      title: 'vegitables',
      slug: 'vegitables',
      icon: catIcon,
    },
    {
      id: 7,
      title: 'vegitables',
      slug: 'vegitables',
      icon: catIcon,
    },
    {
      id: 8,
      title: 'vegitables',
      slug: 'vegitables',
      icon: catIcon,
    },
    {
      id: 9,
      title: 'vegitables',
      slug: 'vegitables',
      icon: catIcon,
    },
    {
      id: 10,
      title: 'vegitables',
      slug: 'vegitables',
      icon: catIcon,
    },
    {
      id: 11,
      title: 'vegitables',
      slug: 'vegitables',
      icon: catIcon,
    },
  ];
  return (
    <div className="pt-10 md:pt-12 xl:pt-16">
      <div className="container">
        <div className="flex flex-wrap items-center gap-5">
          {categories.map((category) => (
            <button
              aria-label="category button"
              key={category.id}
              className="max-w-[110px]"
            >
              <div className="w-[110px] h-[110px] bg-[#C0E5C3] rounded-2xl flex justify-center items-center">
                <Image
                  src={category.icon}
                  width="64"
                  height="64"
                  className="object-contain"
                />
              </div>
              <p className="pt-5 text-base font-semibold text-gray-700 capitalize">
                {category.title}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryWithIcon;
