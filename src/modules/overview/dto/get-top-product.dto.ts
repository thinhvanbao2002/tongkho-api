import { NumberFieldOptional } from "src/common/decorators/field.decorator";

export class GetTopProductDto {
    @NumberFieldOptional()
    year?: number;

    @NumberFieldOptional()
    month?: number;

    @NumberFieldOptional()
    quarter?: number;

    @NumberFieldOptional()
    limit?: number = 10;
} 