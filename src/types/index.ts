export type Room = {
  room_id: string;
  code: string;
  title: string;
  created_at: string;
  file_name: string;
};

export type Question = {
  question_id: number;
  text: string;
  created_at: string;
  likes: number;
};
