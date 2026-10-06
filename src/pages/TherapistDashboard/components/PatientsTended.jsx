import { useEffect, useState } from "react";
import {
    useDispatch,
    useSelector,
} from "react-redux";

import DashboardCard
    from "../../../components/Dashboard/DashboardCard";

import DashboardDropdown
    from "../../../components/Dashboard/DashboardDropdown";

import {
    loadTherapistPatients,
} from "../../../redux/therapist/therapistThunk";


const PatientsTended = () => {

    const dispatch = useDispatch();

    const [period, setPeriod] = useState("today");

    const patients = useSelector(
        (state) =>
            state.therapist.patients || {}
    );

    const handlePeriodChange = (newPeriod) => {
        setPeriod(newPeriod);
        dispatch(loadTherapistPatients(newPeriod));
    };


    return (

        <DashboardCard className="px-5 pt-5 pb-5">

            <div className="flex items-center justify-between">

                <h2 className="text-[18px] font-semibold text-[#4B2E2A]">
                    Patients Tended To
                </h2>


                <DashboardDropdown
                    value={period}
                    options={[
                        {
                            label: "Today",
                            value: "today",
                        },
                        {
                            label: "This Week",
                            value: "week",
                        },
                        {
                            label: "This Month",
                            value: "month",
                        },
                    ]}
                    onChange={handlePeriodChange}
                />

            </div>


            <div className="mt-5">

                <h1 className="text-[32px] font-bold text-[#4B2E2A]">
                    {patients?.total_patients ?? 0}
                </h1>

                <p className="mt-1 text-[13px] text-[#7D726B]">
                    Total Patients
                </p>

            </div>


            <div className="my-4 border-t border-[#EFE4DC]" />


            <div className="grid grid-cols-3">

                <div className="text-center border-r border-[#EFE4DC]">

                    <p className="text-[16px] font-semibold text-[#4D2E23]">
                        Men
                    </p>

                    <p className="mt-1 text-[20px] font-bold text-[#4D2E23]">
                        {patients?.men ?? 0}
                    </p>

                </div>


                <div className="text-center border-r border-[#EFE4DC]">

                    <p className="text-[16px] font-semibold text-[#4D2E23]">
                        Women
                    </p>

                    <p className="mt-1 text-[20px] font-bold text-[#4D2E23]">
                        {patients?.women ?? 0}
                    </p>

                </div>


                <div className="text-center">

                    <p className="text-[16px] font-semibold text-[#4D2E23]">
                        Children
                    </p>

                    <p className="mt-1 text-[20px] font-bold text-[#4D2E23]">
                        {patients?.children ?? 0}
                    </p>

                </div>

            </div>

        </DashboardCard>

    );
};


export default PatientsTended;