import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import { InjectModel } from "@nestjs/sequelize";
import { OrderModel } from "./model/order.model";
import { OrderDetailModel } from "../order-detail/model/order-detail.model";
import { OrderType } from "./types/order.type";
import { SearchOrderDto } from "./dto/search-order.dto";
import { WhereOptions } from "sequelize";
import { Op } from "sequelize";
import { CancelOrderDto } from "./dto/cancel-order.dto";
import { ProductModel } from "../product/model/product.model";
import { CustomerModel } from "../customer/model/customer.model";
import { UserModel } from "../user/model/user.model";
import { CartModel } from "../cart/model/cart.model";
import { WarehouseService } from "../warehouse/warehouse.service";

@Injectable()
export class OrderService {
	constructor(
		@InjectModel(OrderModel) private readonly orderRepository: typeof OrderModel,
		@InjectModel(OrderDetailModel) private readonly orderDetailRepository: typeof OrderDetailModel,
		@InjectModel(ProductModel) private readonly productRepository: typeof ProductModel,
		@InjectModel(CartModel) private readonly cartRepository: typeof CartModel,
		private readonly warehouseService: WarehouseService,
	) {}

	async create(createOrderDto: CreateOrderDto) {
		const { items, ...orderData } = createOrderDto;
		console.log("🚀 ~ OrderService ~ create ~ createOrderDto:", createOrderDto)

		// 1. Validate products and check inventory
		const orderItems = [];
		for (const item of items) {
			const product = await this.productRepository.findOne({
				where: { id: item.product_id }
			});

			if (!product) {
				throw new BadRequestException(`Không tìm thấy sản phẩm với ID: ${item.product_id}`);
			}

			// Check product availability
			const availability = await this.warehouseService.checkProductAvailability(
				item.product_id,
				item.product_number
			);

			if (!availability.is_available) {
				throw new BadRequestException(
					`Không đủ số lượng sản phẩm ${product.name}. Có sẵn: ${availability.available_quantity}, Yêu cầu: ${availability.required_quantity}`
				);
			}

			orderItems.push({
				product_id: item.product_id,
				quantity: item.product_number,
				price: item.total_price,
				total_price: item.total_price * item.product_number
			});
		}

		// 2. Create order and order details in transaction
		return await this.orderRepository.sequelize.transaction(async (transaction) => {
			// Create order
			const order = await this.orderRepository.create({
				...orderData,
				status: 'PENDING',
				total_price: items.reduce((sum, item) => sum + (item.total_price * item.product_number), 0)
			}, { transaction });

			// Create order details
			const orderDetails = await Promise.all(
				orderItems.map(item =>
					this.orderDetailRepository.create({
						order_id: order.id,
						product_id: item.product_id,
						quantity: item.product_number,
						price: item.price,
						total_price: item.total_price
					}, { transaction })
				)
			);

			// 3. Deduct inventory
			const inventoryDeduction = await this.warehouseService.deductInventory(
				items.map(item => ({
					product_id: item.product_id,
					quantity: item.product_number
        })),
        transaction
			);

			return {
				order,
				order_details: orderDetails,
				inventory_deduction: inventoryDeduction
			};
		});
	}

	async findAll(dto: SearchOrderDto, req: any) {
		const { from_date, to_date, type } = dto;
		const customerId = req?.user?.id;
		const dateConditions = [];
		const whereOptions: WhereOptions = {};
		whereOptions.customer_id = { [Op.eq]: customerId };
		if (from_date) {
			dateConditions.push({ [Op.gte]: from_date });
		}
		if (to_date) {
			dateConditions.push({ [Op.lte]: to_date });
		}
		if (dateConditions.length > 0) {
			whereOptions.created_at = { [Op.and]: dateConditions };
		}

		if (type) {
			whereOptions.order_status = { [Op.eq]: type };
		}
		const orders = await this.orderRepository.findAll({
			where: whereOptions,
			include: [{ model: OrderDetailModel, include: [{ model: ProductModel }] }],
			order: [["created_at", "DESC"]],
		});

		return orders;
	}

	async findOne(id: number) {
		const foundOrder = await this.orderRepository.findOne({
			where: { id: id },
			include: [
				{ model: OrderDetailModel, include: [{ model: ProductModel }] },
				{ model: CustomerModel, include: [{ model: UserModel }] },
			],
		});

		if (!foundOrder) {
			throw new NotFoundException("Đơn hàng không tồn tại!");
		}

		return foundOrder;
	}

	async cancelOrder(id: number, dto: CancelOrderDto) {
		const foundOrder = await this.orderRepository.findOne({
			where: { id: id },
		});

		if (!foundOrder) {
			throw new NotFoundException("Đơn hàng không tồn tại!");
		}

		await this.orderRepository.update(
			{
				order_status: OrderType.CANCELED,
				cancel_reason: dto.cancel_reason,
			},
			{ where: { id: id } },
		);
	}
}
