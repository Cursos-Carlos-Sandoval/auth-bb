import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ProfilesSchema extends BaseSchema {
  protected tableName = 'profiles'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('profile_id').primary().unsigned()
      table.string('description', 255).notNullable()

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
