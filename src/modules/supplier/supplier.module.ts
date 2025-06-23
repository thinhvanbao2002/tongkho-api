import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { SupplierModel } from "./model/supplier.model";
import { SupplierService } from "./supplier.service";
import { SupplierController } from "./supplier.controller";

@Module({
    imports: [SequelizeModule.forFeature([SupplierModel])],
    controllers: [SupplierController],
    providers: [SupplierService],
})
export class SupplierModule {} 