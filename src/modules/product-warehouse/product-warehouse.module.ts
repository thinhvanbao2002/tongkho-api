import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { ProductWarehouseModel } from "./model/product-warehouse.model";

@Module({
	imports: [SequelizeModule.forFeature([ProductWarehouseModel])],
	controllers: [],
	providers: [],
})
export class ProductWarehouseModule {}
