import { useEffect, useState } from "react";
import {
  HiOutlineMagnifyingGlass,
  HiOutlineMicrophone,
  HiOutlinePlus,
  HiOutlinePencilSquare,
  HiOutlineCalendarDays,
  HiOutlineClock,
  HiOutlineArrowRightOnRectangle,
} from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import {
  loadTherapies,
  searchTherapiesThunk,
  saveTherapyThunk,
  updateTherapyThunk,
} from "../../../redux/consultation/consultationThunk";
const Therapy = ({ appointmentId }) => {
  const [search, setSearch] = useState("");

  const dispatch = useDispatch();

const {
  therapy,
  therapySearch,
} = useSelector(
  (state) => state.consultation
);

const total = therapy.total;
  const [showDropdown, setShowDropdown] = useState(false);

const [editing, setEditing] = useState(false);
const [editableTherapies, setEditableTherapies] = useState([]);


  
  useEffect(() => {
  setEditableTherapies(therapy.items || []);
}, [therapy.items]);
useEffect(() => {
  if (!search.trim()) {
    setShowDropdown(false);
    return;
  }

  dispatch(searchTherapiesThunk(search));
  setShowDropdown(true);
}, [search, dispatch]);

useEffect(() => {
  if (appointmentId) {
    dispatch(loadTherapies(appointmentId));
  }
}, [appointmentId, dispatch]);
  useEffect(() => {
  if (!search.trim()) return;

  dispatch(searchTherapiesThunk(search));
  setShowDropdown(true);
}, [search, dispatch]);

  const addTherapy = async (therapy) => {
  const payload = {
    treatment_id: therapy.id,
    booking_date: new Date().toISOString().split("T")[0],
    slot_time: "15:30:00",
    amount: Number(therapy.daycare_price),
    notes: "",
  };

  await dispatch(
    saveTherapyThunk({
      appointmentId,
      payload,
    })
  ).unwrap();

  dispatch(loadTherapies(appointmentId));

  setSearch("");
  setShowDropdown(false);
};

  const updateTherapy = (index, key, value) => {
  setEditableTherapies((prev) =>
    prev.map((item, i) =>
      i === index
        ? {
            ...item,
            [key]: value,
          }
        : item
    )
  );
};

  const saveAll = async () => {
  for (const item of editableTherapies) {
    await dispatch(
      updateTherapyThunk({
        therapyId: item.id,
        payload: {
          booking_date: item.booking_date?.split("T")[0],
          slot_time: item.slot_time,
          amount: Number(item.amount),
          notes: item.notes,
        },
      })
    ).unwrap();
  }

  dispatch(loadTherapies(appointmentId));

  setEditing(false);
};



  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });
  };

const formatTime = (time) => {
  const [h, m] = time.split(":");

  const hour = Number(h);

  return `${((hour + 11) % 12) + 1}:${m} ${
    hour >= 12 ? "PM" : "AM"
  }`;
};

return (
  <div className="mt-6">

    {/* Header */}
    <div>
      <h2 className="text-[24px] font-bold text-[#4D2E23]">
        Therapy
      </h2>

      <p className="mt-1 text-[15px] text-[#5D514A]">
        Add and manage Therapies
      </p>
    </div>

    {/* Search */}

    <div className="relative mt-8">

      <div className="flex h-12 items-center rounded-full border border-[#E8D9CF] bg-white px-4">

        <HiOutlineMagnifyingGlass
          className="text-[#4D2E23]"
          size={28}
        />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Therapy"
          className="ml-5 flex-1 text-[22px] outline-none placeholder:text-[#8D8D8D]"
        />

        <HiOutlineMicrophone
          className="text-[#4D2E23]"
          size={28}
        />

      </div>

      {showDropdown && therapySearch.length > 0 && (
        <div className="absolute z-50 mt-3 max-h-80 w-full overflow-y-auto rounded-3xl border border-[#E7DBD3] bg-white shadow-xl">

          {therapySearch.map((therapy) => (
            <button
              key={therapy.id}
              onClick={() => addTherapy(therapy)}
              className="flex w-full items-center gap-3 border-b border-[#EFE7E1] p-2 text-left hover:bg-[#FFF8F4]"
            >
              <img
                src={therapy.image_url}
                alt=""
                className="h-16 w-16 rounded-xl object-cover"
              />

              <div>

                <h3 className="font-semibold text-[#4D2E23]">
                  {therapy.name}
                </h3>

                <p className="text-sm text-gray-500">
                  ₹{therapy.daycare_price}
                </p>

              </div>

            </button>
          ))}

        </div>
      )}

    </div>

    {/* List Header */}

    <div className="mt-8 flex items-center justify-between">

      <h2 className="text-[24px] font-bold text-[#4D2E23]">
        Therapy List
      </h2>

      <div className="flex items-center gap-10">

        <button
          onClick={() => setEditing(!editing)}
          className="flex items-center gap-2 text-[15px] font-semibold text-[#4D2E23]"
        >
          <HiOutlinePencilSquare size={24} />
          Edit
        </button>

        <button
          onClick={() => setShowDropdown(true)}
          className="flex items-center gap-2 text-[15px] font-semibold text-[#4D2E23]"
        >
          <HiOutlinePlus size={24} />
          Add
        </button>

      </div>

    </div>

    {/* Therapy Card */}

    <div className="mt-8 overflow-hidden rounded-[34px] border border-[#E7DBD3] bg-white">

      {editableTherapies.map((therapy, index) => (

        <div
          key={therapy.id}
          className="border-b border-[#ECE2DA] px-4 py-5 last:border-b-0"
        >

          <div className="flex items-start justify-between">

            <div className="flex gap-6">

              <img
                src={therapy.image_url}
                alt=""
                className="h-24 w-24 rounded-3xl object-cover"
              />

              <div>

                <h3 className="text-[20px] font-bold text-[#4D2E23]">
                  {therapy.therapy_name}
                </h3>

                <p className="mt-2 max-w-xl text-[15px] leading-7 text-[#808080]">
                  {therapy.description ||
                    therapy.notes}
                </p>

                <div className="mt-6 flex items-center gap-10">

                  <div className="flex items-center gap-2">

                    <HiOutlineClock
                      className="text-[#A16D18]"
                      size={22}
                    />

                    <span className="text-[15px] font-medium">
                      {therapy.duration_minutes || 45} min
                    </span>

                  </div>

                  <div className="flex items-center gap-2">

                    <HiOutlineCalendarDays
                      className="text-[#A16D18]"
                      size={22}
                    />

                    {editing ? (
                      <div className="flex gap-2">

                        <input
                          type="date"
                          value={
                            therapy.booking_date?.split(
                              "T"
                            )[0]
                          }
                          onChange={(e) =>
                            updateTherapy(
                              index,
                              "booking_date",
                              e.target.value
                            )
                          }
                          className="rounded-lg border p-2"
                        />

                        <input
                          type="time"
                          value={therapy.slot_time}
                          onChange={(e) =>
                            updateTherapy(
                              index,
                              "slot_time",
                              e.target.value
                            )
                          }
                          className="rounded-lg border p-2"
                        />

                      </div>
                    ) : (
                      <span className="text-[15px] font-medium">
                        {formatDate(
                          therapy.booking_date
                        )}{" "}
                        {formatTime(
                          therapy.slot_time
                        )}
                      </span>
                    )}

                  </div>

                </div>

              </div>

            </div>

            <div className="text-right">

              <h2 className="text-[30px] font-bold text-[#4D2E23]">
                ₹{Number(therapy.amount).toLocaleString()}
              </h2>

            </div>

          </div>

          {editing && (
            <textarea
              value={therapy.notes}
              onChange={(e) =>
                updateTherapy(
                  index,
                  "notes",
                  e.target.value
                )
              }
              className="mt-6 w-full rounded-2xl border border-[#E7DBD3] p-4"
              rows={3}
            />
          )}

        </div>

      ))}

      <div className="flex items-center justify-between px-7 py-7">

        <h2 className="text-[30px] font-bold text-[#4D2E23]">
          Total
        </h2>

        <h2 className="text-[28px] font-bold text-[#4D2E23]">
          ₹{total.toLocaleString()}
        </h2>

      </div>

    </div>

    {/* Save */}

    <button
      onClick={saveAll}
      className="mt-16 flex h-20 w-full items-center justify-center gap-4 rounded-[24px] bg-[#8A563B] text-[24px] font-semibold text-white hover:bg-[#754630]"
    >
      <HiOutlineArrowRightOnRectangle size={28} />
      Save and Continue
    </button>

  </div>
);
  };
  export default Therapy;