import axios from './axiosInstance';
export const createRoom = (title: string, file: string | File) => {
  axios.post('/rooms', {
    title: title,
    file: file,
  });
};
