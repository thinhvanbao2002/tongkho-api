import {
	BelongsTo,
	Column,
	CreatedAt,
	DataType,
	DeletedAt,
	ForeignKey,
	HasMany,
	Model,
	Table,
	UpdatedAt,
} from "sequelize-typescript";
import { ProductTypes } from "../types/product.type";
import { CategoryModel } from "src/modules/category/model/category.model";
import { ProductPhotoModel } from "src/modules/product-photo/model/product-photo.model";
import { getFullUrl } from "src/common/helpers/ultils";
import { ProductStatus } from "../constants/product.constant";
import { ProductReviewModel } from "src/modules/product-review/model/product-review.model";
import { WarehouseModel } from "src/modules/warehouse/model/warehouse.model";
import { ProductWarehouseModel } from "src/modules/product-warehouse/model/product-warehouse.model";
import { SupplierModel } from "src/modules/supplier/model/supplier.model";

@Table({
	tableName: "product",
})
export class ProductModel extends Model {
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
	product_code: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	name: string;

	@Column({
		type: DataType.INTEGER,
		allowNull: false,
	})
	@ForeignKey(() => CategoryModel)
	category_id: number;

	@BelongsTo(() => CategoryModel)
	category: CategoryModel;

	@Column({
		type: DataType.INTEGER,
		allowNull: false,
	})
	price: number;

	@Column({
		type: DataType.ENUM(...Object.values(ProductTypes)),
		allowNull: false,
	})
	product_type: ProductTypes;

	@Column({
		type: DataType.BOOLEAN,
		defaultValue: true,
	})
	availability: boolean;

	@Column({
		type: DataType.INTEGER,
		defaultValue: ProductStatus.ACTIVE,
	})
	status: ProductStatus;

	@Column({
		type: DataType.INTEGER,
		defaultValue: 0,
	})
	number_of_review: number;

	@Column({
		type: DataType.INTEGER,
		defaultValue: 0,
	})
	quantity?: number;

	@Column({
		type: DataType.INTEGER,
		defaultValue: 0,
	})
	sold: number;

	@Column({
		type: DataType.TEXT,
	})
	introduce?: string;

	@Column({
		type: DataType.TEXT,
	})
	description: string;

	@Column({
		type: DataType.INTEGER,
	})
	@ForeignKey(() => WarehouseModel)
	warehouse_id: number;

	@Column({
		type: DataType.INTEGER,
	})
	@ForeignKey(() => SupplierModel)
	supplier_id: number;

	@BelongsTo(() => SupplierModel)
	supplier: SupplierModel;

	@Column({
		type: DataType.STRING,
		get(): string {
			return getFullUrl(this.getDataValue("image"));
		},
	})
	image: string; // Số lượng đã bán

	@HasMany(() => ProductPhotoModel)
	product_photo: ProductPhotoModel[];

	@HasMany(() => ProductReviewModel)
	product_reviews: ProductReviewModel[];

	@HasMany(() => ProductWarehouseModel)
	product_warehouses: ProductWarehouseModel[];

	@CreatedAt
	created_at: Date;

	@UpdatedAt
	updated_at: Date;

	@DeletedAt
	deleted_at: Date;
}
