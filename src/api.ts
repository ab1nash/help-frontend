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

export const listServices = async (): Promise<[]> => {
    const response = await api.get("/services");
    return response.data;
};

export const sendOTP = async (phoneNumber: string) => {
    const response = await api.post("/user/claim", { phoneNumber });
    console.log(response.data);
};

export const verifyOTP = async (name: string, phoneNumber: string, about: string, otp: string): Promise<string> => {
    const response = await api.post("/user/verify", { name, phoneNumber, about, otp });
    return response.data;
};

export const checkUser = async () => {
    const response = await api.get("/user/check");
    return response.data;
};

export const checkAdmin = async () => {
    const response = await api.get("/user/checkAdmin");
    return response.data;
};

export const getRequest = async (id: string) => {
    const response = await api.get("/request/get", {
        params: { id }
    });
    return response.data;
};

export const listRequests = async (all: boolean) => {
    const response = await api.get("/request/list", {
        params: { all }
    });
    return response.data;
};

export const updateRequestStatus = async (id: string, stamps: any): Promise<void> => {
    await api.post("/request/updateStatus", stamps, { params: { id } });
};

export const updateRequest = async (id: string, citizenName: string, contactNumber: string,
                                    language: string, service: string,
                                    address: string, comment: string): Promise<string> => {
    const location = JSON.stringify({
        lat: MapStore.lat,
        lng: MapStore.lng,
    });
    const response = await api.post("/request/update", {
        citizenName, contactNumber,
        language, service,
        comment, location, address
    }, {
        params: { id }
    });
    return response.data;
};

export const submitRequest = async (citizenName: string, contactNumber: string,
                                    language: string, service: string,
                                    address: string, comment: string): Promise<string> => {
    const location = JSON.stringify({
        lat: MapStore.lat,
        lng: MapStore.lng,
    });
    const response = await api.post("/request/create", {
        citizenName, contactNumber,
        language, service,
        comment, location, address
    });
    return response.data;
};

export const setAdmin = async (phoneNumber: string, finalState: boolean) => {
    const response = await api.get("/user/setAdmin", {
        params: {
            phoneNumber,
            finalState
        }
    });
    return response.data;
};

export const getAdmins = async () => {
    const response = await api.get("/user/getAdmins");
    return response.data;
};

export const getSummary = async () => {
    const response = await api.get("/summary");
    return response.data;
};

export const downloadCSV = async (statuses: string[], services: string[],
                                  userPhoneNumber: string, citizenPhoneNumber: string) => {
    const response = await api.post("/request/download", {
        statuses, services, userPhoneNumber, citizenPhoneNumber
    });
    return response.data;
};
