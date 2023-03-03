import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { UserDataObject } from '../../Utils/types'
import User from '../../Models/User'
import UsersController from './UsersController'
import { AuthContract, OpaqueTokenContract } from '@ioc:Adonis/Addons/Auth'
import Hash from '@ioc:Adonis/Core/Hash'

export default class AuthController {
  public static async getByEmail(email: string) {
    return await User.findBy('email', email)
  }

  public static getProfile(token: OpaqueTokenContract<User>) {
    return token.meta?.profile
  }

  public static validateToken(auth: AuthContract) {
    return auth.use('api').isLoggedIn
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

  public async login({ auth, request, response }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    try {
      const user = await AuthController.getByEmail(email)

      if (user === null || !(await Hash.verify(user.password, password))) {
        response.unauthorized('Invalid credentials')
        return
      }

      const token = await auth.use('api').attempt(email, password, {
        expiresIn: '60 mins',
        profile_id: user.profile_id ?? 3, // 3 = Client
      })
      response.status(200).json({ token, msg: 'User successfully logged in' })
    } catch (error) {
      console.error(error)
      response.status(500).json({ msg: 'Internal server error!' })
    }
  }

  public async revokeSession({ auth, response }: HttpContextContract) {
    await auth.use('api').revoke()
    response.status(200).json({ revoked: true })
  }
}
