import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  BaseModel,
  hasMany,
  HasMany,
  hasOne,
  HasOne,
} from '@ioc:Adonis/Lucid/Orm'
import Book from './Book'
import { UserDataObject } from '../Utils/types'
import Profile from './Profile'

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
  @hasOne(() => Profile, {
    localKey: 'profile_id',
    foreignKey: 'profile_id',
  })
  public profile_id: HasOne<typeof Profile>

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

  public parseObject(properties: UserDataObject) {
    this.first_name = properties.first_name
    this.last_name = properties.last_name
    this.email = properties.email
    this.password = properties.password
    this.dni_type = properties.dni_type
    this.dni = properties.dni
    this.profile_id = properties.profile_id
    this.address = properties.address
    this.district = properties.district
    this.municipality = properties.municipality
    this.state = properties.state
  }
}
