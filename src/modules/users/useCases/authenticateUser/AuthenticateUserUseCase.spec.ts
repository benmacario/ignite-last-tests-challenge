import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';
import { hash } from 'bcryptjs';

let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
  })

  it('Should be able to return an exception when not reaching us by email', async () => {
    const authenticate = authenticateUserUseCase.execute({
      email: 'userNotExist@any.com',
      password: '123'
    });

    await expect(authenticate).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  });

  it('Should be able to return an exception when the password is incorrect', async () => {
    const passwordHash = await hash('123', 8);

    const user =  await inMemoryUsersRepository.create({
      name: 'User Test',
      email: 'any@email.com',
      password: passwordHash
    })
    const authenticate = authenticateUserUseCase.execute({
      email: user.email,
      password: '1234'
    });

    await expect(authenticate).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  });

  it('Should be able to return a user', async () => {
    const passwordHash = await hash('123', 8);

    const user =  await inMemoryUsersRepository.create({
      name: 'User Test',
      email: 'any@email.com',
      password: passwordHash
    });

    const authenticate = await authenticateUserUseCase.execute({
      email: user.email,
      password: '123'
    });

    expect(authenticate).toHaveProperty('token')
  });
});
