import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { SupplierModel } from "./model/supplier.model";
import { CreateSupplierDto } from "./dto/create-supplier.dto";
import { UpdateSupplierDto } from "./dto/update-supplier.dto";
import { SearchSupplierDto } from "./dto/search-supplier.dto";
import { PageDto } from "src/common/dto/page.dto";
import { PageMetaDto } from "src/common/dto/page-meta.dto";
import { WhereOptions, Op } from "sequelize";

@Injectable()
export class SupplierService {
    constructor(
        @InjectModel(SupplierModel) private readonly supplierRepository: typeof SupplierModel,
    ) {}

    async create(createSupplierDto: CreateSupplierDto): Promise<SupplierModel> {
        const { supplier_code, supplier_name, phone, email } = createSupplierDto;
        const existingSupplier = await this.supplierRepository.findOne({ where: { supplier_code } });
        if (existingSupplier) {
            throw new ConflictException("Mã nhà cung cấp đã tồn tại");
        }
        return this.supplierRepository.create({
            supplier_code,
            supplier_name,
            phone,
            email,
        });
    }

    async findAll(searchDto: SearchSupplierDto): Promise<PageDto<SupplierModel>> {
        const { q, skip, take } = searchDto;
        const where: WhereOptions<SupplierModel> = {};

        if (q) {
            where[Op.or] = [
                { supplier_code: { [Op.like]: `%${q}%` } },
                { supplier_name: { [Op.like]: `%${q}%` } },
                { email: { [Op.like]: `%${q}%` } },
                { phone: { [Op.like]: `%${q}%` } },
            ];
        }

        const { rows, count } = await this.supplierRepository.findAndCountAll({
            where,
            limit: take,
            offset: skip,
            order: [["created_at", "DESC"]],
        });

        const pageMetaDto = new PageMetaDto({ itemCount: count, pageOptionsDto: searchDto });
        return new PageDto(rows, pageMetaDto);
    }

    async findOne(id: number): Promise<SupplierModel> {
        const supplier = await this.supplierRepository.findByPk(id);
        if (!supplier) {
            throw new NotFoundException("Không tìm thấy nhà cung cấp");
        }
        return supplier;
    }

    async update(id: number, updateSupplierDto: UpdateSupplierDto): Promise<SupplierModel> {
        const supplier = await this.findOne(id);
        await supplier.update(updateSupplierDto);
        return supplier;
    }

    async remove(id: number): Promise<{ message: string }> {
        const supplier = await this.findOne(id);
        await supplier.destroy();
        return { message: "Xóa nhà cung cấp thành công" };
    }
} 