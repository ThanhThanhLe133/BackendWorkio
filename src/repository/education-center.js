import db from "../models/index.js";

class EducationCenterRepository {
    async getAll() {
        return db.EducationCenter.findAll({
            include: {
                model: db.Address,
                as: 'address',
            },
        });
    }

    async getById(id) {
        return db.EducationCenter.findOne({
            where: { id },
            include: [
                {
                    model: db.Address,
                    as: 'address',
                }
            ],
        });
    }

    async create(data) {
        const transaction = await db.sequelize.transaction();
        try {
            const { address, ...centerData } = data;
            let newAddress = null;
            if (address) {
                newAddress = await db.Address.create(address, { transaction });
                centerData.address_id = newAddress.id;
            }
            const newCenter = await db.EducationCenter.create(centerData, { transaction });
            await transaction.commit();
            return newCenter;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async update(id, data) {
        const transaction = await db.sequelize.transaction();
        try {
            const { address, ...centerData } = data;
            const center = await db.EducationCenter.findByPk(id);
            if (!center) {
                throw new Error("EducationCenter not found");
            }

            if (address) {
                if (center.address_id) {
                    await db.Address.update(address, {
                        where: { id: center.address_id },
                        transaction
                    });
                } else {
                    const newAddress = await db.Address.create(address, { transaction });
                    centerData.address_id = newAddress.id;
                }
            }

            await db.EducationCenter.update(centerData, {
                where: { id },
                transaction
            });

            await transaction.commit();
            return await this.getById(id);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async delete(id) {
        return db.EducationCenter.destroy({ where: { id } });
    }
}

export { EducationCenterRepository };
