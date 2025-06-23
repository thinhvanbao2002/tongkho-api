import { StringFieldOptional } from "src/common/decorators/field.decorator";
import { PageOptionsDto } from "src/common/dto/page-option.dto";

export class SearchSupplierDto extends PageOptionsDto {
    @StringFieldOptional()
    q?: string;
} 