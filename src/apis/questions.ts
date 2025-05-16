import axiosInstance from './axiosInstance';

export interface QuestionType {
  question_id: number;
  text: string;
  created_at: string;
  is_selected: boolean;
  likes: number;
}

export const getQuestionlist = async (
  roomId: number
): Promise<QuestionType[] | null> => {
  try {
    const response = await axiosInstance.get<QuestionType[]>(
      `questions/${roomId}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
