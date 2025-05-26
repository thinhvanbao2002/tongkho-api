import { DateFieldOptional, NumberFieldOptional, StringFieldOptional } from "src/common/decorators/field.decorator";
import { PageOptionsDto } from "src/common/dto/page-option.dto";

export class SearchWarehouseDto extends PageOptionsDto {
    @StringFieldOptional()
    q?: string;

    @NumberFieldOptional()
    status?: number;

    @DateFieldOptional()
    from_date?: Date;

    @DateFieldOptional()
    to_date?: Date;
} 