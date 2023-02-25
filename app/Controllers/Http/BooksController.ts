import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Book from '../../Models/Book'
import { BookDataObject } from '../../Utils/types'

export default class BooksController {
  private async booksExists(id: BookDataObject['book_id']): Promise<boolean> {
    return Book.findBy('book_id', id) !== null
  }

  public async getAll() {
    return Book.all()
  }

  public async getById(id: Book['book_id']) {
    return await Book.findBy('book_id', id)
  }

  public async create({ request, response }: HttpContextContract) {
    try {
      const requestData: BookDataObject = request.only([
        'book_id',
        'title',
        'author',
        'editorial',
        'format',
        'num_pages',
        'user_id',
      ])

      if (await this.booksExists(requestData.book_id)) {
        return response.status(400).json({ msg: 'Error, this book id is already registered' })
      }

      const book = new Book()
      book.parseData(requestData)
      book.save()

      response.status(200).json({ msg: 'Book created!' })
    } catch (error) {
      console.error(error)
      response.status(500).json({ msg: 'Internal server error!' })
    }
  }

  public async delete({ request, response }: HttpContextContract) {
    const id = request.param('id')
    await Book.query().where('book_id', id).delete()
    response.status(200).json({ msg: 'Book deleted!' })
  }

  public async update({ request, response }: HttpContextContract) {
    const requestData: BookDataObject = request.only([
      'book_id',
      'title',
      'author',
      'editorial',
      'format',
      'num_pages',
      'user_id',
    ])
    await Book.query().where('book_id', requestData.book_id).update({
      book_id: requestData.book_id,
      title: requestData.title,
      author: requestData.author,
      editorial: requestData.editorial,
      format: requestData.format,
      num_pages: requestData.num_pages,
      user_id: requestData.user_id,
    })

    response.status(200).json({ msg: 'Book updated!' })
  }
}
