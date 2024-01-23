import { CanActivate, ExecutionContext, HttpException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Account } from "src/account/entities/account.entity";
import { UserService } from "src/user/user.service";
import { Repository } from "typeorm";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const request = context?.switchToHttp()?.getRequest()
            const token = this.extractTokenFromHeader(request)

            if (token) {
                const payload = await this.jwtService.verify(token, { secret: process.env.ACCESS_TOKEN_KEY })
                const user = await this.userService.findOne(payload?.id)
                if (!user) throw new HttpException('Unauthorized!', 400)
                request['user'] = user
                return true
            }
            throw new HttpException('Unauthorized!', 400)

        } catch (error: any) {
            throw new HttpException('Unauthorized!', 400)
        }
    }

    private extractTokenFromHeader(request: any) {
        const [type, token] = request?.headers?.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}