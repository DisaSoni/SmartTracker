import axios from 'axios';

// const baseURL = 'http://localhost:3080/';
const baseURL = 'https://smart-tracker-api.onrender.com/';

export const get = async ({ endpoint }) => {
    try {
        console.log(`URL > ${baseURL}${endpoint}`)
        const response = await axios.get(`${baseURL}${endpoint}`)
        return response.data;
    } catch (error) {
        console.log('error ', error);
        return error.message;
    }
}

export const post = async ({ endpoint, body }) => {
    try {
        console.log(`URL > ${baseURL}${endpoint}`)
        const response = await axios.post(`${baseURL}${endpoint}`, body)
        return response.data;
    } catch (error) {
        console.log('error ', error);
        return error?.response?.data;
    }
}

export const put = async ({ endpoint, body }) => {
    try {
        console.log(`URL > ${baseURL}${endpoint}`)
        console.log('put body ', body);
        const response = await axios.put(`${baseURL}${endpoint}`, body)
        return response.data;
    } catch (error) {
        console.log('error ', error);
        return error?.response?.data;
    }
}

export const deleteApi = async ({ endpoint }) => {
    try {
        console.log(`URL > ${baseURL}${endpoint}`)
        const response = await axios.delete(`${baseURL}${endpoint}`)
        return response.data;
    } catch (error) {
        console.log('error ', error);
        return error?.response?.data;
    }
}