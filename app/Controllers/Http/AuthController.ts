import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { UserDataObject } from '../../Utils/types'
import User from '../../Models/User'
import UsersController from './UsersController'
import { OpaqueTokenContract } from '@ioc:Adonis/Addons/Auth'

export default class AuthController {
  public static getProfile(token: OpaqueTokenContract<User>) {
    return token.meta?.profile
  }
  public async register({ auth, request, response }: HttpContextContract) {
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

    try {
      const user = new User()
      // Verify existence
      if (await UsersController.userExists(inputData.dni)) {
        response.status(400).json({ msg: 'Error, the user code is already registered' })
        return
      }

      // Create user
      user.parseObject(inputData)
      user.save()

      // Create token
      const token = await auth.use('api').login(user, {
        expiresIn: '10 days',
        profile: user.profile_id,
      })
      response.status(200).json({ token, msg: 'User successfully registered' })
    } catch (error) {
      console.error(error)
      response.status(500).json({ msg: 'Internal server error!' })
    }
  }

  public async login({ auth, request, response }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    try {
      const user = await User.query().where('email', email).firstOrFail()

      const token = await auth.use('api').attempt(email, password, {
        expiresIn: '60 mins',
        profile: user.profile_id,
      })

      response.status(200).json({
        token,
        msg: 'User successfully logged in',
      })
    } catch (error) {
      response.unauthorized('Invalid credentials')
    }
  }
}
