import {
useEffect,
useRef,
useState,
} from "react";
import {
HiOutlineMagnifyingGlass,
HiOutlineMicrophone,
HiOutlinePlus,
HiOutlineCalendarDays,
HiOutlineClock,
HiOutlineArrowRightOnRectangle,
HiOutlineArrowLeft,
HiChevronDown,
} from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import {
loadTherapies,
searchTherapiesThunk,
saveTherapyThunk,
updateTherapyThunk,
deleteTherapyThunk,
loadAssociateDoctors,
} from "../../../redux/consultation/consultationThunk";
import SpeechToTextTextarea from "../../../components/Layout/SpeechToTextTextarea";
import ConsultationSectionNav from "../components/ConsultationSectionNav";

const Therapy = ({
appointmentId,
onBack,
onContinue,
consultationTimeLeft,
consultationTimerStarted,
activeSection, setActiveSection,
}) => {
const dispatch = useDispatch();

const [openDoctorDropdown, setOpenDoctorDropdown] =
useState(null);

const [openCategoryDropdown, setOpenCategoryDropdown] =
useState(null);

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
associateDoctors = [],
} = useSelector(
(state) => state.consultation
);

// ==========================================
// TOTAL
// ==========================================

const total = editableTherapies.reduce(
(sum, item) => {
return sum + Number(item.amount || 0);
},
0
);

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
// LOAD ASSOCIATE DOCTORS FOR SELECT DOCTOR
// ==========================================

useEffect(() => {
if (!appointmentId) return;

dispatch(
loadAssociateDoctors(appointmentId)
);
}, [appointmentId, dispatch]);

// ==========================================
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

const addTherapy = async (selectedTherapy) => {
if (!selectedTherapy) {
return;
}

// Check whether this therapy is already selected
const therapyAlreadySelected = editableTherapies.some(
(item) =>
String(item.treatment_id) ===
String(selectedTherapy.id)
);

if (therapyAlreadySelected) {
alert("This therapy is already selected.");
return;
}

try {
const newTherapy = {
isNew: true,

treatment_id: selectedTherapy.id,

treatment_name:
selectedTherapy.name ||
selectedTherapy.treatment_name ||
"Therapy",

description:
selectedTherapy.notes ||
"",

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
// DELETE THERAPY
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

// ==========================================
// SAVE ALL EDITED THERAPIES
// ==========================================

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

<div>

<ConsultationSectionNav
activeSection={activeSection}
setActiveSection={setActiveSection}
/>

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

{therapySearch.map((item) => {

const isAlreadySelected =
editableTherapies.some(
(therapy) =>
String(therapy.treatment_id) ===
String(item.id)
);

return (

<button
key={item.id}
type="button"
disabled={isAlreadySelected}

onClick={() => {

if (!isAlreadySelected) {
addTherapy(item);
}

}}

className={`
flex
w-full
items-center
gap-3
border-b
border-[#EFE7E1]
p-3
text-left
last:border-b-0
${isAlreadySelected
? "cursor-not-allowed bg-[#F8F5F2] opacity-70"
: "hover:bg-[#FFF8F2]"
}
`}
>

{item.image_url ? (

<img
src={item.image_url}
alt=""
className="h-16 w-16 rounded-xl object-cover"
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

<HiOutlinePlus size={26} />

</div>

)}

<div className="flex-1">

<h3 className="
font-semibold
text-[#4D2E23]
">

{item.name}

</h3>

<p className="text-sm text-gray-500">

₹
{Number(
item.daycare_price || 0
).toLocaleString()}

</p>

</div>

{isAlreadySelected && (

<span className="
rounded-full
bg-[#FDEEDC]
px-3
py-1
text-xs
font-semibold
text-[#8A563B]
">

Already Selected

</span>

)}

</button>

);

})}

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

</div>

{/* ===================================== */}
{/* THERAPY LIST */}
{/* ===================================== */}

<div className="
  mt-8
  w-full
  max-w-full
  min-w-0
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
    w-full
    max-w-full
    min-w-0
    overflow-hidden
    border-b
    border-[#ECE2DA]
    px-4
    py-5
    last:border-b-0
  "
>

<div className="
  flex
  w-full
  max-w-full
  min-w-0
  flex-col
  gap-5
  overflow-hidden
  xl:flex-row
  xl:items-start
  xl:justify-between
">

{/* LEFT */}

<div className="
flex
min-w-0
flex-1
gap-4
sm:gap-6
">

{/* IMAGE */}

{item.image_url ? (

<img
src={
item.image_url
}
alt=""
className="
h-20
w-20
shrink-0
rounded-3xl
object-cover
sm:h-24
sm:w-24
"
/>

) : (

<div className="
flex
h-20
w-20
shrink-0
items-center
justify-center
rounded-3xl
bg-[#FFF0E5]
text-[#8A563B]
sm:h-24
sm:w-24
">

<HiOutlinePlus
size={30}
/>

</div>

)}

<div className="
  w-full
  max-w-full
  min-w-0
  flex-1
  overflow-hidden
">

{/* NAME */}

<div className="
  flex
  w-full
  max-w-full
  min-w-0
  flex-col
  gap-3
  overflow-hidden
  xl:flex-row
  xl:items-center
  xl:justify-between
">

<h3 className="
text-[20px]
font-bold
text-[#4D2E23]
">

{
item.treatment_name
}

</h3>

<div className="
  flex
  w-full
  max-w-full
  min-w-0
  flex-col
  gap-3
  sm:flex-row
  sm:items-center
  xl:w-auto
">

<div className="
relative
w-full
min-w-0
sm:w-[220px]
sm:max-w-[220px]
">

{/* SELECTED DOCTOR */}

<button
type="button"

onClick={() => {

setOpenDoctorDropdown(
openDoctorDropdown === index
? null
: index
);

setOpenCategoryDropdown(null);

}}

className="
flex
h-[42px]
w-full
items-center
justify-between
rounded-xl
border
border-[#E8D9CF]
bg-white
px-4
text-left
shadow-sm
transition
hover:border-[#CDB5A6]
"
>

<div className="min-w-0">

{item.doctor_name ? (

<p className="
truncate
text-[13px]
font-semibold
text-[#4D2E23]
">

{item.doctor_name}

</p>

) : (

<p className="
text-[13px]
font-medium
text-[#9A8D84]
">

Select Doctor

</p>

)}

</div>

<HiChevronDown
size={17}

className={`
ml-2
flex-shrink-0
text-[#7B665A]
transition-transform
${openDoctorDropdown === index
? "rotate-180"
: ""
}
`}

/>

</button>

{/* DOCTOR DROPDOWN */}

{openDoctorDropdown === index && (

<div
className="
absolute
right-0
top-[48px]
z-[100]
w-[min(320px,calc(100vw-48px))]
max-w-[320px]
overflow-hidden
rounded-2xl
border
border-[#E7DBD3]
bg-white
shadow-xl
"
>

{/* SELECT DOCTOR */}

<button
type="button"

onClick={() => {

updateTherapy(
index,
"doctor_name",
""
);

setOpenDoctorDropdown(null);

}}

className="
flex
w-full
border-b
border-[#F0E7E1]
px-4
py-3
text-left
text-[12px]
text-[#9A8D84]
transition
hover:bg-[#FFF8F2]
"
>

Select Doctor

</button>

{(associateDoctors || []).map((doctor) => {

const doctorId =
doctor.doctor_id || doctor.id;

const doctorName =
doctor.doctor_name ||
doctor.name ||
doctor.select_doctor ||
"";

const doctorCategory =
doctor.category || "";

const isSelected =
item.doctor_name === doctorName;

return (

<button
key={doctorId}
type="button"

onClick={() => {

updateTherapy(
index,
"doctor_name",
doctorName
);

setOpenDoctorDropdown(null);

}}

className={`
flex
w-full
items-center
justify-between
border-b
border-[#F2E8E2]
px-4
py-3
text-left
last:border-b-0
transition
hover:bg-[#FFF8F2]
${isSelected
? "bg-[#FFF8F2]"
: "bg-white"
}
`}
>

<div className="min-w-0">

<p className="
truncate
text-[13px]
font-semibold
text-[#4D2E23]
">

{doctorName}

</p>

{doctorCategory && (

<p className="
mt-1
truncate
text-[11px]
text-[#8D8179]
">

{doctorCategory}

</p>

)}

</div>

{isSelected && (

<span className="
ml-3
flex-shrink-0
text-[12px]
font-semibold
text-[#8A563B]
">

✓

</span>

)}

</button>

);

})}

</div>

)}

</div>

<div className="
relative
w-full
min-w-0
sm:w-[180px]
sm:max-w-[180px]
">

<button
type="button"

onClick={() => {

setOpenCategoryDropdown(
openCategoryDropdown === index
? null
: index
);

setOpenDoctorDropdown(null);

}}

className="
flex
h-[42px]
w-full
items-center
justify-between
rounded-xl
border
border-[#E8D9CF]
bg-white
px-4
text-left
shadow-sm
"
>

<span className="
truncate
text-[13px]
font-semibold
text-[#4D2E23]
">

{item.category || "Treatments"}

</span>

<HiChevronDown
size={17}

className={`
text-[#7B665A]
transition-transform
${openCategoryDropdown === index
? "rotate-180"
: ""
}
`}

/>

</button>

{openCategoryDropdown === index && (

<div
className="
absolute
right-0
top-[48px]
z-[100]
w-[min(200px,calc(100vw-48px))]
max-w-[200px]
overflow-hidden
rounded-2xl
border
border-[#E7DBD3]
bg-white
shadow-xl
"
>

{therapyCategories.map((category) => {

const isSelected =
item.category === category;

return (

<button
key={category}
type="button"

onClick={() => {

updateTherapy(
index,
"category",
category
);

setOpenCategoryDropdown(null);

}}

className={`
flex
w-full
items-center
justify-between
border-b
border-[#F2E8E2]
px-4
py-3
text-left
text-[12px]
last:border-b-0
hover:bg-[#FFF8F2]
${isSelected
? "bg-[#FFF8F2] font-semibold text-[#4D2E23]"
: "text-[#6F625B]"
}
`}
>

{category}

{isSelected && (

<span className="text-[#8A563B]">

✓

</span>

)}

</button>

);

})}

</div>

)}

</div>

</div>

</div>

{/* DESCRIPTION */}

<p className="
mt-2
w-full
max-w-xl
break-words
text-[15px]
leading-7
text-[#808080]
">

{
item.description ||
item.notes ||
""
}

</p>

{/* INFO */}

<div className="
mt-6
flex
flex-wrap
items-center
gap-x-6
gap-y-4
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

<div className="
flex
flex-wrap
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
w-full
min-w-0
rounded-lg
border
border-[#E7DBD3]
p-2
sm:w-auto
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
w-full
min-w-0
rounded-lg
border
border-[#E7DBD3]
p-2
sm:w-auto
"
/>

</div>

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

</div>

{/* NO OF DAYS */}

<div className="flex items-center gap-2">

<HiOutlineCalendarDays
className="text-[#A16D18]"
size={22}
/>

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
w-[80px]
shrink-0
rounded-lg
border
border-[#E7DBD3]
px-3
py-2
text-[15px]
font-medium
outline-none
"
/>

<span className="text-[15px] font-medium text-[#59352C]">

Days

</span>

</div>

</div>

</div>

</div>

{/* PRICE + DELETE */}

<div className="
flex
w-full
shrink-0
flex-row
items-center
justify-between
gap-4
xl:w-auto
xl:flex-col
xl:items-end
">

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

</div>

</div>

{/* NOTES */}

<SpeechToTextTextarea
value={item.notes || ""}

onChange={(value) =>
updateTherapy(
index,
"notes",
value
)
}

placeholder="Add notes..."
rows={3}
className="mt-6"
/>

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
text-[15px]
font-bold
text-[#9b614b]
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
flex-col
items-stretch
gap-4
sm:flex-row
sm:items-center
sm:gap-6
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
h-16
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
h-16
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