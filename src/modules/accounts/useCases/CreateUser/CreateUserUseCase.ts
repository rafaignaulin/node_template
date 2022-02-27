import { inject, injectable } from "tsyringe";
import { hash } from 'bcrypt'
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { ICreateUserDTO } from "@modules/accounts/repositories/dtos/ICreateUserDTO";
import AppError from "@shared/errors/AppError";

@injectable()
export default class CreateUserUseCase {

  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ){}

  async execute({name, password, driver_license, email}: ICreateUserDTO): Promise<void> {

    const userAlreadyExists = await this.usersRepository.findByEmail(email);

    if(userAlreadyExists){
      throw new AppError("User Already Exists")
    }


    const passwordHash = await hash(password, 8);

    await this.usersRepository.create({
      name,
      password: passwordHash,
      driver_license,
      email
    })
  }
}