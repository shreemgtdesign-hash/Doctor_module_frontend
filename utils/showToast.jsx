import toast from "react-hot-toast";
import CustomToast from "../src/components/Toast/CustomToast";



const showCustomToast = (
    title,
    message,
    type = "success",
    toastId
) => {

    toast.custom(
        (t) => (
            <CustomToast
                t={t}
                title={title}
                message={message}
                type={type}
            />
        ),
        {
            id: toastId,
            duration: 5000,
            position: "top-center",
        }
    );

};


// ==========================================
// SUCCESS
// ==========================================

export const showSuccessToast = (
    title,
    message,
    toastId
) => {

    showCustomToast(
        title,
        message,
        "success",
        toastId
    );

};


// ==========================================
// ERROR
// ==========================================

export const showErrorToast = (
    title,
    message
) => {

    showCustomToast(
        title,
        message,
        "error"
    );

};


// ==========================================
// WARNING
// ==========================================

export const showWarningToast = (
    title,
    message
) => {

    showCustomToast(
        title,
        message,
        "warning"
    );

};


// ==========================================
// INFO
// ==========================================

export const showInfoToast = (
    title,
    message
) => {

    showCustomToast(
        title,
        message,
        "info"
    );

};


// ==========================================
// LOADING
// ==========================================

export const showLoadingToast = (
    title,
    message
) => {

    showCustomToast(
        title,
        message,
        "loading"
    );

};


// ==========================================
// COMPLETION
// ==========================================

export const showCompletionToast = (
    title,
    message
) => {

    showCustomToast(
        title,
        message,
        "completion"
    );

};