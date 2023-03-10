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

  Route.post('profile', 'ProfilesController.create') // For dev

  Route.get('books', 'BooksController.getAll')
  Route.get('books/:id', 'BooksController.getById')

  Route.group(() => {
    Route.post('books', 'BooksController.create')
    Route.put('books/update/:id', 'BooksController.update')
    Route.delete('books/:id', 'BooksController.delete')

    Route.get('profile', 'ProfilesController.getAll')
    Route.get('profile/:id', 'ProfilesController.getById')
    Route.put('profile/update/:id', 'ProfilesController.update')
    Route.delete('profile/:id', 'ProfilesController.delete')

    Route.get('users', 'UsersController.getAll')
    Route.get('users/dni/:dni', 'UsersController.findByDni')
    Route.get('users/email/:email', 'UsersController.findByEmail')
    Route.put('users/:dni', 'UsersController.updateUser')
    Route.delete('users/:dni', 'UsersController.deleteUser')
  }).middleware('auth')
}).prefix('api')
