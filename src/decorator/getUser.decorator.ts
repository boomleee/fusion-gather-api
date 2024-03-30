import { ExecutionContext, createParamDecorator } from "@nestjs/common"

export interface UserInfoType {
    id: string,
    iat: number,
    epx: number
}

export const GetUser = createParamDecorator((key: string, context: ExecutionContext) => {
    const request = context?.switchToHttp()?.getRequest()

    const user = request.user

    return key ? user?.[key] : user
})