import axiosInstance from './axiosInstance';

export interface QuestionType {
  question_id: number;
  text: string;
  created_at: string;
  is_selected?: boolean;
  likes: number;
}
type GetQuestionListResponse = {
  message: string;
  count: string;
  questions: QuestionType[];
};

interface QuestionRes {
  question_id: number;
  text: string;
}

export const getQuestionlist = async (
  roomId: number
): Promise<GetQuestionListResponse | null> => {
  try {
    const response = await axiosInstance.get<GetQuestionListResponse>(
      `rooms/${roomId}/questions`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const postQuestion = async (
  roomId: number,
  data: string
): Promise<QuestionType | string> => {
  try {
    const response = await axiosInstance.post(`rooms/${roomId}/questions`, {
      text: data,
    });
    if (response.status === 201) {
      return response.data;
    }
    return '생성 실패';
  } catch (error: any) {
    const code = error.response?.status;
    const msg = error.response?.data?.error || '오류가 발생했습니다.';
    console.log('error.response : ', error.response);

    if (code === 400) return `요청 오류: ${msg}`; //빈 문자열
    return '알 수 없는 오류 발생';
  }
};

export const editQuestion = async (
  questionId: number,
  data: string
): Promise<QuestionRes | string> => {
  try {
    const res = await axiosInstance.patch(`questions/${questionId}`, data);
    return res.data;
  } catch (error: any) {
    const code = error.response?.status;
    const msg = error.response?.data?.error || '오류가 발생했습니다.';
    if (code === 400) return `요청 오류: ${msg}`; //빈 문자열
    if (code === 403) return `권한 없음: ${msg}`;
    if (code === 404) return `질문 없음: ${msg}`;
    return '서버 오류 또는 네트워크 문제입니다.';
  }
};

export const deleteQuestion = async (questionId: number) => {
  try {
    const response = await axiosInstance.delete(`questions/${questionId}`);
    if (response.status === 204) {
      return '삭제 성공';
    }
  } catch (error: any) {
    const code = error.response?.status;
    const msg = error.response?.data?.error || '오류가 발생했습니다.';

    if (code === 403) return `권한 없음: ${msg}`;
    if (code === 404) return `질문을 찾을 수 없음: ${msg}`;
  }
};

export const answerQuestion = async (roomId: string, questionId: number) => {
  try {
    const response = await axiosInstance.patch(
      `rooms/${roomId}/questions/${questionId}/status`
    );
    return response.data;
  } catch (error) {
    console.log('error.response : ', error.response);
  }
};
