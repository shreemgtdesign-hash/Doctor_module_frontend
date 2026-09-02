import {
    useEffect,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import DashboardCard
    from "../../../components/Dashboard/DashboardCard";

import DashboardDropdown
    from "../../../components/Dashboard/DashboardDropdown";

import {
    loadTherapistScheduleOverview,
} from "../../../redux/therapist/therapistThunk";


const ScheduleOverview = ({
    period = "today",
    setPeriod,
}) => {

    const dispatch = useDispatch();


    // =========================================
    // REDUX STATE
    // =========================================

    const scheduleOverview = useSelector(
        (state) =>
            state.therapist.scheduleOverview
    );


    // =========================================
    // FETCH SCHEDULE OVERVIEW
    // =========================================

    useEffect(() => {

        dispatch(
            loadTherapistScheduleOverview(
                period
            )
        );

    }, [dispatch, period]);


    // =========================================
    // PERIOD CHANGE
    // =========================================

    const handlePeriodChange = (value) => {

        if (setPeriod) {
            setPeriod(value);
        }

    };


    return (

        <DashboardCard className="px-5 pt-5 pb-5">

            {/* =====================================
                HEADER
            ====================================== */}

            <div className="flex items-center justify-between">

                <h2 className="text-[18px] font-semibold text-[#4B2E2A]">
                    Schedule Overview
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


            {/* =====================================
                TOTAL APPOINTMENTS
            ====================================== */}

            <div className="mt-5">

                <h1 className="text-[32px] font-bold text-[#4B2E2A]">
                    {scheduleOverview?.total_patients ?? 0}
                </h1>

                <p className="mt-1 text-[13px] text-[#7D726B]">
                    Total Appointments
                </p>

            </div>


            {/* =====================================
                DIVIDER
            ====================================== */}

            <div className="my-4 border-t border-[#EFE4DC]" />


            {/* =====================================
                GENDER BREAKDOWN
            ====================================== */}

            <div className="grid grid-cols-3">

                {/* MEN */}

                <div className="text-center border-r border-[#EFE4DC]">

                    <p className="text-[16px] font-semibold text-[#4D2E23]">
                        Men
                    </p>

                    <p className="mt-1 text-[20px] font-bold text-[#4D2E23]">
                        {scheduleOverview?.men ?? 0}
                    </p>

                </div>


                {/* WOMEN */}

                <div className="text-center border-r border-[#EFE4DC]">

                    <p className="text-[16px] font-semibold text-[#4D2E23]">
                        Women
                    </p>

                    <p className="mt-1 text-[20px] font-bold text-[#4D2E23]">
                        {scheduleOverview?.women ?? 0}
                    </p>

                </div>


                {/* CHILDREN */}

                <div className="text-center">

                    <p className="text-[16px] font-semibold text-[#4D2E23]">
                        Children
                    </p>

                    <p className="mt-1 text-[20px] font-bold text-[#4D2E23]">
                        {scheduleOverview?.children ?? 0}
                    </p>

                </div>

            </div>

        </DashboardCard>

    );

};


export default ScheduleOverview;