/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import { HttpContext } from '@adonisjs/core/build/standalone'
import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async ({ response }: HttpContext) => {
  response.redirect().toPath('/api/books')
})

Route.group(() => {
  Route.post('register', 'AuthController.register')
  Route.post('login', 'AuthController.login')
  Route.post('logout', 'AuthController.revokeSession')

  Route.get('books', 'BooksController.getAll')
  Route.get('books/:id', 'BooksController.getById')

  Route.group(() => {
    Route.put('books/update/:id', 'BooksController.update')
    Route.post('books', 'BooksController.create')
    Route.delete('books', 'BooksController.delete')

    Route.get('profile', 'ProfilesController.getAll')
    Route.put('profile/update/:id', 'ProfilesController.update')
    Route.delete('profile/:id', 'ProfilesController.delete')
  }).middleware('auth')
  Route.post('profile', 'ProfilesController.create')
  Route.get('profile/:id', 'ProfilesController.getById')
}).prefix('api')
