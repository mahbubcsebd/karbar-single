
const DaribProductLoader = ({items = 4}) => {
  return (
      <div className="product-list grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 xl:grid-cols-4 xl:gap-[30px] ">
          {Array.from({ length: items }).map((_, index) => (
              <div
                  key={index}
                  className="block w-full h-full overflow-hidden bg-white rounded-lg animate-pulse"
              >
                  <div className="block w-full h-[180px] sm:h-[373px] md:h-[232px] lg:h-[306px] xl:h-[281px] 1xl:h-[417px] 2xl:h-[337px] rounded-tl-lg rounded-tr-lg overflow-hidden relative"></div>
                  <div className="p-4 bg-white">
                      <div className="block h-4 bg-gray-200 mb-1 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 mb-2 animate-pulse"></div>
                      <div className="h-10 bg-gray-200 animate-pulse"></div>
                  </div>
              </div>
          ))}
      </div>
  );
}

export default DaribProductLoader