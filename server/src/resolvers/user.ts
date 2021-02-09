import {
	Resolver,
	Mutation,
	Field,
	Arg,
	Ctx,
	ObjectType,
	Query,
	FieldResolver,
	Root,
} from 'type-graphql';
import { User } from '../entities/User';
import { MyContext } from '../types';
import argon2 from 'argon2';
import { COOKIE_NAME, FORGOT_PASSWORD_PREFIX } from '../constants';
import { UsernamePasswordInput } from './UsernamePasswordInput';
import { validateRegister } from '../utils/validateRegister';
import { sendEmail } from '../utils/sendEmail';
import { v4 as uuid } from 'uuid';
import { getConnection } from 'typeorm';

@ObjectType()
class FieldError {
	@Field()
	field: string;

	@Field()
	message: string;
}

@ObjectType()
class UserResponse {
	@Field(() => [FieldError], { nullable: true })
	errors?: FieldError[];

	@Field(() => User, { nullable: true })
	user?: User;
}

@Resolver(User)
export class UserResolver {
	@FieldResolver(() => String)
	email(@Root() user: User, @Ctx() { req }: MyContext) {
		if (req.session.userId === user.id) {
			return user.email;
		}
		return '';
	}

	@Mutation(() => UserResponse)
	async changePassword(
		@Arg('token') token: string,
		@Arg('newPassword') newPassword: string,
		@Ctx() { redis }: MyContext
	): Promise<UserResponse> {
		if (newPassword.length <= 6) {
			return {
				errors: [
					{
						field: 'newPassword',
						message: 'Length must be greater than 6',
					},
				],
			};
		}

		const key = FORGOT_PASSWORD_PREFIX + token;
		const userId = await redis.get(key);
		if (!userId) {
			return {
				errors: [
					{
						field: 'token',
						message: 'Token expired',
					},
				],
			};
		}

		const userIdNum = parseInt(userId);
		const user = await User.findOne(userIdNum);

		if (!user) {
			return {
				errors: [
					{
						field: 'token',
						message: 'User does no longer exists',
					},
				],
			};
		}

		User.update(
			{ id: userIdNum },
			{
				password: await argon2.hash(newPassword),
			}
		);

		await redis.del(key);

		return { user };
	}

	@Mutation(() => Boolean)
	async forgotPassword(
		@Arg('email') email: string,
		@Ctx() { redis }: MyContext
	) {
		const user = await User.findOne({ where: { email } });

		if (!user) {
			return true;
		}

		const token = uuid();

		await redis.set(
			FORGOT_PASSWORD_PREFIX + token,
			user.id,
			'ex',
			1000 * 60 * 5
		); //5 minutes

		await sendEmail(
			email,
			`
			<p>Follow the link to reset your password. After 5 minutes you will need to ask for a new password.<p>
			<a href="http://localhost:3000/change-password/${token}">Reset password</a>
			`
		);

		return true;
	}

	@Query(() => User, { nullable: true })
	me(@Ctx() { req }: MyContext) {
		if (!req.session.userId) {
			return null;
		}
		return User.findOne(req.session.userId);
	}

	@Mutation(() => UserResponse)
	async register(
		@Arg('options') options: UsernamePasswordInput,
		@Ctx() { req }: MyContext
	): Promise<UserResponse> {
		const errors = validateRegister(options);
		if (errors) {
			return { errors };
		}

		const hashedPassword = await argon2.hash(options.password);
		let user;
		try {
			const result = await getConnection()
				.createQueryBuilder()
				.insert()
				.into(User)
				.values({
					username: options.username,
					email: options.email,
					password: hashedPassword,
				})
				.returning('*')
				.execute();
			user = result.raw[0];
		} catch (err) {
			if (err.code === '23505') {
				return {
					errors: [
						{
							field: 'username',
							message: 'Username already exists',
						},
					],
				};
			}
		}

		req.session.userId = user.id;

		return { user };
	}

	@Mutation(() => UserResponse)
	async login(
		@Arg('usernameOrEmail') usernameOrEmail: string,
		@Arg('password') password: string,
		@Ctx() { req }: MyContext
	): Promise<UserResponse> {
		const user = await User.findOne(
			usernameOrEmail.includes('@')
				? { where: { email: usernameOrEmail } }
				: { where: { username: usernameOrEmail } }
		);

		if (!user) {
			return {
				errors: [
					{
						field: 'usernameOrEmail',
						message: 'User does not exist',
					},
				],
			};
		}

		const validPassword = await argon2.verify(user.password, password);
		if (!validPassword) {
			return {
				errors: [
					{
						field: 'password',
						message: 'Invalid login',
					},
				],
			};
		}

		req.session.userId = user.id;

		return { user };
	}

	@Mutation(() => Boolean)
	logout(@Ctx() { req, res }: MyContext) {
		return new Promise((resolve) =>
			req.session.destroy((err) => {
				res.clearCookie(COOKIE_NAME);
				if (err) {
					resolve(false);
					return;
				}
				resolve(true);
			})
		);
	}
}
