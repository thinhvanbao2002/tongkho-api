import { StringFieldOptional, NumberFieldOptional } from "src/common/decorators/field.decorator";

export class UpdateWarehouseDto {
    @StringFieldOptional()
    warehouse_code?: string;

    @StringFieldOptional()
    warehouse_name?: string;

    @NumberFieldOptional()
    total_warehouse_area?: number;

    @NumberFieldOptional()
    status?: number;
}
