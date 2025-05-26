import { StringField, NumberField, NumberFieldOptional } from "src/common/decorators/field.decorator";

export class CreateWarehouseDto {
    @StringField()
    warehouse_code: string;

    @StringField()
    warehouse_name: string;

    @NumberFieldOptional()
    total_warehouse_area: number;
}
