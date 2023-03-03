import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { UserDataObject } from '../../Utils/types'
import User from '../../Models/User'
import UsersController from './UsersController'
import { OpaqueTokenContract } from '@ioc:Adonis/Addons/Auth'
import Hash from '@ioc:Adonis/Core/Hash'
import jwt from 'jsonwebtoken'
import Env from '@ioc:Adonis/Core/Env'

export default class AuthController {
  public static async getByEmail(email: string) {
    return await User.findBy('email', email)
  }

  public static getProfile(token: OpaqueTokenContract<User>) {
    return token.meta?.profile
  }

  public static generateToken(payload: any) {
    const options = {
      expiresIn: '60 mins',
    }

    return jwt.sign(payload, Env.get('JWT_PRIVATE_KEY'), options)
  }

  public static validateToken(token: string) {
    jwt.verify(token, Env.get('JWT_PRIVATE_KEY'), (error) => {
      if (error) {
        throw new Error('Expired token')
      }
    })
    return true
  }

  public static havePermission(token: string) {
    const decodeToken = jwt.decode(token, { complete: true })
    console.table(decodeToken)
    console.log(decodeToken?.payload['profile_id'] === 1)
    return decodeToken?.payload['profile_id'] === 1
  }

  public async register({ request, response }: HttpContextContract) {
    const inputData: UserDataObject = request.only([
      'first_name',
      'last_name',
      'email',
      'password',
      'dni_type',
      'dni',
      'profile_id',
      'address',
      'district',
      'municipality',
      'state',
    ])

    const user = new User()
    try {
      // Verify existence
      if (await UsersController.userExists(inputData.dni)) {
        response.status(400).json({ msg: 'Error, the user code is already registered' })
        return
      }

      // Create user
      user.parseObject(inputData)
      await user.save()

      response.status(200).json({ msg: 'User successfully registered' })
    } catch (error) {
      console.error(error)
      response.status(500).json({ msg: 'Internal server error!' })
    }
  }

  public async login({ request, response }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    try {
      const user = await AuthController.getByEmail(email)

      if (user === null || !(await Hash.verify(user.password, password))) {
        response.unauthorized('Invalid credentials')
        return
      }

      const token = AuthController.generateToken({
        profile_id: user.profile_id ?? 3, // 3 = Client
      })
      response.status(200).json({ token, msg: 'User successfully logged in' })
    } catch (error) {
      console.error(error)
      response.status(500).json({ msg: 'Internal server error!' })
    }
  }
}
