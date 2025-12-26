import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type AxiosError,
} from "axios";
import { ElMessage } from "element-plus";

import { API_CONFIG } from "./config";

export class ApiClient {
  private baseUrl: string;
  private axios: AxiosInstance;

  constructor() {
    this.baseUrl = API_CONFIG.baseUrl;
    this.axios = axios.create({
      baseURL: this.baseUrl,
      timeout: API_CONFIG.timeout,
      headers: API_CONFIG.headers,
      withCredentials: API_CONFIG.withCredentials,
    });

    // 使用箭头函数确保 this 绑定
    const handleSuccess = (response: AxiosResponse) => {
      if (response.data.code === 0) {
        return response.data;
      } else {
        // 业务逻辑错误
        ElMessage.error(response.data.message || "未知错误");
        if (response.data.code === 401) {
          window.location.replace("/login");
        }
        return Promise.reject(response.data.message);
      }
    };

    const handleError = (error: AxiosError) => {
      // 网络/系统级错误
      const status = error.response?.status;
      const remoteMessage = (error.response?.data as { message?: string })
        ?.message;

      const displayMessage = status ? `请求失败 (${status})` : "网络异常";
      const displayDescription = remoteMessage || error.message || "未知错误";

      ElMessage.error(displayMessage + "：" + displayDescription);

      return Promise.reject(error);
    };

    this.axios.interceptors.response.use(handleSuccess, handleError);
  }

  public get<T>(apiPath: string): Promise<T> {
    // T为返回数据类型
    return this.axios.get(apiPath);
  }

  public delete<T>(apiPath: string): Promise<T> {
    return this.axios.delete(apiPath);
  }

  public put<T, D>(apiPath: string, data: D): Promise<T> {
    return this.axios.put(apiPath, data);
  }

  public post<T, D>(apiPath: string, data: D | FormData): Promise<T> {
    // T为返回数据类型，D为请求数据类型
    return this.axios.post(apiPath, data);
  }
}
export const apiClient = new ApiClient();
