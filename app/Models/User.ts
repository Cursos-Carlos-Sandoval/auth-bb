import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Book from './Book'

export default class User extends BaseModel {
  // User info
  @column({ isPrimary: true })
  public user_id: number
  @column()
  public first_name: string
  @column()
  public last_name: string
  @column()
  public email: string
  @column({ serializeAs: null })
  public password: string
  @column()
  public dni_type: string
  @column()
  public dni: string
  @column()
  public profile_id: number

  // User location
  @column()
  public address: string
  @column()
  public district: string
  @column()
  public municipality: string
  @column()
  public state: string

  // System data
  @column()
  public rememberMeToken?: string
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Book)
  public books: HasMany<typeof Book>

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
