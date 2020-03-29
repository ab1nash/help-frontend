import axios from "axios";

import { AuthStore } from "./stores/auth";
import {MapStore} from "./stores/map";


const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});

api.interceptors.request.use(cfg => {
    cfg.headers["Authorization"] = AuthStore.token;
    return cfg;
});


export const sendOTP = async (name: string, phoneNumber: string) => {
    const response = await api.post("/user/claim", { name, phoneNumber });
    console.log(response.data);
};

export const verifyOTP = async (name: string, phoneNumber: string, otp: string): Promise<string> => {
    const response = await api.post("/user/verify", { name, phoneNumber, otp });
    return response.data;
};

export const checkToken = async () => {
    const response = await api.get("/user/check");
    return response.data;
};

export const submitRequest = async (citizenName: string, contactNumber: string,
                                    language: string, service: string,
                                    address: string, comment: string): Promise<string> => {
    const location = JSON.stringify({
        lat: MapStore.lat,
        lng: MapStore.lng,
        address
    });
    const response = await api.post("/request/create", {
        citizenName, contactNumber,
        language, service,
        comment, location
    });
    return response.data;
};
