import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    ParseIntPipe,
    UseGuards,
} from "@nestjs/common";
import { SupplierService } from "./supplier.service";
import { CreateSupplierDto } from "./dto/create-supplier.dto";
import { UpdateSupplierDto } from "./dto/update-supplier.dto";
import { SearchSupplierDto } from "./dto/search-supplier.dto";
import { GenericController } from "src/common/decorators/controller.decorator";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt.guard";
import { RolesGuard } from "src/modules/auth/guards/roles.guard";
import { Roles } from "src/modules/auth/decorators/roles.decorator";
import { UserRoles } from "src/modules/user/types/user.type";

@GenericController("a/suppliers")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoles.ADMIN, UserRoles.STAFF)
export class SupplierController {
    constructor(private readonly supplierService: SupplierService) {}

    @Post()
    create(@Body() createSupplierDto: CreateSupplierDto) {
        return this.supplierService.create(createSupplierDto);
    }

    @Get()
    findAll(@Query() searchDto: SearchSupplierDto) {
        return this.supplierService.findAll(searchDto);
    }

    @Get(":id")
    findOne(@Param("id", ParseIntPipe) id: number) {
        return this.supplierService.findOne(id);
    }

    @Patch(":id")
    update(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateSupplierDto: UpdateSupplierDto,
    ) {
        return this.supplierService.update(id, updateSupplierDto);
    }

    @Delete(":id")
    remove(@Param("id", ParseIntPipe) id: number) {
        return this.supplierService.remove(id);
    }
} 