import { ObjectId } from 'mongoose'
import { Request, Response } from 'express'
import { joiValidation } from '@global/decorators/joi-validation.decorators'
import { signupSchema } from '@auth/schemes/signup'
import authService from '@service/db/auth.service'

export class SignUp {
  @joiValidation(signupSchema)
  public async create(req: Request, res: Response): Promise<void> {
    const { username, email, password, avatarColor, avatarImage } = req.body
    const checkIfUserExists = await authService.getUserByUsernameOrEmail(username, email)
    if (checkIfUserExists) {
      throw new Error('User already exists')
    }
  }
}
