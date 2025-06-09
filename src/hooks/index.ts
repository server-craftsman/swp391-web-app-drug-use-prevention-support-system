//== Practice ==
import useFetch from "./practice/useFetch";
import useClickOutside from "./practice/useClickOutside";
import useDebounce from "./practice/useDebounce";
import useLocalStorage from "./practice/useLocalStorage";
import useMediaQuery from "./practice/useMediaQuery";
import usePrevious from "./practice/usePrevious";
import useToggle from "./practice/useToggle";

//== Auth ==
import { useRegister, useConfirmEmail, useVerifyEmailToken, useRequestPasswordReset, useResetPassword } from "./useAuth";

export {
    useFetch,
    useClickOutside,
    useDebounce,
    useLocalStorage,
    useMediaQuery,
    usePrevious,
    useToggle,

    //== Auth ==
    useRegister,
    useConfirmEmail,
    useVerifyEmailToken,
    useRequestPasswordReset,
    useResetPassword
};