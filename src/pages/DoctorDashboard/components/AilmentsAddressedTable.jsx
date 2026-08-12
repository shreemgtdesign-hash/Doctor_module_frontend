import {
  HiOutlineArrowLeft,
  HiOutlineCalendar,
  HiChevronDown,
} from "react-icons/hi2";
import {
  FaHeartbeat,
  FaBone,
  FaBrain,
  FaLungs,
  FaEllipsisH,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const cards = [
  {
    title: "All",
    count: "1,024",
    icon: <FaEllipsisH />,
    active: true,
  },
  {
    title: "Diabetes",
    count: "312",
    icon: <FaHeartbeat />,
  },
  {
    title: "Orthopedics",
    count: "278",
    icon: <FaBone />,
  },
  {
    title: "Cardiac",
    count: "196",
    icon: <FaHeartbeat />,
  },
  {
    title: "Neurological",
    count: "86",
    icon: <FaBrain />,
  },
  {
    title: "Skin",
    count: "138",
    icon: <FaHeartbeat />,
  },
  {
    title: "Respiratory",
    count: "98",
    icon: <FaLungs />,
  },
  {
    title: "Digestive",
    count: "162",
    icon: <FaHeartbeat />,
  },
  {
    title: "Pediatric",
    count: "74",
    icon: <FaHeartbeat />,
  },
  {
    title: "Other",
    count: "104",
    icon: <FaEllipsisH />,
  },
];

const rows = [
  {
    ailment: "Diabetes",
    patient: "Meera Iyer",
    id: "1234567",
    date: "21st June, 2026",
    time: "10:00 AM",
    purpose: "Consultation",
    price: "₹1200",
  },
  {
    ailment: "Orthopedic",
    patient: "Rahul Sen",
    id: "1234567",
    date: "21st June, 2026",
    time: "11:00 AM",
    purpose: "Consultation",
    price: "₹1000",
  },
  {
    ailment: "Digestive",
    patient: "Meera Iyer",
    id: "1234567",
    date: "21st June, 2026",
    time: "2:00 PM",
    purpose: "Consultation",
    price: "₹1200",
  },
  {
    ailment: "Skin",
    patient: "Rahul Sen",
    id: "1234567",
    date: "21st June, 2026",
    time: "4:00 PM",
    purpose: "Follow-up",
    price: "₹1200",
  },
  {
    ailment: "Diabetes",
    patient: "Meera Iyer",
    id: "1234567",
    date: "21st June, 2026",
    time: "10:00 AM",
    purpose: "Consultation",
    price: "₹1200",
  },
  {
    ailment: "Respiratory",
    patient: "Rahul Sen",
    id: "1234567",
    date: "20th June, 2026",
    time: "11:00 AM",
    purpose: "Consultation",
    price: "₹1000",
  },
  {
    ailment: "Cardiac",
    patient: "Meera Iyer",
    id: "1234567",
    date: "20th June, 2026",
    time: "2:00 PM",
    purpose: "Follow-up",
    price: "₹1200",
  },
  {
    ailment: "Neurological",
    patient: "Rahul Sen",
    id: "1234567",
    date: "20th June, 2026",
    time: "4:00 PM",
    purpose: "Follow-up",
    price: "₹1200",
  },
];

const AilmentsAddressedTable = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8F6F3] px-8 py-6">
      {/* Back */}

      <button
        onClick={() => navigate("/doctordashboard")}
        className="flex items-center gap-2 text-[16px] font-semibold text-[#4D2E23] hover:text-[#7A4A35]"
      >
        <HiOutlineArrowLeft size={22} />
        Back to Dashboard
      </button>

      {/* Header */}

      <div className="mt-10 flex items-start justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-[#2F2F2F]">
            Ailments Addressed
          </h1>

          <p className="mt-1 text-[18px] text-[#777]">
            204 Total Consultations
          </p>
        </div>

        <button className="flex h-12 items-center gap-2 rounded-xl border border-[#E8D9CD] bg-white px-5 text-[16px] font-medium text-[#4D2E23]">
          <HiOutlineCalendar size={18} />
          This Week
          <HiChevronDown size={16} />
        </button>
      </div>

      {/* Summary Cards */}

      <div className="mt-8 grid grid-cols-5 gap-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className={`rounded-2xl bg-white border p-5 transition-all ${
              card.active
                ? "border-[#4D2E23] border-2"
                : "border-[#E7DBD3]"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[14px] text-[#4D2E23]">
                  {card.title}
                </p>

                <h2 className="mt-2 text-[22px] font-bold text-[#4D2E23]">
                  {card.count}
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFF1E5] text-[#7A4A35]">
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}

      <div className="mt-8 overflow-hidden rounded-[28px] border border-[#E7DBD3] bg-white">
        {/* Header */}

        <div className="grid grid-cols-[1.1fr_1.6fr_1.3fr_1fr_1.2fr_1fr] bg-[#FFF9F3]">
          {[
            "Ailment",
            "Patient Details",
            "Date",
            "Time",
            "Purpose",
            "Price",
          ].map((item) => (
            <div
              key={item}
              className="border-r border-b border-[#EFE2D7] px-6 py-5 text-center text-[15px] font-semibold text-[#4D2E23] last:border-r-0"
            >
              {item}
            </div>
          ))}
        </div>

        {/* Rows */}

        {rows.map((row, index) => (
          <div
            key={index}
            className="grid grid-cols-[1.1fr_1.6fr_1.3fr_1fr_1.2fr_1fr]"
          >
            <div className="flex items-center justify-center border-r border-[#EFE2D7] px-6 py-6 text-[16px] font-semibold text-[#4D2E23]">
              {row.ailment}
            </div>

            <div className="border-r border-[#EFE2D7] px-6 py-6">
              <h3 className="text-[16px] font-bold text-[#4D2E23]">
                {row.patient}
              </h3>

              <p className="mt-1 text-[14px] text-[#7C7C7C]">
                Patient ID: {row.id}
              </p>
            </div>

            <div className="flex items-center justify-center border-r border-[#EFE2D7] px-6 py-6 text-[16px] font-semibold text-[#4D2E23]">
              {row.date}
            </div>

            <div className="flex items-center justify-center border-r border-[#EFE2D7] px-6 py-6 text-[16px] font-semibold text-[#4D2E23]">
              {row.time}
            </div>

            <div className="flex items-center justify-center border-r border-[#EFE2D7] px-6 py-6 text-[16px] font-semibold text-[#4D2E23]">
              {row.purpose}
            </div>

            <div className="flex items-center justify-center px-6 py-6 text-[16px] font-bold text-[#4D2E23]">
              {row.price}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AilmentsAddressedTable;