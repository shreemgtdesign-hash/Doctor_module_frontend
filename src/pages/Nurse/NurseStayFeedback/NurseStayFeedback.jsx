import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  HiOutlineCalendar,
  HiOutlineChevronDown,
  HiOutlineArrowLeft,
  HiOutlineCheckCircle,
} from "react-icons/hi";
import DashboardLayout from "../../../components/Layout/DashboardLayout";
import {
  loadStayFeedback,
  saveStayFeedback,
} from "../../../redux/nurse/nurseThunk";
import {
  selectNurseStayFeedback,
  selectNurseStayFeedbackLoading,
  selectNurseStayFeedbackSaving,
  selectNurseStayFeedbackSuccess,
  resetStayFeedbackSuccess,
} from "../../../redux/nurse/nurseSlice";

const RATING_OPTIONS = ["Poor", "Fair", "Good", "Excellent"];
const YES_NO_OPTIONS = ["Yes", "No"];

const STAY_QUESTIONS = [
  { key: "overall_stay", label: "Overall stay" },
  { key: "room_comfort", label: "Room comfort" },
  { key: "cleanliness", label: "Cleanliness" },
  { key: "nursing_care", label: "Nursing care" },
  { key: "doctors", label: "Doctors" },
  { key: "food", label: "Food" },
  { key: "therapies", label: "Therapies" },
  { key: "discharge_process", label: "Discharge process" },
];

const NurseStayFeedback = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const passedPatient = location.state?.patient || {};
  const admissionId =
    id ||
    location.state?.admissionId ||
    passedPatient.id ||
    passedPatient.admission_id ||
    passedPatient.admission_no;

  const rawFeedback = useSelector(selectNurseStayFeedback);
  const loading = useSelector(selectNurseStayFeedbackLoading);
  const saving = useSelector(selectNurseStayFeedbackSaving);
  const saveSuccess = useSelector(selectNurseStayFeedbackSuccess);

  // Normalize feedback data
  const feedbackData = useMemo(() => {
    return rawFeedback?.data || rawFeedback || {};
  }, [rawFeedback]);

  const admission = useMemo(() => {
    return feedbackData.admission || {};
  }, [feedbackData]);

  // Header display date
  const [displayDate, setDisplayDate] = useState("4 Nov");

  // Patient Info
  const [patientName, setPatientName] = useState(
    passedPatient.patient_name || passedPatient.name || "Kriti Balaji"
  );
  const [patientCode, setPatientCode] = useState(
    passedPatient.patient_code || passedPatient.code || "PAT123456"
  );

  // Ratings for section 1
  const [ratings, setRatings] = useState({
    overall_stay: "Excellent",
    room_comfort: "Good",
    cleanliness: "Excellent",
    nursing_care: "Excellent",
    doctors: "Excellent",
    food: "Good",
    therapies: "Excellent",
    discharge_process: "Good",
  });

  // Choices for section 2
  const [choices, setChoices] = useState({
    recommend_hospital: "Yes",
    would_return: "Yes",
    attendant_support: "Good",
  });

  // Comments for section 3
  const [comments, setComments] = useState(
    "Therapies helped my back pain. Nurses were kind. Please serve dinner warmer."
  );

  // Determine if feedback is completed / submitted and should be read-only
  const isReadOnly = useMemo(() => {
    return Boolean(
      feedbackData?.is_submitted === true ||
      feedbackData?.is_completed === true ||
      feedbackData?.feedback_submitted === true ||
      feedbackData?.screen_1?.is_completed === true ||
      feedbackData?.initial_feedback_submitted === true ||
      feedbackData?.detailed_feedback_submitted === true ||
      feedbackData?.admission?.feedback_submitted === true ||
      feedbackData?.admission?.initial_feedback_submitted === true ||
      passedPatient?.feedback_submitted === true ||
      location.state?.isReadOnly === true
    );
  }, [feedbackData, passedPatient, location.state]);

  // Load Feedback data from API on mount
  useEffect(() => {
    if (admissionId) {
      dispatch(loadStayFeedback(admissionId));
    }
  }, [dispatch, admissionId]);

  // Populate from fetched API data when available
  useEffect(() => {
    if (feedbackData && Object.keys(feedbackData).length > 0) {
      const adm = feedbackData.admission || {};
      if (adm.patient_name || adm.name) {
        setPatientName(adm.patient_name || adm.name);
      }
      if (adm.patient_code || adm.patient_id) {
        setPatientCode(adm.patient_code || adm.patient_id);
      }
      if (adm.checkout_date_display) {
        setDisplayDate(adm.checkout_date_display);
      } else if (adm.checkout_date) {
        const d = new Date(adm.checkout_date);
        if (!isNaN(d.getTime())) {
          setDisplayDate(
            d.toLocaleDateString("en-GB", { day: "numeric", month: "short" })
          );
        }
      }

      // Populate Screen 1 fields
      const s1Fields = feedbackData.screen_1?.fields || {};
      if (Object.keys(s1Fields).length > 0) {
        setRatings((prev) => ({
          overall_stay: s1Fields.overall_stay || prev.overall_stay,
          room_comfort: s1Fields.room_comfort || prev.room_comfort,
          cleanliness: s1Fields.cleanliness || prev.cleanliness,
          nursing_care: s1Fields.nursing_care || prev.nursing_care,
          doctors: s1Fields.doctors || prev.doctors,
          food: s1Fields.food || prev.food,
          therapies: s1Fields.therapies || prev.therapies,
          discharge_process: s1Fields.discharge_process || prev.discharge_process,
        }));

        setChoices((prev) => ({
          recommend_hospital:
            s1Fields.recommend_hospital === false ||
            s1Fields.recommend_hospital === "No"
              ? "No"
              : "Yes",
          would_return:
            s1Fields.would_return === false || s1Fields.would_return === "No"
              ? "No"
              : "Yes",
          attendant_support: s1Fields.attendant_support || prev.attendant_support,
        }));

        if (s1Fields.comments) {
          setComments(s1Fields.comments);
        }
      }
    }
  }, [feedbackData]);

  // Handle successful submit
  useEffect(() => {
    if (saveSuccess) {
      toast.success("Checkout stay feedback submitted successfully!");
      dispatch(resetStayFeedbackSuccess());
      navigate("/nurse/ipd-patients?tab=discharged");
    }
  }, [saveSuccess, dispatch, navigate]);

  const handleRatingChange = (key, value) => {
    if (isReadOnly) return;
    setRatings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleChoiceChange = (key, value) => {
    if (isReadOnly) return;
    setChoices((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isReadOnly) {
      toast("Feedback is already completed and in read-only mode.");
      return;
    }

    if (!admissionId) {
      toast.error("Admission ID not found. Cannot submit feedback.");
      return;
    }

    // Retain or construct screen_2 / detail notes
    const screen2 = feedbackData.screen_2 || {};

    const payload = {
      // Primary Screen 1 ratings & choices
      overall_stay: ratings.overall_stay,
      room_comfort: ratings.room_comfort,
      cleanliness: ratings.cleanliness,
      nursing_care: ratings.nursing_care,
      doctors: ratings.doctors,
      food: ratings.food,
      therapies: ratings.therapies,
      discharge_process: ratings.discharge_process,
      recommend_hospital: choices.recommend_hospital,
      would_return: choices.would_return,
      attendant_support: choices.attendant_support,
      comments: comments,

      // Screen 2 notes (from backend or sensible defaults)
      overall_stay_note:
        screen2.rate_your_stay?.overall_stay?.note ||
        "I would stay here again",
      room_comfort_note:
        screen2.rate_your_stay?.room_comfort?.note ||
        "Bed was fine. Room was quiet.",
      cleanliness_note:
        screen2.rate_your_stay?.cleanliness?.note ||
        "Room and washroom were clean",
      nursing_care_note:
        screen2.rate_your_stay?.nursing_care?.note ||
        "Kind and prompt",
      doctors_note:
        screen2.rate_your_stay?.doctors?.note ||
        "Dr. Sharma explained the plan",
      food_note:
        screen2.rate_your_stay?.food?.note ||
        "Tasty. Dinner was a little cold.",
      therapies_note:
        screen2.rate_your_stay?.therapies?.note ||
        "Abhyanga and Kati Basti helped",
      discharge_process_note:
        screen2.rate_your_stay?.discharge_process?.note ||
        "Smooth and timely discharge",

      what_stood_out: screen2.what_stood_out || [
        {
          id: 1,
          title: "1. Therapies eased the pain",
          subtitle: "During the stay",
          checked: true,
          status: "Noted",
          note: "Abhyanga and Kati Basti",
        },
        {
          id: 2,
          title: "2. Nurses checked in often",
          subtitle: "Day and night",
          checked: true,
          status: "Noted",
          note: "Kind and prompt",
        },
        {
          id: 3,
          title: "3. Doctor explained each step",
          subtitle: "Dr. Sharma",
          checked: true,
          status: "Noted",
          note: "Clear treatment plan",
        },
        {
          id: 4,
          title: "4. Dinner arrived cold",
          subtitle: "One evening",
          checked: false,
          status: "Tell us",
          note: "",
        },
        {
          id: 5,
          title: "5. Discharge felt rushed",
          subtitle: "On the last day",
          checked: false,
          status: "Tell us",
          note: "",
        },
      ],

      recommend_hospital_checked:
        screen2.would_you_recommend?.recommend_hospital?.checked || false,
      would_return_checked:
        screen2.would_you_recommend?.would_return?.checked ?? true,
      attendant_support_checked:
        screen2.would_you_recommend?.attendant_support?.checked || false,
      anything_else_checked:
        screen2.would_you_recommend?.anything_else?.checked || false,

      stay_in_one_line: comments,
      stay_in_one_line_checked: false,
      follow_up_note: screen2.follow_up_note || "OPD review on 18 Nov is already booked",
      follow_up_checked: true,
    };

    dispatch(saveStayFeedback({ admissionId, payload }));
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#FDFBF9] dark:bg-[#1A1412] px-6 sm:px-8 py-7 font-sans">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="h-8 w-8 rounded-lg border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#201A17] flex items-center justify-center text-[#7D726B] hover:text-[#2C1810] cursor-pointer transition sm:hidden"
                title="Go Back"
              >
                <HiOutlineArrowLeft size={14} />
              </button>
              <h1 className="text-2xl font-bold text-[#2C1810] dark:text-[#EDE3DA] tracking-tight">
                {isReadOnly ? "View Stay Feedback" : "Stay feedback"}
              </h1>
              {isReadOnly && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E7F3EC] dark:bg-[#1A3326] text-[#2E7D32] dark:text-[#81C784]">
                  <HiOutlineCheckCircle size={14} />
                  <span>Completed (Read-only)</span>
                </span>
              )}
            </div>
            <p className="text-xs font-normal text-[#7D726B] dark:text-[#A8988D] mt-1">
              {isReadOnly
                ? "View recorded inpatient stay feedback for this patient."
                : "A short form about your inpatient stay. Rate each part, then add a comment."}
            </p>
          </div>

          {/* Date Selector Badge */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="relative inline-flex items-center gap-2 rounded-xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#201A17] px-3.5 py-1.5 text-xs font-semibold text-[#2C1810] dark:text-[#EDE3DA] shadow-xs">
              <HiOutlineCalendar size={14} className="text-[#8A7D75]" />
              <span>{displayDate}</span>
              <HiOutlineChevronDown size={12} className="text-[#8A7D75]" />
            </div>
          </div>
        </div>

        {/* Patient Name and Patient ID Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div>
            <label className="block text-xs font-semibold text-[#2C1810] dark:text-[#EDE3DA]">
              Patient Name
            </label>
            <input
              type="text"
              readOnly
              value={patientName}
              placeholder="e.g. Kriti Balaji"
              className="w-full rounded-xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#201A17] px-4 py-2.5 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none mt-1.5 cursor-default"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2C1810] dark:text-[#EDE3DA]">
              Patient ID
            </label>
            <input
              type="text"
              readOnly
              value={patientCode}
              placeholder="e.g. PAT123456"
              className="w-full rounded-xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#201A17] px-4 py-2.5 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none mt-1.5 cursor-default"
            />
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="rounded-2xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#201A17] p-6 sm:p-8 shadow-xs space-y-9">
            
            {/* SECTION 1: Rate each part of your stay */}
            <div>
              <h2 className="text-[15px] font-bold text-[#2C1810] dark:text-[#EDE3DA]">
                Rate each part of your stay
              </h2>
              <p className="text-xs text-[#7D726B] dark:text-[#A8988D] mt-0.5 mb-4">
                Choose one word for each question.
              </p>

              <div className="space-y-2.5">
                {STAY_QUESTIONS.map((q) => {
                  const currentValue = ratings[q.key];
                  return (
                    <div
                      key={q.key}
                      className="bg-[#FAF7F4] dark:bg-[#261E1A] rounded-2xl px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition"
                    >
                      <span className="text-xs sm:text-[13px] font-medium text-[#2C1810] dark:text-[#EDE3DA]">
                        {q.label}
                      </span>

                      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                        {RATING_OPTIONS.map((opt) => {
                          const isSelected = currentValue === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              disabled={isReadOnly}
                              onClick={() => handleRatingChange(q.key, opt)}
                              className={`rounded-full px-4 py-1.5 text-xs font-medium transition select-none ${
                                isSelected
                                  ? "border-2 border-[#2C1810] dark:border-[#EDE3DA] bg-white dark:bg-[#1C1613] text-[#2C1810] dark:text-[#EDE3DA] font-bold shadow-xs cursor-default"
                                  : isReadOnly
                                  ? "border border-transparent bg-transparent text-[#7D726B]/30 dark:text-[#A8988D]/30 cursor-default opacity-40"
                                  : "border border-transparent bg-transparent text-[#7D726B] dark:text-[#A8988D] hover:text-[#2C1810] dark:hover:text-[#EDE3DA] cursor-pointer"
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SECTION 2: A few choices */}
            <div>
              <h2 className="text-[15px] font-bold text-[#2C1810] dark:text-[#EDE3DA]">
                A few choices
              </h2>
              <p className="text-xs text-[#7D726B] dark:text-[#A8988D] mt-0.5 mb-4">
                Tap Yes or No, then rate the attendant.
              </p>

              <div className="space-y-2.5">
                {/* Recommend */}
                <div className="bg-[#FAF7F4] dark:bg-[#261E1A] rounded-2xl px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition">
                  <span className="text-xs sm:text-[13px] font-medium text-[#2C1810] dark:text-[#EDE3DA]">
                    Would you recommend us to family and friends?
                  </span>
                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    {YES_NO_OPTIONS.map((opt) => {
                      const isSelected = choices.recommend_hospital === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          disabled={isReadOnly}
                          onClick={() => handleChoiceChange("recommend_hospital", opt)}
                          className={`rounded-full px-4 py-1.5 text-xs font-medium transition select-none ${
                            isSelected
                              ? "border-2 border-[#2C1810] dark:border-[#EDE3DA] bg-white dark:bg-[#1C1613] text-[#2C1810] dark:text-[#EDE3DA] font-bold shadow-xs cursor-default"
                              : isReadOnly
                              ? "border border-transparent bg-transparent text-[#7D726B]/30 dark:text-[#A8988D]/30 cursor-default opacity-40"
                              : "border border-transparent bg-transparent text-[#7D726B] dark:text-[#A8988D] hover:text-[#2C1810] dark:hover:text-[#EDE3DA] cursor-pointer"
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Return */}
                <div className="bg-[#FAF7F4] dark:bg-[#261E1A] rounded-2xl px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition">
                  <span className="text-xs sm:text-[13px] font-medium text-[#2C1810] dark:text-[#EDE3DA]">
                    Would you return if you need treatment again?
                  </span>
                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    {YES_NO_OPTIONS.map((opt) => {
                      const isSelected = choices.would_return === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          disabled={isReadOnly}
                          onClick={() => handleChoiceChange("would_return", opt)}
                          className={`rounded-full px-4 py-1.5 text-xs font-medium transition select-none ${
                            isSelected
                              ? "border-2 border-[#2C1810] dark:border-[#EDE3DA] bg-white dark:bg-[#1C1613] text-[#2C1810] dark:text-[#EDE3DA] font-bold shadow-xs cursor-default"
                              : isReadOnly
                              ? "border border-transparent bg-transparent text-[#7D726B]/30 dark:text-[#A8988D]/30 cursor-default opacity-40"
                              : "border border-transparent bg-transparent text-[#7D726B] dark:text-[#A8988D] hover:text-[#2C1810] dark:hover:text-[#EDE3DA] cursor-pointer"
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Attendant Support */}
                <div className="bg-[#FAF7F4] dark:bg-[#261E1A] rounded-2xl px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition">
                  <span className="text-xs sm:text-[13px] font-medium text-[#2C1810] dark:text-[#EDE3DA]">
                    How was the attendant support?
                  </span>
                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    {RATING_OPTIONS.map((opt) => {
                      const isSelected = choices.attendant_support === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          disabled={isReadOnly}
                          onClick={() => handleChoiceChange("attendant_support", opt)}
                          className={`rounded-full px-4 py-1.5 text-xs font-medium transition select-none ${
                            isSelected
                              ? "border-2 border-[#2C1810] dark:border-[#EDE3DA] bg-white dark:bg-[#1C1613] text-[#2C1810] dark:text-[#EDE3DA] font-bold shadow-xs cursor-default"
                              : isReadOnly
                              ? "border border-transparent bg-transparent text-[#7D726B]/30 dark:text-[#A8988D]/30 cursor-default opacity-40"
                              : "border border-transparent bg-transparent text-[#7D726B] dark:text-[#A8988D] hover:text-[#2C1810] dark:hover:text-[#EDE3DA] cursor-pointer"
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3: In your words */}
            <div>
              <h2 className="text-[15px] font-bold text-[#2C1810] dark:text-[#EDE3DA]">
                In your words
              </h2>
              <p className="text-xs text-[#7D726B] dark:text-[#A8988D] mt-0.5 mb-3">
                Anything else about the room, food, care, or discharge.
              </p>

              <textarea
                rows={4}
                readOnly={isReadOnly}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Therapies helped my back pain. Nurses were kind. Please serve dinner warmer."
                className={`w-full rounded-2xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#201A17] p-4 text-xs font-normal text-[#2C1810] dark:text-[#EDE3DA] outline-none min-h-[110px] resize-none transition leading-relaxed ${
                  isReadOnly
                    ? "cursor-default bg-[#FAF8F5]/60 dark:bg-[#231C18]"
                    : "focus:border-[#CBB4A5]"
                }`}
              />
            </div>

            {/* Footer Row */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-xs font-normal text-[#7D726B] dark:text-[#A8988D]">
                {isReadOnly
                  ? "This feedback has been submitted and is locked for editing."
                  : "Your feedback stays with the nursing team."}
              </p>

              {isReadOnly ? (
                <button
                  type="button"
                  onClick={() => navigate("/nurse/ipd-patients?tab=discharged")}
                  className="rounded-xl border border-[#D5C2B4] dark:border-[#4B392F] bg-white dark:bg-[#201A17] hover:bg-[#FAF4ED] text-[#4B2E2A] dark:text-[#EDE3DA] px-6 py-2.5 text-xs font-bold transition shadow-xs cursor-pointer flex items-center justify-center gap-2 self-end sm:self-auto"
                >
                  <HiOutlineArrowLeft size={14} />
                  <span>Back to Discharged Patients</span>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={saving || loading}
                  className="rounded-xl bg-[#7A4B3A] hover:bg-[#653D2F] active:scale-[0.99] text-white px-7 py-2.5 text-xs font-semibold tracking-wide transition shadow-xs cursor-pointer flex items-center justify-center gap-2 self-end sm:self-auto disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending feedback...</span>
                    </>
                  ) : (
                    <span>Send feedback</span>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default NurseStayFeedback;
