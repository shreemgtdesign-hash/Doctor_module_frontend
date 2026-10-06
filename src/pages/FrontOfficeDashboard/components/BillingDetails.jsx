import {
    useEffect,
    useState,
} from "react";

import {
    FaLeaf,
} from "react-icons/fa";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    useNavigate,
} from "react-router-dom";

import DashboardCard
    from "../../../components/Dashboard/DashboardCard";

import DashboardDropdown
    from "../../../components/Dashboard/DashboardDropdown";

import {
    loadFrontOfficeBillingDetails,
} from "../../../redux/frontOffice/frontOfficeDashboardThunk";


const BillingDetails = () => {

    const dispatch = useDispatch();

    const navigate = useNavigate();


    // ==========================================
    // REDUX DATA
    // ==========================================

    const billing =
        useSelector(
            (state) =>
                state.frontOfficeDashboard
                    .billing
        );


    // ==========================================
    // LOCAL PERIOD
    // ==========================================

    const [
        selectedPeriod,
        setSelectedPeriod,
    ] = useState(
        billing?.period ||
        "today"
    );


    // ==========================================
    // KEEP LOCAL PERIOD IN SYNC WITH REDUX
    // ==========================================

    useEffect(() => {

        if (billing?.period) {

            setSelectedPeriod(
                billing.period
            );

        }

    }, [
        billing?.period,
    ]);


    // ==========================================
    // PERIOD OPTIONS
    // ==========================================

    const periodOptions = [

        {
            value: "today",
            label: "Today",
        },

        {
            value: "week",
            label: "This Week",
        },

        {
            value: "month",
            label: "This Month",
        },

        {
            value: "till_date",
            label: "Till Date",
        },

    ];

// ==========================================
// INITIAL BILLING LOAD
// ==========================================

useEffect(() => {

    dispatch(
        loadFrontOfficeBillingDetails(
            selectedPeriod
        )
    );

}, [dispatch]);
    // ==========================================
    // CHANGE PERIOD
    // ==========================================

    const handlePeriodChange = (
        nextPeriod
    ) => {

        setSelectedPeriod(
            nextPeriod
        );


        dispatch(
            loadFrontOfficeBillingDetails(
                nextPeriod
            )
        );

    };


    // ==========================================
    // BILLING DATA
    // ==========================================

    const visitingDoctor =
        billing?.visiting_doctor_payouts ||
        {};


    const associateDoctor =
        billing?.associate_doctor_payouts ||
        {};


    const pendingPayments =
        billing?.pending_payments ||
        {};


    // ==========================================
    // RENDER
    // ==========================================

    return (

        <DashboardCard
            className="
                px-5
                pt-5
                pb-5
            "
        >

            {/* ================================= */}
            {/* HEADER */}
            {/* ================================= */}

            <div
                className="
                    flex
                    items-center
                    justify-between
                    gap-3
                "
            >

                <h2
                    className="
                        text-[17px]
                        font-semibold
                        text-[#4B2E2A]
                    "
                >
                    Billing Details
                </h2>


                {/* ================================= */}
                {/* PERIOD DROPDOWN */}
                {/* ================================= */}

                <div
                    onClick={(event) =>
                        event.stopPropagation()
                    }
                    className="
                        shrink-0
                    "
                >

                    <DashboardDropdown
                        value={
                            selectedPeriod
                        }
                        options={
                            periodOptions
                        }
                        onChange={
                            handlePeriodChange
                        }
                    />

                </div>

            </div>


            {/* ================================= */}
            {/* BILLING CARDS */}
            {/* ================================= */}

            <div
                className="
                    mt-4
                    grid
                    grid-cols-1
                    gap-4
                    md:grid-cols-3
                "
            >

                <BillingCard
                    data={
                        visitingDoctor
                    }
                    onClick={() =>
                        navigate(
                            "/frontoffice/billing/visiting-doctor-payouts"
                        )
                    }
                />


                <BillingCard
                    data={
                        associateDoctor
                    }
                    onClick={() =>
                        navigate(
                            "/frontoffice/billing/associate-doctor-payouts"
                        )
                    }
                />


                <BillingCard
                    data={
                        pendingPayments
                    }
                    onClick={() =>
                        navigate(
                            "/frontoffice/billing/pending-payments"
                        )
                    }
                />

            </div>

        </DashboardCard>

    );
};


// ==========================================
// BILLING CARD
// ==========================================

const BillingCard = ({
    data,
    onClick,
}) => {

    return (

        <div
            onClick={onClick}
            className="
                cursor-pointer
                rounded-2xl
                border
                border-[#EFE4DC]
                px-4
                py-4
                transition
                hover:border-[#D8C1B1]
                hover:bg-[#FFFDFB]
            "
        >

            {/* ================================= */}
            {/* ICON + TITLE */}
            {/* ================================= */}

            <div
                className="
                    flex
                    items-center
                    gap-2
                "
            >

                <div
                    className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-[#FFF0E4]
                        text-[#4B2E2A]
                    "
                >

                    <FaLeaf
                        size={16}
                    />

                </div>


                <p
                    className="
                        text-[13px]
                        font-medium
                        leading-4
                        text-[#4B2E2A]
                    "
                >
                    {
                        data?.label ||
                        "—"
                    }
                </p>

            </div>


            {/* ================================= */}
            {/* COUNT */}
            {/* ================================= */}

            <h1
                className="
                    mt-4
                    text-[26px]
                    font-bold
                    text-[#4B2E2A]
                "
            >
                {
                    data?.count ?? 0
                }
            </h1>


            {/* ================================= */}
            {/* SUBTEXT */}
            {/* ================================= */}

            <p
                className="
                    text-[12px]
                    text-[#7D726B]
                "
            >
                {
                    data?.subtext ||
                    "—"
                }
            </p>

        </div>

    );

};


export default BillingDetails;