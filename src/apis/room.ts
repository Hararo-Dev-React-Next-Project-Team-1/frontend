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

export const downloadFile = async (roomId: string, fileName: string) => {
  const response = await axios.get(`/rooms/${roomId}`, {
    responseType: 'blob',
  });

  const contentType = response.headers['content-type'];
  const blob = new Blob([response.data], { type: contentType });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName}`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const exitRoom = async (roomId: string) => {
  const response = await axios.delete(`/rooms/${roomId}`);
  return response.data;
};
