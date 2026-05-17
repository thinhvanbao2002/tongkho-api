import { Injectable } from "@nestjs/common";
import { CreateOverviewDto } from "./dto/create-overview.dto";
import { UpdateOverviewDto } from "./dto/update-overview.dto";
import { InjectModel } from "@nestjs/sequelize";
import { OrderModel } from "../order/model/order.model";
import { Sequelize } from "sequelize-typescript";
import { Op } from "sequelize";
import { GetRevenueByMonthDto } from "./dto/get-revenue-by-month.dto";
import { OrderType } from "../order/types/order.type";
import { UserModel } from "../user/model/user.model";
import { ProductModel } from "../product/model/product.model";
import { CategoryModel } from "../category/model/category.model";
import { UserRoles } from "../user/types/user.type";
import { OrderDetailModel } from "../order-detail/model/order-detail.model";
import { GetTopProductDto } from "./dto/get-top-product.dto";
import { QueryTypes } from "sequelize";

@Injectable()
export class OverviewService {
	constructor(
		@InjectModel(OrderModel) private readonly orderRepository: typeof OrderModel,
		@InjectModel(UserModel) private readonly userRepository: typeof UserModel,
		@InjectModel(ProductModel) private readonly productRepository: typeof ProductModel,
		@InjectModel(CategoryModel) private readonly categoryRepository: typeof CategoryModel,
		@InjectModel(OrderDetailModel) private readonly orderDetailRepository: typeof OrderDetailModel,
		private readonly sequelize: Sequelize,
	) {}
	create(createOverviewDto: CreateOverviewDto) {
		return "This action adds a new overview";
	}

	async findAll() {
		const countOrders = await this.orderRepository.count();
		const countUsers = await this.userRepository.count({
			where: { role: UserRoles.CUSTOMER },
		});
		const countProducts = await this.productRepository.count();
		const countCategories = await this.categoryRepository.count();

		return {
			countOrders,
			countUsers,
			countProducts,
			countCategories,
		};
	}

	findOne(id: number) {
		return `This action returns a #${id} overview`;
	}

	update(id: number, updateOverviewDto: UpdateOverviewDto) {
		return `This action updates a #${id} overview`;
	}

	remove(id: number) {
		return `This action removes a #${id} overview`;
	}

	async getRevenueByYear(year: string) {
		const revenues = await this.orderRepository.findAll({
			attributes: [
				[Sequelize.fn("MONTH", Sequelize.col("created_at")), "month"],
				[Sequelize.fn("SUM", Sequelize.col("total_price")), "revenue"],
			],
			where: {
				created_at: {
					[Op.between]: [`${year}-01-01`, `${year}-12-31`],
				},
				order_status: OrderType.PAID,
			},
			group: ["month"],
			order: [["month", "ASC"]],
		});

		const monthNames = [
			"Tháng 1",
			"Tháng 2",
			"Tháng 3",
			"Tháng 4",
			"Tháng 5",
			"Tháng 6",
			"Tháng 7",
			"Tháng 8",
			"Tháng 9",
			"Tháng 10",
			"Tháng 11",
			"Tháng 12",
		];

		const monthlyRevenue = monthNames.map((month, index) => ({
			month,
			revenue: 0,
		}));

		revenues.forEach(revenue => {
			const monthIndex = (revenue.get("month") as number) - 1;
			const revenueAmount = parseFloat(revenue.get("revenue") as string);
			monthlyRevenue[monthIndex].revenue = revenueAmount;
		});

		return { monthlyRevenue };
	}

	async getDailyRevenueByMonth(dto: GetRevenueByMonthDto) {
		const { year, month } = dto;

		console.log(year, month);

		const revenues = await this.orderRepository.findAll({
			attributes: [
				[Sequelize.fn("DAY", Sequelize.col("created_at")), "day"],
				[Sequelize.fn("SUM", Sequelize.col("total_price")), "revenue"],
			],
			where: {
				created_at: {
					[Op.between]: [`${year}-${month}-01`, `${year}-${month}-31`],
				},
				order_status: OrderType.PAID,
			},
			group: ["day"],
			order: [["day", "ASC"]],
		});

		const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
		const dailyRevenue = Array(daysInMonth).fill(0);

		revenues.forEach(revenue => {
			const day = revenue.get("day") as number;
			const revenueAmount = revenue.get("revenue") as string;
			dailyRevenue[day - 1] = this.formatPrice(revenueAmount);
		});

		return { year, month, dailyRevenue };
	}

	formatPrice(num: string | any, type?: "VND" | "$") {
		const tmpType = type || "";
		if (num === null || num === undefined || num === "0" || Number.isNaN(parseFloat(num))) return "";
		const result = num.toString().replace(/,/g, "");
		return `${
			result
				.toString()
				.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
				.replace(
					/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|' '|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
					"",
				) + tmpType
		}`;
	}

	async getTopProducts(dto: GetTopProductDto) {
		const currentDate = new Date();
		const { year = currentDate.getFullYear(), month = currentDate.getMonth() + 1, limit = 10 } = dto;
		const replacements: any = { limit, month, year };

		const query = 'SELECT p.id, p.name, p.product_code, p.price, p.image, ' +
			'SUM(od.product_number) AS total_quantity, ' +
			'SUM(od.price * od.product_number) AS total_revenue ' +
			'FROM order_detail od ' +
			'JOIN `order` o ON od.order_id = o.id ' +
			'JOIN product p ON od.product_id = p.id ' +
			'WHERE o.order_status = \'4\' ' +
			'AND MONTH(o.created_at) = :month ' +
			'AND YEAR(o.created_at) = :year ' +
			'GROUP BY p.id, p.name, p.product_code, p.price, p.image ' +
			'ORDER BY total_revenue DESC ' +
			'LIMIT :limit';

		const topProducts = await this.sequelize.query(query, {
			replacements,
			type: QueryTypes.SELECT,
		});

		return topProducts;
	}
}
