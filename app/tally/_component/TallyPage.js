import TallyList from "./TallyList";

const TallyPage = () => {
  return (
      <div className="tally-page">
          <div className="px-5">
              <div className="bg-white rounded-xl p-[18px] mb-5">
                {/* <div className="grid justify-end mb-5">
                    <CustomerList />
                </div> */}
                <div className="mb-10">
                    <TallyList />
                </div>
              </div>
          </div>
      </div>
  );
}

export default TallyPage