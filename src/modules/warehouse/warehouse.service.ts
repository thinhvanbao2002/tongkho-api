import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { WarehouseModel } from "./model/warehouse.model";
import { CreateWarehouseDto } from "./dto/create-warehouse.dto";
import { UpdateWarehouseDto } from "./dto/update-warehouse.dto";
import { SearchWarehouseDto } from "./dto/search-warehouse.dto";
import { WhereOptions } from "sequelize";
import { Op } from "sequelize";
import { PageMetaDto } from "src/common/dto/page-meta.dto";
import { PageDto } from "src/common/dto/page.dto";

@Injectable()
export class WarehouseService {
	constructor(
		@InjectModel(WarehouseModel) private readonly warehouseRepository: typeof WarehouseModel
	) {}

	async create(createWarehouseDto: CreateWarehouseDto): Promise<WarehouseModel> {
		const { warehouse_code, warehouse_name, total_warehouse_area } = createWarehouseDto;

		return await this.warehouseRepository.create({
			warehouse_code,
			warehouse_name,
			total_warehouse_area,
		});
	}

	async findAll(dto: SearchWarehouseDto) {
		const { q, status, from_date, to_date, take, skip } = dto;
		const whereOptions: WhereOptions = {};
		const dateConditions = [];

		// if (q) {
		// 	whereOptions[Op.or] = [
		// 		{ warehouse_code: { [Op.like]: `%${q}%` } },
		// 		{ warehouse_name: { [Op.like]: `%${q}%` } }
		// 	];
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
		const warehouse = await this.warehouseRepository.findOne({
			where: { id },
		});

		if (!warehouse) {
			throw new NotFoundException("Không tìm thấy kho");
		}

		return warehouse;
	}

	async update(id: number, updateWarehouseDto: UpdateWarehouseDto) {
		const warehouse = await this.findOne(id);

		await this.warehouseRepository.update(
			{
				...updateWarehouseDto,
			},
			{
				where: { id },
			}
		);

		return await this.findOne(id);
	}

	async remove(id: number) {
		const warehouse = await this.findOne(id);
		await warehouse.destroy();
		return { message: "Xóa kho thành công" };
	}
}
