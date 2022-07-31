import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { CreateUserError } from './CreateUserError';
import { CreateUserUseCase } from './CreateUserUseCase';

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe('CreateUser', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it('Should be able to return an exception if it finds a user with the same email', async () => {
    await inMemoryUsersRepository.create({
      name: 'User Test',
      email: 'any@email.com',
      password: '123'
    });

    const createUser = createUserUseCase.execute({
      name: 'User Test 2',
      email: 'any@email.com',
      password: '123'
    });

    await expect(createUser).rejects.toBeInstanceOf(CreateUserError)
  });

  it('Should be able to register a user', async () => {
    const createUser = await createUserUseCase.execute({
      name: 'User Test 2',
      email: 'any@email.com',
      password: '123'
    });

    expect(createUser).toHaveProperty('id')
  });
})
