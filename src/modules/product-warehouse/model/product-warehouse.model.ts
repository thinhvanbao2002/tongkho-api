import {
    BelongsTo,
    Column,
    CreatedAt,
    DataType,
    DeletedAt,
    ForeignKey,
    Model,
    Table,
    UpdatedAt,
} from "sequelize-typescript";
import { ProductModel } from "src/modules/product/model/product.model";
import { WarehouseModel } from "src/modules/warehouse/model/warehouse.model";

@Table({
    tableName: "product_warehouse",
})
export class ProductWarehouseModel extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    id: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    @ForeignKey(() => ProductModel)
    product_id: number;

    @BelongsTo(() => ProductModel)
    product: ProductModel;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    @ForeignKey(() => WarehouseModel)
    warehouse_id: number;

    @BelongsTo(() => WarehouseModel)
    warehouse: WarehouseModel;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
    })
    quantity: number;

    @CreatedAt
    created_at: Date;

    @UpdatedAt
    updated_at: Date;

    @DeletedAt
    deleted_at: Date;
} 