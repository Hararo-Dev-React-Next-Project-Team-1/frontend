import axios from './axiosInstance';
export const createRoom = async (title: string, file: string | File) => {
  const formData = new FormData();
  formData.append('title', title);

  if (file instanceof File) {
    formData.append('file', file);
  }
  const response = await axios.post('/rooms', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const getRoomInfo = async (enterCode: string) => {
  const response = await axios.get(`/rooms?enter-code=${enterCode}`);
  return response.data;
};
