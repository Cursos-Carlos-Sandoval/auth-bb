import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class BooksSchema extends BaseSchema {
  protected tableName = 'books'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      // Book info
      table.increments('book_id').primary().unsigned()
      table.string('title', 200).notNullable()
      table.integer('author').unsigned().notNullable()
      table.integer('editorial').unsigned().notNullable()
      table.string('format', 100).notNullable()
      table.integer('num_pages').unsigned().notNullable()

      // User info
      table.integer('id').unsigned()
      table.foreign('id').references('users.id').onDelete('cascade')

      // System info
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
