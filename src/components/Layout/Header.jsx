import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  HiOutlineBell,
  HiOutlineChevronRight,

} from "react-icons/hi";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import { useNavigate } from "react-router-dom";
import { loadNotifications, markAllNotificationsRead, markNotificationRead } from "../../redux/notifications/notificationThiunk";



const Header = ({
  setSidebarOpen,
}) => {

  const dispatch = useDispatch();

  const navigate =
    useNavigate();

  const notificationRef =
    useRef(null);


  const [
    showNotifications,
    setShowNotifications,
  ] = useState(false);


  const user = JSON.parse(
    localStorage.getItem("user")
  );


  // ==================================================
  // REDUX
  // ==================================================

  const {
    notifications,
    unreadCount,
    loading,
  } = useSelector(
    (state) =>
      state.notifications
  );


  // ==================================================
  // LOAD NOTIFICATIONS
  // ==================================================

  useEffect(() => {

    dispatch(
      loadNotifications()
    );

  }, [dispatch]);


  // ==================================================
  // CLOSE DROPDOWN OUTSIDE CLICK
  // ==================================================

  useEffect(() => {

    const handleOutsideClick = (
      event
    ) => {

      if (
        notificationRef.current &&
        !notificationRef.current.contains(
          event.target
        )
      ) {

        setShowNotifications(false);

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


  // ==================================================
  // BELL CLICK
  // ==================================================

  const handleBellClick = () => {

    setShowNotifications(
      (previous) =>
        !previous
    );

  };


  // ==================================================
  // NOTIFICATION CLICK
  // ==================================================

  const handleNotificationClick = (
    notification
  ) => {

    // ----------------------------------------------
    // MARK AS READ
    // ----------------------------------------------

    if (
      notification?.id &&
      !notification?.is_read
    ) {

      dispatch(
        markNotificationRead(
          notification.id
        )
      );

    }


    // ----------------------------------------------
    // APPOINTMENT ID
    // ----------------------------------------------

    const appointmentId =
      notification?.data
        ?.appointment_id;


    // ----------------------------------------------
    // GO TO APPOINTMENT
    // ----------------------------------------------

    if (appointmentId) {

      setShowNotifications(
        false
      );

      navigate(
        `/frontoffice/upcoming-appointments/${appointmentId}`
      );

    }

  };


  // ==================================================
  // MARK ALL READ
  // ==================================================

  const handleMarkAllRead = () => {

    if (
      unreadCount === 0
    ) {
      return;
    }


    dispatch(
      markAllNotificationsRead()
    );

  };


  // ==================================================
  // FORMAT DATE
  // ==================================================

  const formatNotificationDate = (
    date
  ) => {

    if (!date) {
      return "";
    }


    const notificationDate =
      new Date(date);


    const now =
      new Date();


    const difference =
      now.getTime() -
      notificationDate.getTime();


    const minutes =
      Math.floor(
        difference /
        (1000 * 60)
      );


    if (
      minutes < 1
    ) {

      return "Just now";

    }


    if (
      minutes < 60
    ) {

      return `${minutes} min ago`;

    }


    const hours =
      Math.floor(
        minutes / 60
      );


    if (
      hours < 24
    ) {

      return `${hours} hr ago`;

    }


    const days =
      Math.floor(
        hours / 24
      );


    if (
      days < 7
    ) {

      return `${days} day${days > 1 ? "s" : ""} ago`;

    }


    return notificationDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  };


  return (

    <header
      className="
        flex
        border
        border-[#E4D9C580]
        h-24
        items-center
        justify-between
        bg-[#FFF8F2]
        pr-5
        shadow-sm
      "
    >

      {/* ================================= */}
      {/* LEFT */}
      {/* ================================= */}

      <div
        className="
          flex
          items-center
          gap-5
        "
      >

        {/* Sidebar Button */}

        <button
          type="button"
          onClick={() =>
            setSidebarOpen(true)
          }
          className="
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-r-3xl
            bg-[#FFEAD8]
          "
        >

          <HiOutlineChevronRight
            size={28}
          />

        </button>


        {/* ================================= */}
        {/* PROFILE + HEADER */}
        {/* ================================= */}

        <div
          className="
            flex
            items-center
            gap-4
          "
        >

          {/* Profile Image */}

          <div
            className="
              h-16
              w-16
              shrink-0
              overflow-hidden
              rounded-full
              border-2
              border-[#E7D5C8]
              bg-[#FFEAD8]
            "
          >

            {user?.profile_image ? (

              <img
                src={
                  user.profile_image
                }
                alt={
                  user?.name ||
                  "Doctor"
                }
                className="
                  h-full
                  w-full
                  object-cover
                "
              />

            ) : (

              <div
                className="
                  flex
                  h-full
                  w-full
                  items-center
                  justify-center
                  text-lg
                  font-semibold
                  text-[#6A3F2D]
                "
              >

                {user?.name
                  ?.charAt(0)
                  ?.toUpperCase() ||
                  "U"}

              </div>

            )}

          </div>


          {/* Header Text */}

          <div>

            <p
              className="
                text-xs
                uppercase
                tracking-[3px]
                text-gray-500
              "
            >
              Shree Ayurvedic group
            </p>

            <h1
              className="text-3xl"
              style={{
                fontFamily:
                  "Playfair Display",
              }}
            >

              Dhanwantaraye Namaha{" "}

              {user?.name ||
                "User"}

            </h1>

          </div>

        </div>

      </div>


      {/* ================================= */}
      {/* NOTIFICATION */}
      {/* ================================= */}

      <div
        ref={notificationRef}
        className="
          relative
          flex
          items-center
          justify-center
        "
      >

        {/* ================================= */}
        {/* BELL */}
        {/* ================================= */}

        <button
          type="button"
          onClick={
            handleBellClick
          }
          className="
            relative
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-full
            bg-[#FFEAD8]
            transition
            hover:bg-[#F9DDC5]
          "
        >

          <HiOutlineBell
            size={24}
            className="text-[#6A3F2D]"
          />


          {/* UNREAD DOT */}

          {unreadCount > 0 && (

            <span
              className="
                absolute
                right-3
                top-3
                flex
                h-2.5
                w-2.5
                rounded-full
                border-2
                border-[#FFEAD8]
                bg-red-500
              "
            />

          )}

        </button>


        {/* ================================= */}
        {/* NOTIFICATION DROPDOWN */}
        {/* ================================= */}

        {showNotifications && (

          <div
            className="
              absolute
              right-0
              top-[68px]
              z-50
              w-[420px]
              overflow-hidden
              rounded-2xl
              border
              border-[#E7D8CF]
              bg-white
              shadow-[0_12px_40px_rgba(80,50,40,0.15)]
            "
          >

            {/* ================================= */}
            {/* DROPDOWN HEADER */}
            {/* ================================= */}

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-[#EEE3DC]
                bg-[#FFF9F5]
                px-5
                py-4
              "
            >

              <div>

                <h3
                  className="
                    text-[16px]
                    font-semibold
                    text-[#4B2E2A]
                  "
                >
                  Notifications
                </h3>

                {unreadCount > 0 && (

                  <p
                    className="
                      mt-0.5
                      text-xs
                      text-[#8A7A72]
                    "
                  >
                    {unreadCount} unread
                  </p>

                )}

              </div>


              {unreadCount > 0 && (

                <button
                  type="button"
                  onClick={
                    handleMarkAllRead
                  }
                  className="
                    text-xs
                    font-medium
                    text-[#8A4F32]
                    hover:underline
                  "
                >
                  Mark all as read
                </button>

              )}

            </div>


            {/* ================================= */}
            {/* LOADING */}
            {/* ================================= */}

            {loading && (

              <div
                className="
                  px-5
                  py-8
                  text-center
                  text-sm
                  text-gray-500
                "
              >
                Loading notifications...
              </div>

            )}


            {/* ================================= */}
            {/* EMPTY */}
            {/* ================================= */}

            {!loading &&
              notifications.length === 0 && (

                <div
                  className="
                    px-5
                    py-10
                    text-center
                  "
                >

                  <HiOutlineBell
                    size={32}
                    className="
                      mx-auto
                      text-[#C7B8AF]
                    "
                  />

                  <p
                    className="
                      mt-3
                      text-sm
                      font-medium
                      text-[#6A554D]
                    "
                  >
                    No notifications
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-gray-400
                    "
                  >
                    You're all caught up.
                  </p>

                </div>

              )}


            {/* ================================= */}
            {/* NOTIFICATIONS */}
            {/* ================================= */}

            {!loading &&
              notifications.length > 0 && (

                <div
                  className="
                    max-h-[430px]
                    overflow-y-auto
                  "
                >

                  {notifications.map(
                    (notification) => (

                      <button
                        key={
                          notification.id
                        }
                        type="button"
                        onClick={() =>
                          handleNotificationClick(
                            notification
                          )
                        }
                        className={`
                          flex
                          w-full
                          gap-3
                          border-b
                          border-[#F0E8E3]
                          px-5
                          py-4
                          text-left
                          transition
                          hover:bg-[#FFF8F2]
                          ${
                            !notification.is_read
                              ? "bg-[#FFF9F5]"
                              : "bg-white"
                          }
                        `}
                      >

                        {/* ICON */}

                        <div
                          className={`
                            mt-0.5
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            ${
                              !notification.is_read
                                ? "bg-[#FFEAD8]"
                                : "bg-[#F5F1EE]"
                            }
                          `}
                        >

                          <HiOutlineBell
                            size={18}
                            className="
                              text-[#8A4F32]
                            "
                          />

                        </div>


                        {/* CONTENT */}

                        <div
                          className="
                            min-w-0
                            flex-1
                          "
                        >

                          <div
                            className="
                              flex
                              items-start
                              justify-between
                              gap-3
                            "
                          >

                            <p
                              className={`
                                text-sm
                                ${
                                  !notification.is_read
                                    ? "font-semibold"
                                    : "font-medium"
                                }
                                text-[#4B2E2A]
                              `}
                            >
                              {
                                notification.title
                              }
                            </p>


                            {!notification.is_read && (

                              <span
                                className="
                                  mt-1.5
                                  h-2
                                  w-2
                                  shrink-0
                                  rounded-full
                                  bg-red-500
                                "
                              />

                            )}

                          </div>


                          <p
                            className="
                              mt-1
                              line-clamp-2
                              text-xs
                              leading-5
                              text-[#766B65]
                            "
                          >
                            {
                              notification.body
                            }
                          </p>


                          <p
                            className="
                              mt-2
                              text-[11px]
                              text-[#A0958E]
                            "
                          >
                            {
                              formatNotificationDate(
                                notification.created_at
                              )
                            }
                          </p>

                        </div>

                      </button>

                    )
                  )}

                </div>

              )}

          </div>

        )}

      </div>

    </header>

  );

};


export default Header;