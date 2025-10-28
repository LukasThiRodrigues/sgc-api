import { MigrationInterface, QueryRunner } from "typeorm";

export class GeneratedMigration1761399846307 implements MigrationInterface {
    name = 'GeneratedMigration1761399846307'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`requests\` DROP COLUMN \`deliveredAt\``);
        await queryRunner.query(`ALTER TABLE \`requests\` ADD \`deliveredAt\` timestamp NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`requests\` DROP COLUMN \`deliveredAt\``);
        await queryRunner.query(`ALTER TABLE \`requests\` ADD \`deliveredAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6)`);
    }

}
