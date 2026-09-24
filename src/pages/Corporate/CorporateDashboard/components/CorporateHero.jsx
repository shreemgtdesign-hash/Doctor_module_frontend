import {
  HiOutlineArrowRight,
} from "react-icons/hi2";

import corporateImage
  from "../../../../assets/corporateimage.png"


const CorporateHero = () => {
  return (
    <section
      className="
        relative
        h-[220px]
        overflow-hidden
        rounded-[24px]
        bg-[#F7EFE5]
      "
    >

      {/* BACKGROUND IMAGE */}

      <img
        src={corporateImage}
        alt="Corporate wellness"
        className="
          absolute
          inset-0
          h-full
          w-full
          object-cover
        "
      />


      {/* SOFT OVERLAY */}

      <div
        className="
          absolute
          inset-0
          bg-gradient-to-r
          from-[#F8F0E6]
          via-[#F8F0E6]/90
          to-transparent
        "
      />


      {/* CONTENT */}

      <div
        className="
          relative
          z-10
          flex
          h-full
          max-w-[560px]
          flex-col
          justify-center
          px-8
        "
      >

        <h1
          className="
            text-[24px]
            font-bold
            leading-[1.35]
            text-[#4D2E23]
          "
        >
          Wellness at Work,
          <br />
          For a Healthier Tomorrow
        </h1>


        <p
          className="
            mt-2
            max-w-[390px]
            text-[15px]
            leading-6
            text-[#5D514A]
          "
        >
          Holistic programs designed to enhance
          well-being, productivity and happiness
        </p>


        <button
          type="button"
          className="
            mt-5
            flex
            h-[40px]
            w-[282px]
            items-center
            justify-center
            gap-2
            rounded-[14px]
            bg-[#8A563B]
            text-[13px]
            font-semibold
            text-white
            transition
            hover:bg-[#754630]
          "
        >
          Request an Event

          <HiOutlineArrowRight
            size={18}
          />
        </button>

      </div>

    </section>
  );
};

export default CorporateHero;