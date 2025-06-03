import { Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
import { GenericController } from "src/common/decorators/controller.decorator";
import { CreateWarehouseDto } from "../dto/create-warehouse.dto";
import { UpdateWarehouseDto } from "../dto/update-warehouse.dto";
import { SearchWarehouseDto } from "../dto/search-warehouse.dto";
import { WarehouseAdminService } from "./warehouse-admin.service";

@GenericController("a/warehouse")
export class WarehouseAdminController {
    constructor(private readonly warehouseService: WarehouseAdminService) {}

    @Get()
    async findAll(@Query() dto: SearchWarehouseDto) {
        console.log("🚀 ~ WarehouseAdminController ~ findAll ~ dto:", dto)
        return await this.warehouseService.findAll(dto);
    }

    @Post()
    async create(@Body() createWarehouseDto: CreateWarehouseDto) {
        console.log("🚀 ~ WarehouseAdminController ~ create ~ createWarehouseDto:", createWarehouseDto)
        return await this.warehouseService.create(createWarehouseDto);
    }

    @Get(":id")
    findOne(@Param("id") id: number) {
        return this.warehouseService.findOne(+id);
    }

    @Patch(":id")
    async update(@Param("id") id: number, @Body() updateWarehouseDto: UpdateWarehouseDto) {
        return await this.warehouseService.update(+id, updateWarehouseDto);
    }

    @Delete(":id")
    async remove(@Param("id") id: number) {
        return await this.warehouseService.remove(+id);
    }
} 