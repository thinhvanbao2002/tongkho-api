import { IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { NumberField, StringField } from 'src/common/decorators/field.decorator';

export class OrderItemDto {
	@NumberField()
	product_id: number;

	@NumberField()
  total_price: number;
  
  @NumberField()
  product_number: number
}

export class CreateOrderDto {
	@StringField()
	name: string;

	@StringField()
	phone: string;

	@StringField()
	address: string;

	@StringField()
	city: string;

	@StringField()
	district: string;

	@StringField()
	ward: string;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => OrderItemDto)
	items: OrderItemDto[];
}
