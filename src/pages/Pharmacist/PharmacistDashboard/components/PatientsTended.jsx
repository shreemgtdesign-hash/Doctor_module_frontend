import { useSelector } from "react-redux";

import DashboardCard
    from "../../../../components/Dashboard/DashboardCard";

import DashboardDropdown
    from "../../../../components/Dashboard/DashboardDropdown";


const PatientsTended = () => {

    const patients =
        useSelector(
            (state) =>
                state.pharmacist.patientsTended
        );


    return (

        <DashboardCard className="p-5">

            <div className="flex items-center justify-between">

                <h2 className="text-[18px] font-semibold text-[#4B2E2A]">
                    Patients Tended To
                </h2>


                <DashboardDropdown
                    value={
                        patients?.period ||
                        "week"
                    }
                    options={[
                        {
                            label: "This Week",
                            value: "week",
                        },
                        {
                            label: "This Month",
                            value: "month",
                        },
                        {
                            label: "Till Date",
                            value: "till_date",
                        },
                    ]}
                />

            </div>


            <div className="mt-5">

                <h1 className="text-[36px] font-bold text-[#4D2E23]">
                    {patients?.total || 0}
                </h1>

                <p className="text-sm text-[#8B7A70]">
                    Total Patients
                </p>


                <div className="mt-5 grid grid-cols-3 divide-x divide-[#EFE4DC]">

                    <div className="text-center">

                        <p className="text-sm text-[#5B4035]">
                            Men
                        </p>

                        <p className="mt-1 text-lg font-bold text-[#4D2E23]">
                            {patients?.men || 0}
                        </p>

                    </div>


                    <div className="text-center">

                        <p className="text-sm text-[#5B4035]">
                            Women
                        </p>

                        <p className="mt-1 text-lg font-bold text-[#4D2E23]">
                            {patients?.women || 0}
                        </p>

                    </div>


                    <div className="text-center">

                        <p className="text-sm text-[#5B4035]">
                            Children
                        </p>

                        <p className="mt-1 text-lg font-bold text-[#4D2E23]">
                            {patients?.children || 0}
                        </p>

                    </div>

                </div>

            </div>

        </DashboardCard>
    );
};


export default PatientsTended;