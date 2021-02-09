import { BaseEntity, Column, PrimaryColumn, Entity, ManyToOne } from 'typeorm';
import { Field, ObjectType } from 'type-graphql';
import { User } from './User';
import { Post } from './Post';

@ObjectType()
@Entity()
export class Upvote extends BaseEntity {
	@Field()
	@Column({ type: 'int' })
	value: number;

	@Field()
	@PrimaryColumn()
	userId: number;

	@Field(() => User)
	@ManyToOne(() => User, (user) => user.upvotes)
	user: User;

	@Field()
	@PrimaryColumn()
	postId: number;

	@Field(() => Post)
	@ManyToOne(() => Post, (post) => post.upvotes)
	post: Post;
}
