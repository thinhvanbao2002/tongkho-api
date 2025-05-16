import { Module } from "@nestjs/common";
import { WarehouseService } from "./warehouse.service";
import { WarehouseController } from "./warehouse.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { WarehouseModel } from "./model/warehouse.model";

@Module({
	imports: [SequelizeModule.forFeature([WarehouseModel])],
	controllers: [WarehouseController],
	providers: [WarehouseService],
})
export class WarehouseModule {}
