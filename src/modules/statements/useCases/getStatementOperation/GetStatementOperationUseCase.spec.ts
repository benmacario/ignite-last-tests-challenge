import { hash } from 'bcryptjs';
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { GetStatementOperationUseCase } from './GetStatementOperationUseCase';
import { GetStatementOperationError } from "./GetStatementOperationError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe('GetStatementOperation', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  })

  it('', async () => {
    const getStatementOperation = getStatementOperationUseCase.execute({
      statement_id: 'any_statement_id',
      user_id: 'any_id'
    })

    await expect(getStatementOperation).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
  })

  it('', async () => {
    const passwordHash = await hash('123', 8);

    const user = await inMemoryUsersRepository.create({
      name: 'User Test',
      email: 'any@email.com',
      password: passwordHash
    })

    const getStatementOperation = getStatementOperationUseCase.execute({
      statement_id: 'any_statement_id',
      user_id: user.id!
    })

    await expect(getStatementOperation).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
  })

  it('', async () => {
    const passwordHash = await hash('123', 8);

    const user = await inMemoryUsersRepository.create({
      name: 'User Test',
      email: 'any@email.com',
      password: passwordHash
    })

    const statement = await inMemoryStatementsRepository.create({
      amount: 10,
      description: 'any_description',
      type: OperationType.DEPOSIT,
      user_id: user.id!
    })

    const getStatementOperation = await getStatementOperationUseCase.execute({
      statement_id: statement.id!,
      user_id: user.id!
    })

    expect(getStatementOperation).toHaveProperty('id')
  })
})
