/**
 * 个人资料页面相关 API
 */

// 更新个人信息参数类型
export interface UpdateProfileParams {
  nickname?: string;
  avatar?: string;
  bio?: string;
  tags?: string[];
}

/**
 * 更新个人信息 API
 * 注意：这里暂时没有对应的后端接口，使用 store 来模拟
 * 实际项目中应该调用真实的后端 API
 */
export const updateProfileApi = (params: UpdateProfileParams) => {
  // TODO: 实际项目中调用后端 API
  // return apiClient.put('/user/profile', params);
  
  // 暂时返回一个模拟的 Promise
  return Promise.resolve({
    success: true,
    msg: '更新成功',
    data: params,
  });
};

