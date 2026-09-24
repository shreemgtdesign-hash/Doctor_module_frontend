import {
  HiOutlineClock,
  HiOutlineMapPin,
  HiOutlineUserGroup,
  HiOutlineArrowRight,
} from "react-icons/hi2";


const EventCard = ({
  event,
}) => {

  const isCompleted =
    event?.status === "Completed";


  return (
    <div
      className="
        rounded-[18px]
        border
        border-[#E8D9CF]
        bg-[#FFFCF9]
        p-4
        transition
        hover:shadow-md
      "
    >

      {/* TOP */}

      <div
        className="
          flex
          items-start
          gap-3
        "
      >

        {/* DATE */}

        <div
          className="
            flex
            h-[62px]
            w-[66px]
            flex-shrink-0
            flex-col
            items-center
            justify-center
            rounded-[9px]
            bg-[#F8F0E5]
          "
        >

          <span
            className="
              text-[12px]
              font-medium
              uppercase
              text-[#8A563B]
            "
          >
            {event?.date_badge?.month}
          </span>

          <span
            className="
              text-[25px]
              font-bold
              leading-6
              text-[#8A563B]
            "
          >
            {event?.date_badge?.day}
          </span>

        </div>


        {/* EVENT IMAGE */}

        <div
          className="
            h-[62px]
            flex-1
            overflow-hidden
            rounded-[9px]
            bg-[#F1F1F1]
          "
        >
          {event?.image_url && (
            <img
              src={event.image_url}
              alt={event?.title || "Event"}
              className="
                h-full
                w-full
                object-cover
              "
            />
          )}
        </div>

      </div>


      {/* TITLE + STATUS */}

      <div
        className="
          mt-4
          flex
          items-start
          justify-between
          gap-3
        "
      >

        <h3
          className="
            text-[15px]
            font-semibold
            text-[#4D2E23]
          "
        >
          {event?.title}
        </h3>


        <span
          className={`
            rounded-full
            px-3
            py-1
            text-[11px]
            font-medium
            whitespace-nowrap

            ${
              isCompleted
                ? `
                  bg-[#DCFCE7]
                  text-[#166534]
                `
                : `
                  bg-[#FFE8BD]
                  text-[#8A4B00]
                `
            }
          `}
        >
          {event?.status}
        </span>

      </div>


      {/* TIME */}

      <div
        className="
          mt-3
          flex
          items-center
          gap-2
          text-[13px]
          text-[#39312D]
        "
      >

        <HiOutlineClock
          size={17}
          className="text-[#8A563B]"
        />

        {event?.time}

      </div>


      {/* LOCATION */}

      <div
        className="
          mt-3
          flex
          items-center
          gap-2
          text-[13px]
          text-[#39312D]
        "
      >

        <HiOutlineMapPin
          size={17}
          className="text-[#8A563B]"
        />

        {event?.location ||
          event?.mode}

      </div>


      {/* REGISTRATIONS */}

      <div
        className="
          mt-3
          flex
          items-center
          gap-2
          text-[13px]
          text-[#39312D]
        "
      >

        <HiOutlineUserGroup
          size={17}
          className="text-[#8A563B]"
        />

        {event?.registrations_label ||
          `${event?.registrations_count || 0} registrations`}

      </div>


      {/* DIVIDER */}

      <div
        className="
          my-4
          border-t
          border-[#EDE4DD]
        "
      />


      {/* DETAILS */}

      <button
        type="button"
        className="
          flex
          items-center
          gap-2
          text-[13px]
          font-semibold
          text-[#4D2E23]
          transition
          hover:text-[#8A563B]
        "
      >
        View Details

        <HiOutlineArrowRight
          size={17}
        />
      </button>

    </div>
  );
};


export default EventCard;