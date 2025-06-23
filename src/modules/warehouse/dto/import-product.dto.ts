import { StringField, NumberField, DateField, NumberFieldOptional } from "src/common/decorators/field.decorator";
import { Type } from "class-transformer";
import { ValidateNested, IsArray } from "class-validator";

class ImportProductItemDto {
    @NumberField()
    product_id: number;

    @StringField()
    product_name: string;

    @NumberField()
    quantity: number;

    @StringField()
    note: string;
}

export class ImportProductDto {
    @StringField()
    staff_name: string;

    @NumberField()
    warehouse_id: number;

    @DateField()
    import_date: Date;

    @NumberField()
    staff_id: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ImportProductItemDto)
    products: ImportProductItemDto[];

    @NumberFieldOptional()
    supplier_id?: number;
} 