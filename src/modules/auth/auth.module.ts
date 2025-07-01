import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModel } from "../user/model/user.model";
import { SequelizeModule } from "@nestjs/sequelize";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";
import { RolesGuard } from "./guards/roles.guard";
import { AdminModel } from "../admin/model/admin.model";
import { UserService } from "../user/user.service";

@Module({
	imports: [
		SequelizeModule.forFeature([UserModel, AdminModel]),
		ConfigModule.forRoot(),
		JwtModule.register({
			secret: "thinhvanbaoapidatn",
			signOptions: {
				expiresIn: "30d",
				algorithm: "HS256",
			},
			verifyOptions: {
				algorithms: ["HS256"],
			},
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, AuthService, JwtStrategy, LocalStrategy, RolesGuard, UserService],
})
export class AuthModule {}
