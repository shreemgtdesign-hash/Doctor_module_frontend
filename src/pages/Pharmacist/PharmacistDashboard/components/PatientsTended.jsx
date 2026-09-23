import {
    useEffect,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    loadPatientsTended,
} from "../../../../redux/pharmacist/pharmacistThunk";

import DashboardCard
    from "../../../../components/Dashboard/DashboardCard";

import DashboardDropdown
    from "../../../../components/Dashboard/DashboardDropdown";


const PatientsTended = () => {

    const dispatch = useDispatch();


    const patients =
        useSelector(
            (state) =>
                state.pharmacist.patientsTended
        );


    // ==========================================
    // PERIOD
    // ==========================================

    const [period, setPeriod] =
        useState(
            patients?.period ||
            "week"
        );


    // ==========================================
    // KEEP PERIOD IN SYNC WITH REDUX
    // ==========================================

    useEffect(() => {

        if (
            patients?.period
        ) {

            setPeriod(
                patients.period
            );

        }

    }, [
        patients?.period,
    ]);


    // ==========================================
    // CHANGE PERIOD
    // ==========================================

    const handlePeriodChange = (
        newPeriod
    ) => {

        // Immediately update dropdown
        setPeriod(
            newPeriod
        );


        // Load selected period
        dispatch(
            loadPatientsTended(
                newPeriod
            )
        );

    };


    return (

        <DashboardCard
            className="
                p-4
            "
        >

            {/* HEADER */}

            <div className="
                flex
                items-center
                justify-between
            ">

                <h2 className="
                    text-[17px]
                    font-semibold
                    text-[#4B2E2A]
                ">
                    Patients Tended To
                </h2>


                <DashboardDropdown

                    value={
                        period
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

                    onChange={
                        handlePeriodChange
                    }

                />

            </div>


            {/* TOTAL */}

            <div className="mt-3">

                <h1 className="
                    text-[32px]
                    font-bold
                    leading-none
                    text-[#4D2E23]
                ">
                    {
                        patients?.total_patients ||
                        patients?.total ||
                        0
                    }
                </h1>


                <p className="
                    mt-1
                    text-[12px]
                    text-[#8B7A70]
                ">
                    Total Patients
                </p>


                {/* GENDER */}

                <div className="
                    mt-4
                    grid
                    grid-cols-3
                    divide-x
                    divide-[#EFE4DC]
                    border-t
                    border-[#EFE4DC]
                    pt-3
                ">

                    <div className="text-center">

                        <p className="
                            text-[13px]
                            text-[#5B4035]
                        ">
                            Men
                        </p>

                        <p className="
                            mt-1
                            text-[17px]
                            font-bold
                            text-[#4D2E23]
                        ">
                            {
                                patients?.men ||
                                0
                            }
                        </p>

                    </div>


                    <div className="text-center">

                        <p className="
                            text-[13px]
                            text-[#5B4035]
                        ">
                            Women
                        </p>

                        <p className="
                            mt-1
                            text-[17px]
                            font-bold
                            text-[#4D2E23]
                        ">
                            {
                                patients?.women ||
                                0
                            }
                        </p>

                    </div>


                    <div className="text-center">

                        <p className="
                            text-[13px]
                            text-[#5B4035]
                        ">
                            Children
                        </p>

                        <p className="
                            mt-1
                            text-[17px]
                            font-bold
                            text-[#4D2E23]
                        ">
                            {
                                patients?.children ||
                                0
                            }
                        </p>

                    </div>

                </div>

            </div>

        </DashboardCard>

    );
};


export default PatientsTended;