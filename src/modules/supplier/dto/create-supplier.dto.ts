import { StringField, StringFieldOptional } from "src/common/decorators/field.decorator";

export class CreateSupplierDto {
    @StringField()
    supplier_code: string;

    @StringField()
    supplier_name: string;

    @StringFieldOptional()
    phone?: string;

    @StringFieldOptional()
    email?: string;
} 