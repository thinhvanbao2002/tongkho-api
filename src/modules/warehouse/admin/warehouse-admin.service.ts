import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { WarehouseModel } from "../model/warehouse.model";
import { CreateWarehouseDto } from "../dto/create-warehouse.dto";
import { UpdateWarehouseDto } from "../dto/update-warehouse.dto";
import { SearchWarehouseDto } from "../dto/search-warehouse.dto";
import { QueryTypes, WhereOptions } from "sequelize";
import { Op } from "sequelize";
import { PageDto } from "src/common/dto/page.dto";
import { PageMetaDto } from "src/common/dto/page-meta.dto";
import { Sequelize } from "sequelize-typescript";

const modelName = "warehouse";

@Injectable()
export class WarehouseAdminService {
    constructor(
        @InjectModel(WarehouseModel) private readonly warehouseRepository: typeof WarehouseModel,
        private readonly sequelize: Sequelize,
    ) {}

    async create(createWarehouseDto: CreateWarehouseDto): Promise<WarehouseModel> {
        const { warehouse_code, warehouse_name, total_warehouse_area } = createWarehouseDto;

        const [result] = await this.sequelize.query(
            `insert into ${modelName} (warehouse_code, warehouse_name, total_warehouse_area, created_at, updated_at) 
            values (:warehouse_code, :warehouse_name, :total_warehouse_area, NOW(), NOW())`,
            {
                replacements: { warehouse_code, warehouse_name, total_warehouse_area },
                type: QueryTypes.INSERT,
            },
        );
        return result[0] as WarehouseModel;
    }

    async findAll(dto: SearchWarehouseDto) {
        const { q, status, from_date, to_date, take, skip } = dto;
        const whereOptions: WhereOptions = {};
        const dateConditions = [];

        // if (q) {
        //     whereOptions[Op.or] = [
        //         { warehouse_code: { [Op.like]: `%${q}%` } },
        //         { warehouse_name: { [Op.like]: `%${q}%` } }
        //     ] as unknown as WhereOptions;
        // }

        if (status) {
            whereOptions.status = { [Op.eq]: status };
        }

        if (from_date) {
            dateConditions.push({
                [Op.gte]: from_date,
            });
        }
        if (to_date) {
            dateConditions.push({ [Op.lte]: to_date });
        }
        if (dateConditions.length > 0) {
            whereOptions.created_at = { [Op.and]: dateConditions };
        }

        const warehouses = await this.warehouseRepository.findAndCountAll({
            where: whereOptions,
            order: [["created_at", "DESC"]],
            limit: take,
            offset: skip,
        });

        return new PageDto(warehouses.rows, new PageMetaDto({ itemCount: warehouses.count, pageOptionsDto: dto }));
    }

    async findOne(id: number) {
        const warehouse = await this.sequelize.query(`select * from ${modelName} where id = :id`, {
            replacements: { id },
            type: QueryTypes.SELECT,
        });

        if (!warehouse) {
            throw new NotFoundException("Không tìm thấy kho");
        }

        return warehouse;
    }

    async update(id: number, updateWarehouseDto: UpdateWarehouseDto): Promise<void> {
        const { warehouse_code, warehouse_name, total_warehouse_area, status } = updateWarehouseDto;
        const foundWarehouse = await this.warehouseRepository.findOne({
            where: { id },
        });

        if (!foundWarehouse) {
            throw new NotFoundException("Không tìm thấy kho");
        }

        await this.warehouseRepository.update(
            {
                warehouse_code,
                warehouse_name,
                total_warehouse_area,
                status,
            },
            {
                where: { id },
            },
        );
    }

    async remove(id: number) {
        const warehouse = await this.findOne(id);
        await this.warehouseRepository.destroy({
            where: { id },
        });
        return { message: "Xóa kho thành công" };
    }
} 