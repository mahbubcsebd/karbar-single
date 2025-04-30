
const LandingKeyFetures = ({section_three_key_feature}) => {
  return (
     <div className="grid justify-center text-center bg-white rounded-lg lg:rounded-[20px] p-[24px] lg:p-10 mt-[30px]">
<div
            className="grid gap-[18px]"
            dangerouslySetInnerHTML={{
                __html: section_three_key_feature,
            }}
        ></div>
     </div>

    //   <div className="grid justify-center text-center bg-white rounded-[20px] p-10 mt-[30px]">
    //       <h4 className="text-[30px] text-gray-900 font-semibold mb-[18px]">
    //           Key Features:
    //       </h4>
    //       <ul className="grid justify-center gap-3 text-center">
    //           <li className="flex items-center justify-center gap-2 text-2xl font-medium text-center text-gray-600">
    //               <span className="inline-block">
    //                   <Image
    //                       src={keyIcon}
    //                       alt="key icon"
    //                   />
    //               </span>
    //               <span className="inline-block text-gray-800 text-medium">
    //                   Flexible Fit:
    //               </span>
    //               Stretch technology for freedom of movement.
    //           </li>
    //           <li className="flex items-center justify-center gap-2 text-2xl font-medium text-center text-gray-600">
    //               <span className="inline-block">
    //                   <Image
    //                       src={keyIcon}
    //                       alt="key icon"
    //                   />
    //               </span>
    //               <span className="inline-block text-gray-800 text-medium">
    //                   Machine Washable:
    //               </span>
    //               Easy care with long-lasting durability.
    //           </li>
    //           <li className="flex items-center justify-center gap-2 text-2xl font-medium text-center text-gray-600">
    //               <span className="inline-block">
    //                   <Image
    //                       src={keyIcon}
    //                       alt="key icon"
    //                   />
    //               </span>
    //               <span className="inline-block text-gray-800 text-medium">
    //                   Two Pockets:
    //               </span>
    //               Practical and stylish.
    //           </li>
    //           <li className="flex items-center justify-center gap-2 text-2xl font-medium text-center text-gray-600">
    //               <span className="inline-block">
    //                   <Image
    //                       src={keyIcon}
    //                       alt="key icon"
    //                   />
    //               </span>
    //               <span className="inline-block text-gray-800 text-medium">
    //                   Zip Fly Closure:
    //               </span>
    //               Sleek and secure.
    //           </li>
    //       </ul>
    //   </div>
  );
}

export default LandingKeyFetures