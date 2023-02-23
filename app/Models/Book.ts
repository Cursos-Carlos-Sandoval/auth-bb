import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Book extends BaseModel {
  // Book info
  @column({ isPrimary: true })
  public book_id: number
  @column()
  public title: string
  @column()
  public author: number
  @column()
  public editorial: number
  @column()
  public format: string
  @column()
  public num_pages: number

  // User info
  @column()
  public user_id: number

  // System info
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
