import { Arg, Authorized, Ctx, Query, UseMiddleware } from 'type-graphql';
import { Permission } from '../entity/permission';
import { User } from '../entity/user';
import { GraphUserContext } from '../lib/graphContext';
import { UserAuthGraph } from '../middleware/userAuth';
import { UserService } from '../service/user.service';

export class UserResolver {
    @Query(() => String)
    public async login(@Arg('usernameOrEmail') usernameOrEmail: string, @Arg('password') password: string) {
        return await UserService.authenticate(usernameOrEmail, password);
    }

    @Query(() => User)
    @UseMiddleware(UserAuthGraph)
    public async Me(@Ctx() { payload }: GraphUserContext) {
        return payload?.user;
    }

    @Query(() => [User])
    @Authorized([Permission.user.list])
    public async Users() {
        return await User.find({ relations: ['stores', 'roles'] });
    }
}
