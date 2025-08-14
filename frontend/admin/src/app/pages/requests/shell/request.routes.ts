import { Routes } from "@angular/router";
import { AuthGuard } from "../../auth/guards/auth.guard";
import { Role } from "../../../common/enums/roles";

export default [
    { path: ':requestId', loadComponent: () => import('../requests.component').then(c => c.RequestsComponent), canActivate: [AuthGuard], data: { role: [Role.ADMIN, Role.PROVIDER, Role.EMPLOYE] } },
    { path: '', loadComponent: () => import('../requests.component').then(c => c.RequestsComponent), canActivate: [AuthGuard], data: { role: [Role.ADMIN, Role.PROVIDER, Role.EMPLOYE] } },
] as Routes;
