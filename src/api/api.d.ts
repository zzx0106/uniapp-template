/** 用户登录 */
export function api_login(params: {
  /** 微信wx.login获得的code码 */
  code: string;
}): Promise<Login>;

/**
 * 上传文件
 * @param path 文件路径
 * @param fileName 文件名称
 */
export function api_uploadFile(path: string, fileName: string): Promise<any>;

interface Login {
  openId: string;
}
