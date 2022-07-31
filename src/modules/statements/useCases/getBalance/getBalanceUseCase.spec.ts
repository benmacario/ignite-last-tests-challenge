import { hash } from 'bcryptjs';
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { GetBalanceUseCase } from './GetBalanceUseCase';
import { GetBalanceError } from "./GetBalanceError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe('GetBalance', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
  })

  it('Should be able to return an exception when not finding a user', async () => {
    const getBalance = getBalanceUseCase.execute({
      user_id: 'any_id'
    })

    await expect(getBalance).rejects.toBeInstanceOf(GetBalanceError)
  })

  it('Should be able to return user data', async () => {
    const passwordHash = await hash('123', 8);

    const user = await inMemoryUsersRepository.create({
      name: 'User Test',
      email: 'any@email.com',
      password: passwordHash
    })

    const getBalance = await getBalanceUseCase.execute({
      user_id: user.id!
    })

    expect(getBalance).toHaveProperty('balance')
  })
})
