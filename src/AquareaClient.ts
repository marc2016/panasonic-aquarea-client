import axios, { AxiosInstance } from 'axios'
import * as https from 'https'
import _ from 'lodash'
import setCookie, { Cookie } from 'set-cookie-parser'
import { Device } from './model/Device'

export class AquareaClient {
  readonly baseUrl = 'https://aquarea-smart.panasonic.com'
  readonly urlPartLogin = '/remote/v1/api/auth/login'
  readonly urlPartDevices = '/remote/v1/api/devices'
  readonly urlServiceContract = '/remote/contract'

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

  async getDevices(): Promise<Device[] | null> {
    try {
      const response = await this.axiosInstance.get(this.urlPartDevices, {
        headers: {
          cookie: this.cookies,
        },
      })

      if (response.status == 200) {
        const responseDevices = response.data.device
        const devices: Device[] = []
        for (const responseDevice of responseDevices) {
          const device = new Device()
          _.assign(device, responseDevice)
          devices.push(device)
        }
        return devices
      }
    } catch (error) {
      console.log('ERROR!')
      console.log(error)
    }

    return null
  }

  async getDeviceLongId(deviceId: string): Promise<string | null> {
    try {
      const response = await this.axiosInstance.post(
        this.urlServiceContract,
        {},
        {
          headers: {
            cookie: this.cookies?.concat(`selectedGwid=${deviceId}`),
          },
        },
      )

      if (response.status == 200) {
        if (response.headers['set-cookie']) {
          var cookies = setCookie.parse(response.headers['set-cookie'], {
            decodeValues: true, // default: true
          })
          var cookie = _.find(cookies, (c: Cookie) => {
            return c.name == 'selectedDeviceId'
          })
          if (!cookie) return null
          return cookie?.value
        }

        return null
      }
    } catch (error) {
      console.log('ERROR!')
      console.log(error)
    }

    return null
  }
}
