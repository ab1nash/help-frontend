import { view } from 'react-easy-state';
import md5 from "md5";


export const Guard = view(({ children }) => {
    const urlParams = new URLSearchParams(window.location.search);
    const password = urlParams.get("password");
    if (md5(password || "") === process.env.REACT_APP_GUARD_PASSWORD) {
        return children;
    }
});
