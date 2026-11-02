import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineChevronRight,
  HiOutlineClock,
  HiOutlineCheckCircle,
} from "react-icons/hi2";
import { FaPills, FaCheck } from "react-icons/fa";
import toast from "react-hot-toast";

import DashboardLayout from "../../../components/Layout/DashboardLayout";
import { loadPendingMedicines } from "../../../redux/nurse/nurseThunk";
import {
  selectNursePendingMedicines,
  selectNurseMedicinesLoading,
} from "../../../redux/nurse/nurseSlice";

const NursePendingMedicines = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const apiMedicines = useSelector(selectNursePendingMedicines);
  const loading = useSelector(selectNurseMedicinesLoading);

  const [filter, setFilter] = useState("all");

  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    dispatch(loadPendingMedicines());
  }, [dispatch]);

  useEffect(() => {
    if (Array.isArray(apiMedicines)) {
      setMedicines(apiMedicines);
    }
  }, [apiMedicines]);

  const handleAdminister = (id) => {
    setMedicines((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, given: true, status: "Given today" } : item
      )
    );
    toast.success("Medicine marked as administered!");
  };

  const dueNowCount = medicines.filter((m) => m.status === "Due now").length;
  const laterTodayCount = medicines.filter((m) => m.status === "Later today").length;
  const givenTodayCount = medicines.filter((m) => m.status === "Given today").length;
  const heldCount = medicines.filter((m) => m.status === "Held").length;

  const filteredList =
    filter === "all"
      ? medicines
      : medicines.filter((m) => m.status.toLowerCase() === filter.toLowerCase());

  const getStatusBadge = (status) => {
    switch (status) {
      case "Due now":
        return "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300";
      case "Overdue":
        return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
      case "Given today":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300";
      case "Held":
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
      default:
        return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300";
    }
  };

  return (
    <DashboardLayout role="nurse">
      <div className="min-h-screen bg-[#FDFBF9] dark:bg-[#1A1412] px-6 py-6 font-sans space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#7D726B] dark:text-[#A8988D]">
          <button
            type="button"
            onClick={() => navigate("/nurse/dashboard")}
            className="hover:text-[#4B2E2A] dark:hover:text-white transition font-medium cursor-pointer"
          >
            Dashboard
          </button>
          <HiOutlineChevronRight size={14} />
          <span className="font-bold text-[#2C1810] dark:text-[#EDE3DA]">
            Pending Medicines
          </span>
        </div>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button
            type="button"
            onClick={() => setFilter(filter === "Due now" ? "all" : "Due now")}
            className={`rounded-2xl p-5 text-left transition cursor-pointer ${
              filter === "Due now"
                ? "border-2 border-[#542F1E] dark:border-[#D5A794] bg-[#FFFDFC] dark:bg-[#251E1A] shadow-xs"
                : "border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#201A17] hover:border-[#CBB4A5]"
            }`}
          >
            <span className="text-2xl font-bold text-[#2C1810] dark:text-[#EDE3DA]">
              {dueNowCount}
            </span>
            <span className="block text-xs font-semibold text-[#8F6612] dark:text-[#F3CA68] mt-1">
              Due now
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilter(filter === "Later today" ? "all" : "Later today")}
            className={`rounded-2xl p-5 text-left transition cursor-pointer ${
              filter === "Later today"
                ? "border-2 border-[#542F1E] dark:border-[#D5A794] bg-[#FFFDFC] dark:bg-[#251E1A] shadow-xs"
                : "border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#201A17] hover:border-[#CBB4A5]"
            }`}
          >
            <span className="text-2xl font-bold text-[#2C1810] dark:text-[#EDE3DA]">
              {laterTodayCount}
            </span>
            <span className="block text-xs font-semibold text-[#1E5799] dark:text-[#88C6F7] mt-1">
              Later today
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilter(filter === "Given today" ? "all" : "Given today")}
            className={`rounded-2xl p-5 text-left transition cursor-pointer ${
              filter === "Given today"
                ? "border-2 border-[#542F1E] dark:border-[#D5A794] bg-[#FFFDFC] dark:bg-[#251E1A] shadow-xs"
                : "border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#201A17] hover:border-[#CBB4A5]"
            }`}
          >
            <span className="text-2xl font-bold text-[#2C1810] dark:text-[#EDE3DA]">
              {givenTodayCount}
            </span>
            <span className="block text-xs font-semibold text-[#15803D] dark:text-[#80E69B] mt-1">
              Given today
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilter(filter === "Held" ? "all" : "Held")}
            className={`rounded-2xl p-5 text-left transition cursor-pointer ${
              filter === "Held"
                ? "border-2 border-[#542F1E] dark:border-[#D5A794] bg-[#FFFDFC] dark:bg-[#251E1A] shadow-xs"
                : "border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#201A17] hover:border-[#CBB4A5]"
            }`}
          >
            <span className="text-2xl font-bold text-[#2C1810] dark:text-[#EDE3DA]">
              {heldCount}
            </span>
            <span className="block text-xs font-semibold text-[#7D726B] dark:text-[#A8988D] mt-1">
              Held
            </span>
          </button>
        </div>

        {/* Medicines List */}
        <div className="space-y-3">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-24 rounded-2xl bg-white dark:bg-[#241E1B] border border-[#E7DBD3] dark:border-[#382D25] animate-pulse"
                />
              ))}
            </div>
          ) : filteredList.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#E7DBD3] dark:border-[#382D25] bg-white/50 dark:bg-[#201A17]/50 p-12 text-center">
              <FaPills className="mx-auto text-3xl text-[#B3A499] mb-3" />
              <h4 className="text-sm font-bold text-[#4B2E2A] dark:text-[#EDE3DA]">
                No pending medicines found
              </h4>
            </div>
          ) : (
            filteredList.map((med) => (
              <div
                key={med.id}
                className="rounded-2xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:border-[#D5C2B4] transition"
              >
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-[15px] font-bold text-[#2C1810] dark:text-[#EDE3DA]">
                      {med.medicine_name}
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusBadge(
                        med.status
                      )}`}
                    >
                      {med.status}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#4B2E2A] dark:text-[#EDE3DA] mt-1">
                    {med.dosage}
                  </p>
                  <p className="text-xs text-[#7D726B] dark:text-[#A8988D] mt-0.5">
                    Patient: {med.patient_name} (ID: {med.patient_code}) · {med.room} · Scheduled: {med.scheduled_time}
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-3">
                  {med.given ? (
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#EBF8EE] text-[#15803D] text-xs font-bold">
                      <FaCheck size={11} /> Administered
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleAdminister(med.id)}
                      className="rounded-xl bg-[#6E3C27] hover:bg-[#582F1E] text-white px-5 py-2.5 text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-2"
                    >
                      <FaPills size={12} />
                      <span>Administer</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NursePendingMedicines;
