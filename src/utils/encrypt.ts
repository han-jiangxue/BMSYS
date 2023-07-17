import JSEncrypt from "jsencrypt"

// 创建 RSA 加密实例
const rsa = new JSEncrypt()

/**
 * RSA 加密
 * @param publicKey 公钥
 * @param data 待加密的数据
 * @returns 加密后的数据
 */
export function rsaEncrypt(publicKey: string, data: string): string {
  rsa.setPublicKey(publicKey)
  return rsa.encrypt(data) || ""
}
