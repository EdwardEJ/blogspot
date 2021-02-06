import { User } from '../entities/User';
import { MyContext } from '../types';
import { Resolver, Mutation, InputType, Field, Arg, Ctx } from 'type-graphql';
import argon2 from 'argon2';

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;

  @Field()
  password: string;
}

@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ) {
    const hasedPassword = await argon2.hash(options.password);

    const user = em.create(User, {
      username: options.username,
      password: hasedPassword,
    });
    await em.persistAndFlush(user);
    return user;
  }

  @Mutation(() => User)
  async login(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ) {
    const user = await em.findOne(User, { username: options.username });

    const hasedPassword = await argon2.hash(options.password);

    return user;
  }
}
