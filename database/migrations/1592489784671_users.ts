import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersSchema extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      // User info
      table.increments('user_id').primary().unsigned()
      table.string('first_name', 180).notNullable()
      table.string('last_name', 180).notNullable()
      table.string('email', 255).notNullable()
      table.string('password', 180).notNullable()
      table.string('dni_type', 10).notNullable()
      table.string('dni', 10).notNullable().unique().index('user_dni')
      table.integer('profile_id').unsigned()
      table.foreign('profile_id').references('profiles.profile_id').onDelete('cascade')

      // User location
      table.string('address', 255).notNullable()
      table.string('district', 100).notNullable()
      table.string('municipality', 100).notNullable()
      table.string('state', 100).notNullable()

      // System data
      table.string('remember_me_token').nullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
