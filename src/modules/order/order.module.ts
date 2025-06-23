import { Module } from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { OrderModel } from "./model/order.model";
import { OrderDetailModel } from "../order-detail/model/order-detail.model";
import { OrderAdminController } from "./admin/order-admin.controller";
import { OrderAdminService } from "./admin/order-admin.service";
import { ProductModel } from "../product/model/product.model";
import { CartModel } from "../cart/model/cart.model";
import { WarehouseService } from "../warehouse/warehouse.service";
import { WarehouseModel } from "../warehouse/model/warehouse.model";
import { ProductWarehouseModel } from "../product-warehouse/model/product-warehouse.model";
import { WarehouseImportHistoryModel } from "../warehouse/model/warehouse-import-history.model";
import { SupplierModel } from "../supplier/model/supplier.model";

@Module({
	imports: [SequelizeModule.forFeature([OrderModel, OrderDetailModel, ProductModel, CartModel, WarehouseModel, ProductWarehouseModel, WarehouseImportHistoryModel,SupplierModel])],
	controllers: [OrderController, OrderAdminController],
	providers: [OrderService, OrderAdminService,WarehouseService],
})
export class OrderModule {}
