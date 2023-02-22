import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from '../../Models/User'

export default class AuthController {
  public async login({ auth, request, response }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    try {
      const token = await auth.use('api').attempt(email, password, {
        expiresIn: '60 mins',
      })

      response.status(200).json({
        token,
        msg: 'User successfully logged in',
      })
    } catch (error) {
      response.unauthorized('Invalid credentials')
    }
  }

  public async register({ auth, request, response }: HttpContextContract) {
    const name = request.input('name')
    const email = request.input('email')
    const password = request.input('password')

    const user = new User()
    user.name = name
    user.email = email
    user.password = password
    await user.save()

    const token = await auth.use('api').login(user, {
      expiresIn: '10 days',
    })

    response.status(200).json({ token, msg: 'User successfully registered' })
  }
}
