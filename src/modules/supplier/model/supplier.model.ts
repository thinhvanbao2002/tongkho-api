import {
	Column,
	CreatedAt,
	DataType,
	DeletedAt,
	Model,
	Table,
	UpdatedAt,
} from "sequelize-typescript";

@Table({
	tableName: "suppliers",
})
export class SupplierModel extends Model {
	@Column({
		type: DataType.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	})
	id: number;

	@Column({
		type: DataType.STRING,
		allowNull: false,
		unique: true,
	})
	supplier_code: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	supplier_name: string;

	@Column({
		type: DataType.STRING,
	})
	phone: string;

	@Column({
		type: DataType.STRING,
	})
	email: string;

	@CreatedAt
	created_at: Date;

	@UpdatedAt
	updated_at: Date;

	@DeletedAt
	deleted_at: Date;
} 