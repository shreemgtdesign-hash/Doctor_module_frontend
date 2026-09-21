import {
  useEffect,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  loadPatientWellness,
} from "../../../redux/consultation/consultationThunk";


const fields = [
  {
    key: "bp",
    label: "BP",
    unit: "mmHg",
  },
  {
    key: "sugar",
    label: "Sugar",
    unit: "mg/dL",
  },
  {
    key: "pulse",
    label: "Pulse",
    unit: "bpm",
  },
  {
    key: "spo2",
    label: "SpO2",
    unit: "%",
  },
  {
    key: "temperature",
    label: "Temp.",
    unit: "C",
  },
  {
    key: "toxicity",
    label: "Toxicity",
    unit: "%",
  },
];


const JuniorVitals = ({
  patientId,
}) => {

  const dispatch =
    useDispatch();


  const {
    patientWellness,
  } = useSelector(
    (state) =>
      state.consultation
  );


  const [
    values,
    setValues,
  ] = useState({});


  useEffect(() => {

    if (!patientId) {
      return;
    }

    dispatch(
      loadPatientWellness({
        patientId,
        period: "today",
      })
    );

  }, [
    dispatch,
    patientId,
  ]);


  useEffect(() => {

    const vitals =
      patientWellness?.today ||
      patientWellness ||
      {};

    setValues({
      bp:
        vitals.bp || "",

      sugar:
        vitals.sugar || "",

      pulse:
        vitals.pulse || "",

      spo2:
        vitals.spo2 || "",

      temperature:
        vitals.temperature ||
        vitals.temp ||
        "",

      toxicity:
        vitals.toxicity ??
        vitals.body_toxicity ??
        "",
    });

  }, [
    patientWellness,
  ]);


  const handleChange = (
    key,
    value
  ) => {

    setValues(
      (prev) => ({
        ...prev,
        [key]: value,
      })
    );

  };


  return (

    <div
      className="
        rounded-2xl
        border
        border-[#E8DDD4]
        bg-white
        overflow-hidden
      "
    >

      <div
        className="
          grid
          grid-cols-3
        "
      >

        {fields.map(
          (field) => (

            <div
              key={
                field.key
              }
              className="
                border-r
                border-b
                border-[#E8DDD4]
                p-4
                last:border-r-0
              "
            >

              <p
                className="
                  text-[13px]
                  font-semibold
                  text-[#4D2E23]
                "
              >
                {field.label}
              </p>


              <div
                className="
                  mt-2
                  flex
                  items-center
                  gap-2
                "
              >

                <input
                  value={
                    values[
                      field.key
                    ] || ""
                  }
                  onChange={(
                    e
                  ) =>
                    handleChange(
                      field.key,
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    border-0
                    bg-transparent
                    text-center
                    text-[18px]
                    font-bold
                    text-[#4D2E23]
                    outline-none
                  "
                  placeholder="--"
                />

              </div>


              <p
                className="
                  text-center
                  text-[11px]
                  text-[#8B7A70]
                "
              >
                {field.unit}
              </p>

            </div>

          )
        )}

      </div>


      <div
        className="
          flex
          justify-end
          border-t
          border-[#E8DDD4]
          p-3
        "
      >

        <button
          type="button"
          className="
            rounded-xl
            bg-[#8A563B]
            px-5
            py-2
            text-[12px]
            font-semibold
            text-white
          "
        >
          Save Vitals
        </button>

      </div>

    </div>

  );

};


export default JuniorVitals;