import axios from './axiosInstance';
export const createRoom = async (title: string, file: string | File) => {
  const formData = new FormData();
  formData.append('title', title);

  if (file instanceof File) {
    formData.append('file', file);
  }

  try {
    const response = await axios.post('/rooms', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('error:', error);
    // throw error;
  }
};

export const testAPI = async (roomId: string) => {
  const response = await axios.get('/room/' + roomId);
  return response.data;
};
