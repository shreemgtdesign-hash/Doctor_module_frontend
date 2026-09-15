import toast from "react-hot-toast";

import CustomToast
    from "../components/Toast/CustomToast";


export const showSuccessToast = (
    title,
    message
) => {

    toast.custom(
        (t) => (
            <CustomToast
                t={t}
                title={title}
                message={message}
            />
        ),
        {
            duration: 5000,
            position: "top-center",
        }
    );

};