import Profile from '../Models/Profile'

export type DniType = 'C.C' | 'C.E' | 'T.I' | 'RUT' | 'Other'

export interface UserDataObject {
  first_name: string
  last_name: string
  email: string
  password: string
  dni_type: DniType
  dni: string
  profile_id: Profile.profile_id
  address: string
  district: string
  municipality: string
  state: string
}

export interface ProfileDataObject {
  profile_id: number
  description: string
}

export interface BookDataObject {
  book_id: number
  title: string
  author: number
  editorial: number
  format: string
  num_pages: number
  user_id: UserDataObject.user_id
}
