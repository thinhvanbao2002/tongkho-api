import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { SearchOrderAdminDto } from "../dto/search-order-admin.dto";
import { Sequelize, WhereOptions } from "sequelize";
import { Op } from "sequelize";
import { InjectModel } from "@nestjs/sequelize";
import { OrderModel } from "../model/order.model";
import { OrderDetailModel } from "src/modules/order-detail/model/order-detail.model";
import { PageDto } from "src/common/dto/page.dto";
import { PageMetaDto } from "src/common/dto/page-meta.dto";
import { UserModel } from "src/modules/user/model/user.model";
import { ProductModel } from "src/modules/product/model/product.model";
import { UpdateOrderDto } from "../dto/update-order.dto";
import { OrderType, PayTypes } from "../types/order.type";
import * as ExcelJS from "exceljs";
import { vldOrderStatus } from "src/common/helpers/ultils";
import { format } from "date-fns";
import * as moment from "moment";

@Injectable()
export class OrderAdminService {
	private readonly EXCEL_FILE_PATH = 'uploads/excels';
	private readonly DEFAULT_INCLUDE = [
		{ 
			model: OrderDetailModel, 
			include: [{ model: ProductModel }] 
		},
		{ 
			model: UserModel, 
			attributes: ["name", "phone", "email", "role"] 
		}
	];

	constructor(
		@InjectModel(OrderModel) private readonly orderRp: typeof OrderModel,
		@InjectModel(OrderDetailModel) private readonly orderDetailRp: typeof OrderDetailModel,
	) {}

	private buildSearchWhereConditions(dto: SearchOrderAdminDto): WhereOptions {
		const { q, order_status, from_date, to_date } = dto;
		const whereOptions: WhereOptions = {};
		const dateConditions = [];

		if (q) {
			whereOptions.id = {
				[Op.in]: [
					Sequelize.literal(
						`select o.id from \`order\` as o
						join user on o.customer_id = user.id
						where user.name like '%${q}%'`
					),
				],
			};
		}

		if (order_status) {
			whereOptions.order_status = { [Op.eq]: order_status };
		}

		if (from_date) {
			dateConditions.push({ 
				[Op.gte]: moment(from_date).startOf("date").toDate() 
			});
		}
		
		if (to_date) {
			dateConditions.push({ 
				[Op.lte]: moment(to_date).endOf("date").toDate() 
			});
		}

		if (dateConditions.length > 0) {
			whereOptions.created_at = { [Op.and]: dateConditions };
		}

		return whereOptions;
	}

	private async validateOrderExists(id: number): Promise<OrderModel> {
		const order = await this.orderRp.findByPk(id);
		if (!order) {
			throw new NotFoundException("Đơn hàng không tồn tại!");
		}
		return order;
	}

	async findAll(dto: SearchOrderAdminDto) {
		const whereOptions = this.buildSearchWhereConditions(dto);

		const orders = await this.orderRp.findAndCountAll({
			where: whereOptions,
			include: this.DEFAULT_INCLUDE,
			distinct: true,
			order: [["created_at", "DESC"]],
			limit: dto.take,
			offset: dto.skip,
		});

		return new PageDto(
			orders.rows, 
			new PageMetaDto({ 
				itemCount: orders.count, 
				pageOptionsDto: dto 
			})
		);
	}

	async findOne(id: number) {
		const order = await this.orderRp.findOne({
			where: { id },
			include: [{ 
				model: OrderDetailModel, 
				include: [{ model: ProductModel }] 
			}],
		});

		if (!order) {
			throw new NotFoundException("Đơn hàng không tồn tại!");
		}

		return order;
	}

	async update(id: number, dto: UpdateOrderDto) {
		await this.validateOrderExists(id);
		
		const updateData = {
			order_status: dto.order_status,
			pay_type: dto.order_status === OrderType.PAID ? 
					 PayTypes.PAID : 
					 dto.pay_type
		};

		await this.orderRp.update(updateData, {
			where: { id }
		});
	}

	async delete(id: number) {
		await this.validateOrderExists(id);
		await this.orderRp.destroy({ where: { id } });
	}

	async cancelOrder(id: number) {
		await this.validateOrderExists(id);
		
		await this.orderRp.update(
			{ order_status: OrderType.CANCELED },
			{ where: { id } }
		);
	}

	async trigerWorkFlow(id: number) {
		const order = await this.validateOrderExists(id);
		const maxStep = Number(OrderType.PAID);
		const newStatus = Number(order.order_status) + 1;

		if (newStatus > maxStep) {
			throw new BadRequestException("Đơn hàng đã hoàn thành!");
		}

		await this.orderRp.update(
			{ order_status: newStatus },
			{ where: { id } }
		);

		return newStatus;
	}

	async exportOrders(dto: SearchOrderAdminDto) {
		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet("Báo cáo danh sách sản phẩm");

		this.setupExcelWorksheet(worksheet);

		await this.populateExcelData(worksheet, dto);

		const fileName = this.generateExcelFileName();
		const filePath = `${this.EXCEL_FILE_PATH}/${fileName}`;
		const fileUrl = `${process.env.API_BASE_URL}/${filePath}`;

		await workbook.xlsx.writeFile(filePath);
		return fileUrl;
	}

	private setupExcelWorksheet(worksheet: ExcelJS.Worksheet) {
		worksheet.columns = [
			{ header: "STT", key: "index", width: 10 },
			{ header: "Tên khách hàng", key: "name", width: 30 },
			{ header: "Số điện thoại", key: "phone", width: 30 },
			{ header: "Số lượng sản phẩm", key: "number", width: 30 },
			{ header: "Ngày đặt hàng", key: "created", width: 30 },
			{ header: "Trạng thái", key: "status", width: 30 },
			{ header: "Địa chỉ", key: "address", width: 30 },
		];

		worksheet.getRow(1).font = { bold: true };
	}

	private async populateExcelData(worksheet: ExcelJS.Worksheet, dto: SearchOrderAdminDto) {
		let hasNextData = true;
		let index = 1;

		while (hasNextData) {
			const pagedOrders = await this.findAll(dto);
			
			pagedOrders.data.forEach(order => {
				worksheet.addRow({
					index: index++,
					name: order?.customer?.name,
					phone: order?.customer?.phone,
					number: order?.order_details.length,
					created: order?.created_at,
					status: vldOrderStatus(order.order_status),
					address: order?.address,
				});
			});

			hasNextData = pagedOrders.data.length > 0;
			dto.page++;
		}
	}

	private generateExcelFileName(): string {
		const currentDate = format(new Date(), "dd-MM-yyyy_HH-mm-ss");
		return `DanhSachDonHang_${currentDate}.xlsx`;
	}
}
