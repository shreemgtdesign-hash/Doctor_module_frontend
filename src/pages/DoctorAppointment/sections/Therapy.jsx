import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  HiOutlineMagnifyingGlass,
  HiOutlineMicrophone,
  HiOutlinePlus,
  HiOutlinePencilSquare,
  HiOutlineCalendarDays,
  HiOutlineClock,
  HiOutlineArrowRightOnRectangle,
  HiOutlineArrowLeft,
} from "react-icons/hi2";

import { useDispatch, useSelector } from "react-redux";

import {
  loadTherapies,
  searchTherapiesThunk,
  saveTherapyThunk,
  updateTherapyThunk,
  deleteTherapyThunk,
  loadDoctorsList,
} from "../../../redux/consultation/consultationThunk";
import ConsultationTimer from "../components/ConsultationTimer";


const Therapy = ({
  appointmentId,
  onBack,
  onContinue,
  consultationTimeLeft,
  consultationTimerStarted
}) => {

  const dispatch = useDispatch();

  // ==========================================
  // SEARCH
  // ==========================================

  const [search, setSearch] = useState("");
  const [noOfDays, setNoOfDays] = useState("");
  const [showDropdown, setShowDropdown] =
    useState(false);

  const searchRef = useRef(null);


  // ==========================================
  // EDITING
  // ==========================================

  const [editing, setEditing] =
    useState(false);

  const [
    editableTherapies,
    setEditableTherapies,
  ] = useState([]);


  // ==========================================
  // SAVE LOADING
  // ==========================================

  const [saving, setSaving] =
    useState(false);


  // ==========================================
  // REDUX
  // ==========================================
  const therapyCategories = [
    "Treatments",
    "Rejuvenation",
    "Anorectal care",
    "Panchakarma",
    "Pain care",
  ];
  const {
    therapy,
    therapySearch,
    doctorsList,
  } = useSelector(
    (state) => state.consultation
  );


  // ==========================================
  // TOTAL
  // ==========================================

  const total =
    Number(therapy?.total || 0);


  // ==========================================
  // KEEP LOCAL LIST IN SYNC
  // ==========================================

  useEffect(() => {

    const items = (therapy?.items || []).map(
      (item) => ({
        ...item,

        category:
          item.category || "Treatments",
      })
    );

    setEditableTherapies(items);

  }, [therapy?.items]);


  // ==========================================
  // LOAD THERAPIES
  // ==========================================

  useEffect(() => {

    if (!appointmentId) {
      return;
    }

    dispatch(
      loadTherapies(appointmentId)
    );

  }, [
    appointmentId,
    dispatch,
  ]);


  // ==========================================
  // LOAD DOCTORS FOR SELECT DOCTOR
  // GET /prescriptions/doctors
  // ==========================================

  useEffect(() => {
    dispatch(loadDoctorsList());
  }, [dispatch]);

  // SEARCH THERAPIES
  // ==========================================

  useEffect(() => {

    if (!search.trim()) {

      setShowDropdown(false);

      return;
    }

    dispatch(
      searchTherapiesThunk(search)
    );

    setShowDropdown(true);

  }, [
    search,
    dispatch,
  ]);


  // ==========================================
  // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  // ==========================================

  useEffect(() => {

    const handleOutsideClick = (event) => {

      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {

        setShowDropdown(false);

      }

    };


    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );


    return () => {

      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );

    };

  }, []);


  // ==========================================
  // ADD THERAPY
  // ==========================================

  const addTherapy = async (
    selectedTherapy
  ) => {

    if (!selectedTherapy) {
      return;
    }

    try {
      // Keep newly selected therapy locally first.
      // Doctor is selected on the therapy card, then the
      // actual POST /visits/{appointmentId}/therapies is
      // triggered from Save & Continue with doctor_name.
      const newTherapy = {
        isNew: true,
        treatment_id: selectedTherapy.id,
        treatment_name:
          selectedTherapy.name ||
          selectedTherapy.treatment_name ||
          "Therapy",
        description:
         
          selectedTherapy.notes ||
          "No description available",
        image_url:
          selectedTherapy.image_url || "",
        amount: Number(
          selectedTherapy.daycare_price || 0
        ),
        booking_date: new Date()
          .toISOString()
          .split("T")[0],
        slot_time: "15:30:00",
        notes: "",
        doctor_prescription_therpay_notes: "",
        no_of_days: Number(noOfDays) || 0,
        category:
          selectedTherapy.category ||
          "Treatments",
        doctor_name: "",
      };

      console.log(
        "Adding therapy locally:",
        newTherapy
      );

      setEditableTherapies((prev) => [
        ...prev,
        newTherapy,
      ]);

      setSearch("");
      setShowDropdown(false);
      setNoOfDays("");

    } catch (error) {
      console.error(
        "Failed to add therapy:",
        error
      );
    }
  };


  // ==========================================
  // UPDATE THERAPY
  // ==========================================

  const updateTherapy = (
    index,
    key,
    value
  ) => {

    setEditableTherapies(
      (prev) =>

        prev.map(
          (item, i) =>

            i === index
              ? {
                ...item,
                [key]: value,
              }
              : item
        )
    );

  };


  // ==========================================
  // SAVE ALL EDITED THERAPIES
  // ==========================================
  const deleteTherapy = async (therapyId) => {
    if (!therapyId) return;

    try {
      await dispatch(
        deleteTherapyThunk(therapyId)
      ).unwrap();

      // No need to reload the entire component.
      // Redux slice removes the deleted item.
    } catch (error) {
      console.error(
        "Failed to delete therapy:",
        error
      );
    }
  };
  const saveAll = async () => {

    try {

      setSaving(true);

      // --------------------------------------
      // SAVE NEW + UPDATE EXISTING THERAPIES
      // --------------------------------------

      for (const item of editableTherapies) {

        if (item.isNew || !item.id) {
          // --------------------------------------
          // POST /visits/{appointmentId}/therapies
          // --------------------------------------

          const payload = {
            treatment_id:
              item.treatment_id,

            booking_date:
              item.booking_date
                ?.split("T")[0],

            slot_time:
              item.slot_time || "15:30:00",

            doctor_prescription_therpay_notes:
              item.doctor_prescription_therpay_notes ||
              item.notes ||
              "",

            no_of_days:
              Number(item.no_of_days || 0),

            category:
              item.category || "Treatments",

            doctor_name:
              item.doctor_name || "",
          };

          console.log(
            "POST Add Therapy payload:",
            payload
          );

          await dispatch(
            saveTherapyThunk({
              appointmentId,
              payload,
            })
          ).unwrap();

        } else {
          // --------------------------------------
          // PUT existing therapy
          // --------------------------------------

          await dispatch(
            updateTherapyThunk({
              therapyId:
                item.id,

              payload: {
                booking_date:
                  item.booking_date
                    ?.split("T")[0],

                slot_time:
                  item.slot_time,

                amount:
                  Number(item.amount || 0),

                notes:
                  item.notes || "",

                no_of_days:
                  Number(
                    item.no_of_days ||
                    item.days_count ||
                    0
                  ),

                category:
                  item.category || "Treatments",

                doctor_name:
                  item.doctor_name || "",
              },
            })
          ).unwrap();
        }
      }

      // --------------------------------------
      // RELOAD FROM BACKEND
      // --------------------------------------

      await dispatch(
        loadTherapies(
          appointmentId
        )
      ).unwrap();

      setEditing(false);

      if (onContinue) {
        onContinue();
      }

    } catch (error) {

      console.error(
        "Failed to save therapies:",
        error
      );

    } finally {

      setSaving(false);

    }
  };

  // ==========================================
  // FORMAT DATE

  // ==========================================

  const formatDate = (
    date
  ) => {

    if (!date) {
      return "--";
    }

    return new Date(
      date
    ).toLocaleDateString(
      "en-US",
      {
        month: "long",
        day: "numeric",
      }
    );

  };


  // ==========================================
  // FORMAT TIME
  // ==========================================

  const formatTime = (
    time
  ) => {

    if (!time) {
      return "--";
    }

    const [
      h,
      m,
    ] = time.split(":");


    const hour =
      Number(h);


    return `${((hour + 11) % 12) + 1
      }:${m} ${hour >= 12
        ? "PM"
        : "AM"
      }`;

  };


  // ==========================================
  // RENDER
  // ==========================================

  return (

    <div className="mt-6">


      {/* ===================================== */}
      {/* HEADER */}
      {/* ===================================== */}

      <div className="flex justify-between">
        <div>
          <h2 className="
          text-[24px]
          font-bold
          text-[#4D2E23]
        ">
            Therapy
          </h2>


          <p className="
          mt-1
          text-[15px]
          text-[#5D514A]
        ">
            Add and manage Therapies
          </p>
        </div>

        {consultationTimerStarted && (
          <ConsultationTimer
            timeLeft={
              consultationTimeLeft
            }
          />
        )}

      </div>


      {/* ===================================== */}
      {/* SEARCH */}
      {/* ===================================== */}

      <div
        ref={searchRef}
        className="
          relative
          mt-8
        "
      >

        <div className="
          flex
          h-12
          items-center
          rounded-full
          border
          border-[#E8D9CF]
          bg-white
          px-4
        ">

          <HiOutlineMagnifyingGlass
            className="
              text-[#4D2E23]
            "
            size={28}
          />


          <input
            value={search}

            onChange={(e) => {

              setSearch(
                e.target.value
              );

              setShowDropdown(
                true
              );

            }}

            onFocus={() => {

              if (
                search.trim()
              ) {

                setShowDropdown(
                  true
                );

              }

            }}

            placeholder="Search by Therapy"

            className="
              ml-5
              flex-1
              text-[20px]
              outline-none
              placeholder:text-[#8D8D8D]
            "
          />


          <HiOutlineMicrophone
            className="
              text-[#4D2E23]
            "
            size={28}
          />

        </div>


        {/* ================================= */}
        {/* SEARCH DROPDOWN */}
        {/* ================================= */}

        {showDropdown &&
          search.trim() &&
          therapySearch?.length > 0 && (

            <div className="
              absolute
              left-0
              right-0
              z-50
              mt-3
              max-h-80
              overflow-y-auto
              rounded-3xl
              border
              border-[#E7DBD3]
              bg-white
              shadow-xl
            ">

              {therapySearch.map(
                (item) => (

                  <button
                    key={item.id}

                    type="button"

                    onClick={() =>
                      addTherapy(
                        item
                      )
                    }

                    className="
                      flex
                      w-full
                      items-center
                      gap-3
                      border-b
                      border-[#EFE7E1]
                      p-3
                      text-left
                      hover:bg-[#FFF8F2]
                      last:border-b-0
                    "
                  >

                    {item.image_url ? (

                      <img
                        src={
                          item.image_url
                        }
                        alt=""
                        className="
                          h-16
                          w-16
                          rounded-xl
                          object-cover
                        "
                      />

                    ) : (

                      <div className="
                        flex
                        h-16
                        w-16
                        items-center
                        justify-center
                        rounded-xl
                        bg-[#FFF0E5]
                        text-[#8A563B]
                      ">
                        <HiOutlinePlus
                          size={26}
                        />
                      </div>

                    )}


                    <div>

                      <h3 className="
                        font-semibold
                        text-[#4D2E23]
                      ">
                        {item.name}
                      </h3>


                      <p className="
                        text-sm
                        text-gray-500
                      ">
                        ₹
                        {Number(
                          item.daycare_price || 0
                        ).toLocaleString()}
                      </p>

                    </div>

                  </button>

                )
              )}

            </div>

          )}


        {/* ================================= */}
        {/* NO SEARCH RESULTS */}
        {/* ================================= */}

        {showDropdown &&
          search.trim() &&
          therapySearch?.length === 0 && (

            <div className="
              absolute
              left-0
              right-0
              z-50
              mt-3
              rounded-3xl
              border
              border-[#E7DBD3]
              bg-white
              p-6
              text-center
              shadow-xl
            ">

              <p className="
                text-[#8B7A70]
              ">
                No therapies found
              </p>

            </div>

          )}

      </div>


      {/* ===================================== */}
      {/* THERAPY LIST HEADER */}
      {/* ===================================== */}

      <div className="
        mt-8
        flex
        items-center
        justify-between
      ">

        <h2 className="
          text-[24px]
          font-bold
          text-[#4D2E23]
        ">
          Therapy List
        </h2>


        <div className="
          flex
          items-center
          gap-10
        ">


          {/* EDIT */}

          <button
            type="button"

            onClick={() =>
              setEditing(
                !editing
              )
            }

            className="
              flex
              items-center
              gap-2
              text-[15px]
              font-semibold
              text-[#4D2E23]
            "
          >

            <HiOutlinePencilSquare
              size={24}
            />

            Edit

          </button>


          {/* ADD */}

          <button
            type="button"

            onClick={() => {

              setShowDropdown(
                true
              );

              document
                .querySelector(
                  'input[placeholder="Search by Therapy"]'
                )
                ?.focus();

            }}

            className="
              flex
              items-center
              gap-2
              text-[15px]
              font-semibold
              text-[#4D2E23]
            "
          >

            <HiOutlinePlus
              size={24}
            />

            Add

          </button>

        </div>

      </div>


      {/* ===================================== */}
      {/* THERAPY LIST */}
      {/* ===================================== */}

      <div className="
        mt-8
        overflow-hidden
        rounded-[34px]
        border
        border-[#E7DBD3]
        bg-white
      ">


        {/* ================================= */}
        {/* NO THERAPIES */}
        {/* ================================= */}

        {editableTherapies.length === 0 ? (

          <div className="
            flex
            min-h-[220px]
            flex-col
            items-center
            justify-center
            px-6
            py-10
            text-center
          ">

            <div className="
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-full
              bg-[#FFF0E5]
              text-[#8A563B]
            ">

              <HiOutlinePlus
                size={28}
              />

            </div>


            <h3 className="
              mt-4
              text-[20px]
              font-semibold
              text-[#4D2E23]
            ">
              No therapies added
            </h3>


            <p className="
              mt-2
              text-[15px]
              text-[#8B7A70]
            ">
              Search and add a therapy
              to this patient's consultation.
            </p>

          </div>

        ) : (

          editableTherapies.map(
            (item, index) => (

              <div
                key={item.id}

                className="
                  border-b
                  border-[#ECE2DA]
                  px-4
                  py-5
                  last:border-b-0
                "
              >

                <div className="
                  flex
                  items-start
                  justify-between
                ">


                  {/* LEFT */}

                  <div className="
                    flex
                    gap-6
                  ">


                    {/* IMAGE */}

                    {item.image_url ? (

                      <img
                        src={
                          item.image_url
                        }
                        alt=""
                        className="
                          h-24
                          w-24
                          rounded-3xl
                          object-cover
                        "
                      />

                    ) : (

                      <div className="
                        flex
                        h-24
                        w-24
                        items-center
                        justify-center
                        rounded-3xl
                        bg-[#FFF0E5]
                        text-[#8A563B]
                      ">

                        <HiOutlinePlus
                          size={30}
                        />

                      </div>

                    )}


                    <div>


                      {/* NAME */}
                   <div className="flex w-full justify-between items-center gap-4">
                      <h3 className="
                        text-[20px]
                        font-bold
                        text-[#4D2E23]
                      ">
                        {
                          item.treatment_name
                        }
                      </h3>

                       <div className="flex items-center gap-3">
                         <select
                           value={item.doctor_name || ""}
                           onChange={(e) =>
                             updateTherapy(
                               index,
                               "doctor_name",
                               e.target.value
                             )
                           }
                           className="
                             h-[36px]
                             w-[180px]
                             rounded-xl
                             border
                             border-[#E8D9CF]
                             bg-white
                             px-4
                             text-[14px]
                             font-semibold
                             text-[#4D2E23]
                             outline-none
                             cursor-pointer
                             focus:border-[#8A563B]
                           "
                         >
                           <option value="">
                             Select Doctor
                           </option>

                           {(doctorsList || []).map((doctor) => {
                             const doctorId =
                               doctor.doctor_id || doctor.id;

                             const doctorName =
                               doctor.doctor_name ||
                               doctor.name ||
                               doctor.select_doctor ||
                               "";

                             return (
                               <option
                                 key={doctorId}
                                 value={doctorName}
                               >
                                 {doctorName}
                               </option>
                             );
                           })}
                         </select>

                         <select
                           value={item.category || "Treatments"}
                           onChange={(e) =>
                             updateTherapy(
                               index,
                               "category",
                               e.target.value
                             )
                           }
                           className="
                             h-[36px]
                             w-[160px]
                             rounded-xl
                             border
                             border-[#E8D9CF]
                             bg-white
                             px-4
                             text-[14px]
                             font-semibold
                             text-[#4D2E23]
                             outline-none
                             cursor-pointer
                             focus:border-[#8A563B]
                           "
                         >
                           {therapyCategories.map((category) => (
                             <option
                               key={category}
                               value={category}
                             >
                               {category}
                             </option>
                           ))}
                         </select>
                       </div>
</div>







                      {/* DESCRIPTION */}

                      <p className="
                        mt-2
                        max-w-xl
                        text-[15px]
                        leading-7
                        text-[#808080]
                      ">
                        {
                          item.description ||
                          item.notes ||
                          "No description available"
                        }
                      </p>


                      {/* INFO */}

                      {/* INFO */}
                      <div className="
                       mt-6
                       flex
                       items-center
                       gap-10
                     ">

                        {/* DURATION */}
                        <div className="
                         flex
                         items-center
                         gap-2
                       ">

                          <HiOutlineClock
                            className="
                             text-[#A16D18]
                           "
                            size={22}
                          />

                          <span className="
                           text-[15px]
                           font-medium
                         ">
                            {
                              item.duration_minutes ||
                              45
                            }{" "}
                            min
                          </span>

                        </div>


                        {/* DATE / TIME */}
                        <div className="
                         flex
                         items-center
                         gap-2
                       ">

                          <HiOutlineCalendarDays
                            className="
                             text-[#A16D18]
                           "
                            size={22}
                          />

                          {editing ? (

                            <div className="
                             flex
                             gap-2
                           ">

                              <input
                                type="date"
                                value={
                                  item.booking_date
                                    ?.split("T")[0] || ""
                                }
                                onChange={(e) =>
                                  updateTherapy(
                                    index,
                                    "booking_date",
                                    e.target.value
                                  )
                                }
                                className="
                                 rounded-lg
                                 border
                                 border-[#E7DBD3]
                                 p-2
                               "
                              />

                              <input
                                type="time"
                                value={
                                  item.slot_time || ""
                                }
                                onChange={(e) =>
                                  updateTherapy(
                                    index,
                                    "slot_time",
                                    e.target.value
                                  )
                                }
                                className="
                                 rounded-lg
                                 border
                                 border-[#E7DBD3]
                                                      p-2
                               "
                              />

                            </div>

                          ) : (

                            <span className="
                             text-[15px]
                             font-medium
                           ">
                              {
                                formatDate(
                                  item.booking_date
                                )
                              }{" "}

                              {
                                formatTime(
                                  item.slot_time
                                )
                              }
                            </span>

                          )}

                        </div>


                        {/* NO OF DAYS */}
                        {/* NO OF DAYS */}
                        <div className="flex items-center gap-2">

                          <HiOutlineCalendarDays
                            className="text-[#A16D18]"
                            size={22}
                          />

                          {editing ? (

                            <input
                              type="number"
                              min="1"
                              value={
                                item.no_of_days
                                  ? Number(
                                    String(item.no_of_days).replace(/\D/g, "")
                                  )
                                  : item.days_count || ""
                              }
                              onChange={(e) =>
                                updateTherapy(
                                  index,
                                  "no_of_days",
                                  e.target.value
                                )
                              }
                              className="
        w-[90px]
        rounded-lg
        border
        border-[#E7DBD3]
        px-3
        py-2
        text-[15px]
        font-medium
        outline-none
        focus:border-[#A16D18]
      "
                            />

                          ) : (

                            <span className="text-[15px] font-medium">
                              {item.no_of_days
                                ? item.no_of_days
                                : item.days_count
                                  ? `${item.days_count} Days`
                                  : "--"}
                            </span>

                          )}

                          {editing && (
                            <span className="text-[15px] font-medium text-[#59352C]">
                              Days
                            </span>
                          )}

                        </div>

                      </div>

                    </div>

                  </div>


                  {/* PRICE */}

                  {/* PRICE + DELETE */}

                  <div className="flex flex-col items-end gap-4">



                    {editing && (
                      <button
                        type="button"
                        onClick={() =>
                          deleteTherapy(item.id)
                        }
                        className="
        flex
        items-center
        gap-2
        rounded-xl
        border
        border-[#E8CFC4]
        px-4
        py-2
        text-[14px]
        font-semibold
        text-[#B42318]
        transition
        hover:bg-[#FDECEC]
      "
                      >
                        Delete
                      </button>
                    )}

                  </div>

                </div>


                {/* NOTES */}

                {editing && (

                  <textarea
                    value={
                      item.notes || ""
                    }

                    onChange={(e) =>
                      updateTherapy(
                        index,
                        "notes",
                        e.target.value
                      )
                    }

                    placeholder="Add notes..."

                    className="
                      mt-6
                      w-full
                      rounded-2xl
                      border
                      border-[#E7DBD3]
                      p-4
                      outline-none
                    "

                    rows={3}
                  />

                )}

              </div>

            )
          )

        )}


        {/* ================================= */}
        {/* TOTAL */}
        {/* ================================= */}

        <div className="
          flex
          items-center
          justify-between
          border-t
          border-[#ECE2DA]
          px-7
          py-7
        ">

          <h2 className="
            text-[24px]
            font-bold
            text-[#4D2E23]
          ">
            Total
          </h2>


          <h2 className="
            text-[20px]
            font-bold
            text-[#4D2E23]
          ">
            ₹
            {total.toLocaleString()}
          </h2>

        </div>

      </div>


      {/* ===================================== */}
      {/* BOTTOM ACTION BUTTONS */}
      {/* ===================================== */}

      <div className="
        mt-8
        flex
        items-center
        gap-6
      ">


        {/* ================================= */}
        {/* BACK */}
        {/* ================================= */}

        <button
          type="button"

          onClick={() => {

            if (onBack) {
              onBack();
            }

          }}

          disabled={saving}

          className="
            flex
            h-20
            flex-1
            items-center
            justify-center
            gap-3
            rounded-[24px]
            border
            border-[#E3D2C7]
            bg-[#FFFDFB]
            text-[20px]
            font-semibold
            text-[#4D2E23]
            transition
            hover:bg-[#FFF5EE]
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >

          <HiOutlineArrowLeft
            size={24}
          />

          Back

        </button>


        {/* ================================= */}
        {/* SAVE & CONTINUE */}
        {/* ================================= */}

        <button
          type="button"

          onClick={saveAll}

          disabled={saving}

          className="
            flex
            h-20
            flex-1
            items-center
            justify-center
            gap-4
            rounded-[24px]
            bg-[#8A563B]
            text-[20px]
            font-semibold
            text-white
            transition
            hover:bg-[#754630]
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >

          <HiOutlineArrowRightOnRectangle
            size={24}
          />

          {saving
            ? "Saving..."
            : "Save & Continue"}

        </button>

      </div>

    </div>

  );

};


export default Therapy;