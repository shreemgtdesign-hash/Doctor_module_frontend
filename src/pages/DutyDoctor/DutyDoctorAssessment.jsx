import {
    useEffect,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    useNavigate,
    useParams,
    useSearchParams,
} from "react-router-dom";

import {
    loadPatientAssessment,
} from "../../redux/dutyDoctor/dutyDoctorThunk";

import PainAssessmentForm
    from "./components/PainAssessmentForm";


const DutyDoctorAssessment = () => {

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const {
        bookingId,
    } = useParams();

    const [searchParams] =
        useSearchParams();


    /*
     * ==========================================
     * GET ASSESSMENT TYPE
     * ==========================================
     */

    const requestedType =
        searchParams.get("type");


    /*
     * Only "post" should be POST.
     * Everything else defaults to PRE.
     */

    const type =
        requestedType === "post"
            ? "post"
            : "pre";


    const {
        assessment,
        loadingAssessment,
        assessmentError,
    } = useSelector(
        (state) =>
            state.dutyDoctor
    );


    /*
     * ==========================================
     * LOAD PATIENT ASSESSMENT
     * ==========================================
     */

    useEffect(() => {

        if (!bookingId) {

            navigate(
                "/duty-doctor/dashboard"
            );

            return;

        }

        dispatch(
            loadPatientAssessment(
                bookingId
            )
        );

    }, [
        dispatch,
        bookingId,
        navigate,
    ]);


    /*
     * ==========================================
     * LOADING
     * ==========================================
     */

    if (loadingAssessment) {

        return (
            <div
                className="
                    flex
                    min-h-screen
                    items-center
                    justify-center
                    bg-[#F8F6F3]
                    text-[#4D2E23]
                "
            >
                Loading patient assessment...
            </div>
        );

    }


    /*
     * ==========================================
     * ERROR
     * ==========================================
     */

    if (assessmentError) {

        return (
            <div
                className="
                    flex
                    min-h-screen
                    flex-col
                    items-center
                    justify-center
                    gap-4
                    bg-[#F8F6F3]
                "
            >

                <div
                    className="
                        rounded-xl
                        bg-red-50
                        px-6
                        py-4
                        text-red-600
                    "
                >
                    {assessmentError}
                </div>


                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/duty-doctor/dashboard"
                        )
                    }
                    className="
                        rounded-xl
                        bg-[#4D2E23]
                        px-5
                        py-2
                        text-white
                    "
                >
                    Back to Dashboard
                </button>

            </div>
        );

    }


    if (!assessment) {
        return null;
    }


    /*
     * ==========================================
     * IMPORTANT
     * ==========================================
     *
     * The key forces a completely fresh
     * PainAssessmentForm when switching
     * PRE → POST.
     */

    return (
        <PainAssessmentForm
            key={`${bookingId}-${type}`}
            assessment={assessment}
            type={type}
        />
    );

};


export default DutyDoctorAssessment;