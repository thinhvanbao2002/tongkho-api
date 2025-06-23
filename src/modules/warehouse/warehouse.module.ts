import { Module } from "@nestjs/common";
import { WarehouseService } from "./warehouse.service";
import { WarehouseController } from "./warehouse.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { WarehouseModel } from "./model/warehouse.model";
import { WarehouseAdminController } from "./admin/warehouse-admin.controller";
import { WarehouseAdminService } from "./admin/warehouse-admin.service";
import { ProductModel } from "src/modules/product/model/product.model";
import { ProductWarehouseModel } from "src/modules/product-warehouse/model/product-warehouse.model";
import { WarehouseImportHistoryModel } from "./model/warehouse-import-history.model";
import { SupplierModel } from "src/modules/supplier/model/supplier.model";

@Module({
	imports: [
		SequelizeModule.forFeature([
			WarehouseModel,
			ProductModel,
			ProductWarehouseModel,
			WarehouseImportHistoryModel,
			SupplierModel,
		])
	],
	controllers: [WarehouseController, WarehouseAdminController],
	providers: [WarehouseService, WarehouseAdminService],
})
export class WarehouseModule {}
