import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import AppError from "@shared/errors/AppError";
import { hash } from "bcrypt";
import { inject, injectable } from "tsyringe";

interface IRequest {
  token: string;
  password: string;
}

@injectable()
export class ResetPasswordUserUseCase {
  constructor(
    @inject("UsersTokensRepository")
    private usersTokensRepository: IUsersTokensRepository,

    @inject("DayjsDateProvider")
    private dateProvider: IDateProvider,

    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.usersTokensRepository.findByRefreshToken(
      token
    );

    if (!userToken) {
      throw new AppError("Token Invalid!");
    }

    const verifyHours = this.dateProvider.compareIfBefore(
      userToken.expires_date,
      this.dateProvider.dateNow()
    );

    if (verifyHours) {
      throw new AppError("Token has expired!");
    }

    const user = await this.usersRepository.findById(userToken.user_id);

    /* PROBLEMA AQUI - "Internal server error - data and salt arguments required"  */
    user.password = await hash(password, 8);

    await this.usersRepository.create(user);

    await this.usersTokensRepository.deleteById(userToken.id);
  }
}
