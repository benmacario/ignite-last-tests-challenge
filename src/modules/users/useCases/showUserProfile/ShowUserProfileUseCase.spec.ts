import { hash } from 'bcryptjs';
import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from './ShowUserProfileUseCase'

let showUserProfileUseCase: ShowUserProfileUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe('ShowUserProfile', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository)
  })

  it('Should be able to return an exception when not finding a user', async () => {
    const showUserProfile = showUserProfileUseCase.execute('any_id')
    await expect(showUserProfile).rejects.toBeInstanceOf(ShowUserProfileError)
  })

  it('Should be able to return a user', async () => {
    const passwordHash = await hash('123', 8);

    const user =  await inMemoryUsersRepository.create({
      name: 'User Test',
      email: 'any@email.com',
      password: passwordHash
    })

    const showUserProfile = await showUserProfileUseCase.execute(user.id!)
    expect(showUserProfile).toHaveProperty('id')
  })
})
