import { UserTokens } from "../infra/typeorm/entities/UserTokens";
import { ICreateUserTokenDTO } from "./dtos/ICreateUserTokenDTO";

export interface IUsersTokensRepository {
  create({
    user_id,
    refresh_token,
    expires_date,
  }: ICreateUserTokenDTO): Promise<UserTokens>;

  findByUserIdAndRefreshToken(
    user_id: string,
    refresh_token: string
  ): Promise<UserTokens>;

  findByRefreshToken(refresh_token: string): Promise<UserTokens>;

  deleteById(id: string): Promise<void>;
}
