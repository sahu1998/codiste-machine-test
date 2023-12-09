import axios from "axios";
const server_url = "http://localhost:8000";
export const getApiHandler = async (endpoint) => {
  try {
    const getRes = await axios.get(server_url + endpoint);
    return getRes;
  } catch (error) {
    return error.response;
  }
};
export const postApiHandler = async (endpoint, payload) => {
  try {
    const postRes = await axios.post(server_url + endpoint, payload);
    return postRes;
  } catch (error) {
    return error.response;
  }
};

export const putApiHandler = async (endpoint, payload) => {
  try {
    const postRes = await axios.put(server_url + endpoint, payload);
    return postRes;
  } catch (error) {
    return error.response;
  }
};

export const deleteApiHandler = async (endpoint) => {
  try {
    const deleteRes = await axios.delete(server_url + endpoint);
    return deleteRes;
  } catch (error) {
    return error.response;
  }
};
