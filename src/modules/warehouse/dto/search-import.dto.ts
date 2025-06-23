import { DateFieldOptional, NumberFieldOptional, StringFieldOptional } from "src/common/decorators/field.decorator";
import { PageOptionsDto } from "src/common/dto/page-option.dto";

export class SearchImportDto extends PageOptionsDto {
    @NumberFieldOptional()
    warehouse_id?: number;

    @StringFieldOptional()
    staff_name?: string;

    @NumberFieldOptional()
    supplier_id?: number;

    @DateFieldOptional()
    from_date?: Date;

    @DateFieldOptional()
    to_date?: Date;
} 