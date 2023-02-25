import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from '../../Models/User'
import { UserDataObject } from '../../Utils/types'

export default class UsersController {
  public static async userExists(dni: UserDataObject['dni']): Promise<boolean> {
    return User.findBy('dni', dni) !== null
  }

  public async getAll(): Promise<User[]> {
    return await User.all()
  }

  public async getUsersAndProfiles(): Promise<User[]> {
    return await User.query().preload('profile_id')
  }

  public async findByDni({ request }: HttpContextContract): Promise<User | null> {
    const dni = request.param('dni')
    return await User.findBy('dni', dni)
  }

  public async findByEmail({ request }: HttpContextContract): Promise<User | null> {
    const email = request.param('email')
    return await User.findBy('email', email)
  }

  public async updateUser({ request, response }: HttpContextContract) {
    const dni = request.param('dni')
    const newUserData: UserDataObject = request.only([
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

    await User.query().where('dni', dni).update({
      first_name: newUserData.first_name,
      last_name: newUserData.last_name,
      email: newUserData.email,
      password: newUserData.password,
      dni_type: newUserData.dni_type,
      dni: newUserData.dni,
      profile_id: newUserData.profile_id,
      address: newUserData.address,
      district: newUserData.district,
      municipality: newUserData.municipality,
      state: newUserData.state,
    })

    response.status(200).json({ msg: 'User updated!' })
  }

  public async deleteUser({ request, response }: HttpContextContract) {
    const dni = request.param('dni')
    await User.query().where('dni', dni).delete()
    response.status(200).json({ msg: 'User deleted!' })
  }
}
