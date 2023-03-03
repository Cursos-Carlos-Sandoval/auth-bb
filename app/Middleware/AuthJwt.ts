import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AuthController from '../Controllers/Http/AuthController'

export default class AuthJwt {
  private getToken(ctx: HttpContextContract) {
    const authorizationHeader = ctx.request.header('authorization')
    return authorizationHeader?.split(' ')[1]
  }

  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    const token = this.getToken(ctx)
    if (token === undefined) {
      return ctx.response.status(400).send({
        msg: 'Missing authentication token',
        state: 401,
      })
    }

    try {
      AuthController.validateToken(token)
      await next()
    } catch (error) {
      return ctx.response.status(400).send('Fail in token')
    }

    await next()
  }
}
