import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Profile from '../../Models/Profile'
import { ProfileDataObject } from '../../Utils/types'

/* TODO reto 3
 [x] Validar la existencia de un usuario por su numero de identificacion
 [x] Crear al menos tres tipos de perfiles (admin, worker, client)
 [ ] Asignar diferentes accesos a cada perfil
 [x] Cada controlador debe tener agregar, listar todo, busqueda por parametro, editar y eliminar
 [ ] Realizar test en insomnia
 */

export default class ProfilesController {
  private async profileExists(id: ProfileDataObject['profile_id']): Promise<boolean> {
    return (await Profile.findBy('profile_id', id)) !== null
  }

  public async getAll() {
    return await Profile.all()
  }

  public async getById(id: Profile['profile_id']) {
    return await Profile.findBy('profile_id', id)
  }

  public async create({ request, response }: HttpContextContract) {
    try {
      const requestData: ProfileDataObject = request.only(['profile_id', 'description'])

      if (await this.profileExists(requestData.profile_id)) {
        return response.status(400).json({ msg: 'Error, this profile id is already registered' })
      }

      const profile = new Profile()
      profile.profile_id = requestData.profile_id
      profile.description = requestData.description
      profile.save()
      response.status(200).json({ msg: 'Profile created!' })
    } catch (error) {
      console.error(error)
      response.status(500).json({ msg: 'Internal server error!' })
    }
  }

  public async delete({ request, response }: HttpContextContract) {
    const id = request.param('id')
    await Profile.query().where('profile_id', id).delete()
    response.status(200).json({ msg: 'Profile deleted!' })
  }

  public async update({ request, response }: HttpContextContract) {
    const requestData: ProfileDataObject = request.only(['profile_id', 'description'])
    await Profile.query().where('profile_id', requestData.profile_id).update({
      profile_id: requestData.profile_id,
      description: requestData.description,
    })

    response.status(200).json({ msg: 'Profile updated!' })
  }
}
