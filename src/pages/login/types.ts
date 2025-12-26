export interface LoginFormData {
  studentId: string;
  password: string;
}

export interface RegisterFormData {
  studentId: string;
  password: string;
  nickname: string;
  username: string;
  bio?: string;
  tags?: string[];
  avatar?: string;
}
