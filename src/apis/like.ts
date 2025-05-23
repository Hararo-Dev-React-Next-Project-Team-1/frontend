import axiosInstance from './axiosInstance';

// 좋아요 추가 (빈 하트 클릭)
export const postLike = async (
  roomId: number,
  questionId: number
): Promise<{ message: string; likes: number }> => {
  try {
    const response = await axiosInstance.post(
      `/rooms/${roomId}/questions/${questionId}/likes`
    );
    if (response.status === 200) {
      // 소켓 내부 좋아요 기능 호출
      return response.data;
    }
    return { message: `요청 오류`, likes: -1 };
  } catch (error: any) {
    const code = error.response?.status;
    const msg = error.response?.data?.error || '오류가 발생했습니다.';
    if (code === 400) return { message: `요청 오류: ${msg}`, likes: -1 };
    if (code === 404) return { message: `질문 없음: ${msg}`, likes: -1 };
    return { message: `요청 오류`, likes: -1 };
  }
};

// 좋아요 취소 (채워진 하트 다시 클릭)
export const deleteLike = async (
  roomId: number,
  questionId: number
): Promise<{ message: string; likes: number }> => {
  try {
    const response = await axiosInstance.delete(
      `/rooms/${roomId}/questions/${questionId}/likes`
    );
    if (response.status === 200) {
      return response.data;
    }
    return { message: `요청 오류`, likes: -1 };
  } catch (error: any) {
    const code = error.response?.status;
    const msg = error.response?.data?.error || '오류가 발생했습니다.';
    if (code === 400) return { message: `요청 오류: ${msg}`, likes: -1 };
    if (code === 404) return { message: `질문 없음: ${msg}`, likes: -1 };
    return { message: `요청 오류`, likes: -1 };
  }
};
