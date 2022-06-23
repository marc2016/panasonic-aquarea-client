import axios, { AxiosInstance } from 'axios'
import * as https from 'https'
import { LoginData } from './model/LoginData'

export class AquareaClient {
  readonly baseUrl = 'https://aquarea-service.panasonic.com'
  readonly urlPartLogin = '/installer/api/auth/login'

  private axiosInstance: AxiosInstance

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
    })
    const agent = new https.Agent({
      rejectUnauthorized: false,
    })

    this.axiosInstance.defaults.httpsAgent = agent
    this.axiosInstance.defaults.headers.common['Accept'] =
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
    this.axiosInstance.defaults.headers.common['Content-Type'] = 'application/jsonapplication/x-www-form-urlencoded'
  }

  async login(username: string, password: string): Promise<string> {
    const loginData = new LoginData(username, password)
    try {
      const response = await this.axiosInstance.post(this.urlPartLogin, loginData)
      if (response.status == 200) {
        console.log('success')
      }
    } catch (error) {
      console.log('error')
    }
    return ''
  }
}
