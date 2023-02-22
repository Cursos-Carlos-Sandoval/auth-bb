import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Book from '../../Models/Book'

export default class BooksController {
  public async store({ request, response }: HttpContextContract) {
    const book = new Book()
    book.title = request.input('title')
    book.author = request.input('author')
    await book.save()

    response.status(200).json({ Book: book, msg: 'Record entered correctly' })
  }

  public async index() {
    const books = await Book.query()
    return books
  }

  public async show({ params, response }: HttpContextContract) {
    try {
      const book = await Book.find(params.id)

      if (book) {
        response.status(200).json({ Book: book })
      } else {
        response.status(500).json({ msg: 'Record does not exist' })
      }
    } catch (error) {
      console.error(error)
    }
  }

  public async update({ request, response, params }: HttpContextContract) {
    const book = await Book.find(params.id)

    if (book) {
      book.title = request.input('title')
      book.author = request.input('author')

      if (await book.save()) {
        response.status(200).json({ msg: 'Updated successfully', book })
        return
      }

      response.status(401).json({ msg: 'Could not update' })
      return
    }

    response.status(401).json({ msg: 'Record not found' })
  }
}
