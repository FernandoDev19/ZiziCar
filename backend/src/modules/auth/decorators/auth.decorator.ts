import { UseGuards, applyDecorators } from "@nestjs/common";
import { Role } from "../../../common/enums/role.enum";
import { Roles } from "./roles.decorator";
import { RolesGuard } from "../guards/roles.guard";
import { AuthGuard } from "../guards/auth.guard";

export function Auth(...roles: Role[]){
    return applyDecorators(
        Roles(...roles),
        UseGuards(AuthGuard, RolesGuard)
    )
}