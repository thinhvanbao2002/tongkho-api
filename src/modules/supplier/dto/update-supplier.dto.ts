import { StringFieldOptional } from "src/common/decorators/field.decorator";

export class UpdateSupplierDto {
    @StringFieldOptional()
    supplier_name?: string;

    @StringFieldOptional()
    phone?: string;

    @StringFieldOptional()
    email?: string;
} 