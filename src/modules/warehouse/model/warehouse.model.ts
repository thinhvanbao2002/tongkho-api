import { Column, CreatedAt, DataType, DeletedAt, HasMany, Model, Table, UpdatedAt } from "sequelize-typescript";
import { ProductModel } from "src/modules/product/model/product.model";
import { WarehouseStatus } from "../constants/warehouse.constant";
import { ProductWarehouseModel } from "src/modules/product-warehouse/model/product-warehouse.model";

@Table({
	tableName: "warehouse",
})
export class WarehouseModel extends Model {
	@Column({
		type: DataType.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	})
	id: number;

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
	})
	total_warehouse_area: number;

	@Column({
		type: DataType.INTEGER,
		defaultValue: WarehouseStatus.ACTIVE,
	})
	status: WarehouseStatus;

	@HasMany(() => ProductModel)
	products: ProductModel[];

	@HasMany(() => ProductWarehouseModel)
	product_warehouses: ProductWarehouseModel[];

	@CreatedAt
	created_at: Date;

	@UpdatedAt
	updated_at: Date;

	@DeletedAt
	deleted_at: Date;
}
