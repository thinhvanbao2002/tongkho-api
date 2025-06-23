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
import { WarehouseModel } from "./warehouse.model";
import { SupplierModel } from "src/modules/supplier/model/supplier.model";

@Table({
    tableName: "warehouse_import_history",
})
export class WarehouseImportHistoryModel extends Model {
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
        allowNull: true,
    })
    @ForeignKey(() => SupplierModel)
    supplier_id: number;

    @BelongsTo(() => SupplierModel)
    supplier: SupplierModel;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    quantity: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    staff_name: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    staff_id: number;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    import_date: Date;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    note: string;

    @CreatedAt
    created_at: Date;

    @UpdatedAt
    updated_at: Date;

    @DeletedAt
    deleted_at: Date;
} 