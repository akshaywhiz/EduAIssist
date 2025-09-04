export enum UserRole {
  ADMIN = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student',
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  role: UserRole
  googleId?: string
  microsoftId?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateUserDto {
  email: string
  firstName: string
  lastName: string
  role: UserRole
  avatar?: string
}

export interface UpdateUserDto extends Partial<CreateUserDto> {}
