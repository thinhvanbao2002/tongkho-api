import { Column, CreatedAt, DataType, DeletedAt, HasMany, Model, Table, UpdatedAt } from "sequelize-typescript";
import { ProductPhotoModel } from "src/modules/product-photo/model/product-photo.model";
import { ProductModel } from "src/modules/product/model/product.model";

@Table({
	tableName: "warehouse",
})
export class WarehouseModel extends Model {
	@Column({
		type: DataType.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	})
	id: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	warehouse_code: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	warehouse_name: string;

	@Column({
		type: DataType.INTEGER,
		allowNull: false,
	})
	total_warehouse_area: number;

	@HasMany(() => ProductModel)
	products: ProductModel[];

	@CreatedAt
	created_at: Date;

	@UpdatedAt
	updated_at: Date;

	@DeletedAt
	deleted_at: Date;
}
