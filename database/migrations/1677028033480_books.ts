import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'books'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      // Book info
      table.increments('book_id').primary()
      table.string('title', 200).notNullable()
      table.integer('author').unsigned().notNullable()
      table.integer('editorial').unsigned().notNullable()
      table.string('format', 100).notNullable()
      table.integer('num_pages').unsigned().notNullable()

      // User info
      table.foreign('user_id').references('users.user_id').onDelete('cascade')

      // System info
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
