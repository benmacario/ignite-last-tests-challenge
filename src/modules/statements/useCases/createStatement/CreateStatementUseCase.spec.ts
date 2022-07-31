import { hash } from 'bcryptjs';
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from './CreateStatementUseCase';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe('CreateStatement', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  })

  it('Should be able to return an exception when not finding a user', async () => {
    const createStatement = createStatementUseCase.execute({
      amount: 10.0,
      description: 'any_description',
      type: OperationType.WITHDRAW,
      user_id: 'any_id'
    })

    await expect(createStatement).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  })

  it('Should be able to return an exception if the balance is insufficient', async () => {
    const passwordHash = await hash('123', 8);

    const user =  await inMemoryUsersRepository.create({
      name: 'User Test',
      email: 'any@email.com',
      password: passwordHash
    })

    const createStatement = createStatementUseCase.execute({
      amount: 10.0,
      description: 'any_description',
      type: OperationType.WITHDRAW,
      user_id: user.id!
    })

    await expect(createStatement).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  })

  it('Should be able to make a deposit', async () => {
    const passwordHash = await hash('123', 8);

    const user =  await inMemoryUsersRepository.create({
      name: 'User Test',
      email: 'any@email.com',
      password: passwordHash
    })

    await inMemoryStatementsRepository.create({
      amount: 10,
      description: 'any_statement',
      type: OperationType.DEPOSIT,
      user_id: user.id!
    })

    const createStatement = await createStatementUseCase.execute({
      amount: 8,
      description: 'any_description',
      type: OperationType.WITHDRAW,
      user_id: user.id!
    })

    expect(createStatement).toHaveProperty('id')
  })
})
