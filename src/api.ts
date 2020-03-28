import axios from "axios";

import { AuthStore } from "./stores/auth";
import {MapStore} from "./stores/map";


const API_URL = "http://localhost:5000";


export const sendOTP = async (phoneNumber: string) => {
    const response = await axios.post(`${API_URL}/user/claim`, { phoneNumber });
    console.log(response.data);
};

export const verifyOTP = async (name: string, phoneNumber: string, otp: string): Promise<string> => {
    const response = await axios.post(`${API_URL}/user/verify`, { name, phoneNumber, otp });
    return response.data;
};

export const submitRequest = async (citizenName: string, language: string, service: string, address: string, comment: string): Promise<string> => {

    const location = JSON.stringify({
        lat: MapStore.lat,
        lng: MapStore.lng,
        address
    });

    const response = await axios.post(`${API_URL}/request/create`, { citizenName, language, service, comment, location }, {
        headers: {
            Authorization: AuthStore.userToken
        }
    });
    return response.data;
};
