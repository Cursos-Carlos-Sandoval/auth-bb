import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AuthController from '../Controllers/Http/AuthController'

export default class AuthJwt {
  private getToken(ctx: HttpContextContract) {
    const authorizationHeader = ctx.request.header('authorization')

    if (authorizationHeader === undefined) {
      ctx.response.status(400).send({
        msg: 'Missing authentication token',
        state: 401,
      })
      return null
    }
    return authorizationHeader
  }

  private validateToken(ctx: HttpContextContract) {
    const token = this.getToken(ctx)
    if (token === null) return ctx.response
    if (AuthController.validateToken(ctx.auth)) {
      return ctx.response.status(400).send('Token failure')
    }
  }

  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    this.validateToken(ctx)
    if (ctx.response.getStatus() === 400) return ctx.response

    await next()
  }
}
