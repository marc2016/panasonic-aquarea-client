import axios, { AxiosInstance } from 'axios'
import * as https from 'https'

export class AquareaClient {
  readonly baseUrl = 'https://aquarea-smart.panasonic.com'
  readonly urlPartLogin = '/remote/v1/api/auth/login'
  readonly urlPartDevices = '/remote/v1/api/devices'

  private axiosInstance: AxiosInstance

  private cookies: string[] | undefined

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      withCredentials: true,
    })
    const agent = new https.Agent({
      rejectUnauthorized: false,
    })

    this.axiosInstance.defaults.httpsAgent = agent

    this.axiosInstance.defaults.headers.common['Accept'] =
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
    this.axiosInstance.defaults.headers.common['content-type'] = 'application/x-www-form-urlencoded'
    this.axiosInstance.defaults.headers.common['referer'] = this.baseUrl
    this.axiosInstance.defaults.headers.common['Cache-Control'] = 'max-age=0'
    this.axiosInstance.defaults.headers.common['Accept-Encoding'] = 'deflate, br'
    this.axiosInstance.defaults.headers.common['Upgrade-Insecure-Requests'] = '1'
    this.axiosInstance.defaults.headers.common['User-Agent'] =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:74.0) Gecko/20100101 Firefox/74.0'
  }

  async login(username: string, password: string): Promise<void> {
    const loginData = new URLSearchParams({
      'var.inputOmit': 'false',
      'var.loginId': username,
      'var.password': password,
    })
    try {
      const response = await this.axiosInstance.post(this.urlPartLogin, loginData.toString())

      if (response.status == 200) {
        this.cookies = response.headers['set-cookie']
      }
    } catch (error) {
      console.log('ERROR!')
      console.log(error)
    }
  }

  async getDevices(): Promise<void> {
    try {
      const response = await this.axiosInstance.get(this.urlPartDevices, {
        headers: {
          cookie: this.cookies,
        },
      })

      if (response.status == 200) {
        console.log(response.data)
      }
    } catch (error) {
      console.log('ERROR!')
      console.log(error)
    }
  }
}
