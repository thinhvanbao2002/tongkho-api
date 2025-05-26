import { Module } from "@nestjs/common";
import { WarehouseService } from "./warehouse.service";
import { WarehouseController } from "./warehouse.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { WarehouseModel } from "./model/warehouse.model";
import { WarehouseAdminController } from "./admin/warehouse-admin.controller";
import { WarehouseAdminService } from "./admin/warehouse-admin.service";

@Module({
	imports: [SequelizeModule.forFeature([WarehouseModel])],
	controllers: [WarehouseController, WarehouseAdminController],
	providers: [WarehouseService, WarehouseAdminService],
})
export class WarehouseModule {}
