import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
import { WarehouseService } from "./warehouse.service";
import { CreateWarehouseDto } from "./dto/create-warehouse.dto";
import { UpdateWarehouseDto } from "./dto/update-warehouse.dto";
import { SearchWarehouseDto } from "./dto/search-warehouse.dto";
import { GenericController } from "src/common/decorators/controller.decorator";
import { ImportProductDto } from "./dto/import-product.dto";
import { SearchImportDto } from "./dto/search-import.dto";

@GenericController("warehouse")
export class WarehouseController {
	constructor(private readonly warehouseService: WarehouseService) {}

	@Post()
	create(@Body() createWarehouseDto: CreateWarehouseDto) {
		return this.warehouseService.create(createWarehouseDto);
	}

	@Get()
	findAll(@Query() dto: SearchWarehouseDto) {
		return this.warehouseService.findAll(dto);
	}

	@Get(":id")
	findOne(@Param("id") id: string) {
		return this.warehouseService.findOne(+id);
	}

	@Patch(":id")
	update(@Param("id") id: string, @Body() updateWarehouseDto: UpdateWarehouseDto) {
		return this.warehouseService.update(+id, updateWarehouseDto);
	}

	@Delete(":id")
	remove(@Param("id") id: string) {
		return this.warehouseService.remove(+id);
	}

	@Post("import")
	importProducts(@Body() dto: ImportProductDto) {
		return this.warehouseService.importProducts(dto);
	}

	@Get("import/history")
	getImportHistory(@Query() dto: SearchImportDto) {
		return this.warehouseService.getImportHistory(dto);
	}
}
