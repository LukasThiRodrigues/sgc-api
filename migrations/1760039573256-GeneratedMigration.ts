import { MigrationInterface, QueryRunner } from "typeorm";

export class GeneratedMigration1760039573256 implements MigrationInterface {
    name = 'GeneratedMigration1760039573256'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`requests_items\` DROP COLUMN \`price\``);
        await queryRunner.query(`ALTER TABLE \`requests_items\` ADD \`price\` double NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`requests_items\` DROP COLUMN \`total\``);
        await queryRunner.query(`ALTER TABLE \`requests_items\` ADD \`total\` double NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`requests\` DROP COLUMN \`total\``);
        await queryRunner.query(`ALTER TABLE \`requests\` ADD \`total\` double NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`requests\` DROP COLUMN \`total\``);
        await queryRunner.query(`ALTER TABLE \`requests\` ADD \`total\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`requests_items\` DROP COLUMN \`total\``);
        await queryRunner.query(`ALTER TABLE \`requests_items\` ADD \`total\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`requests_items\` DROP COLUMN \`price\``);
        await queryRunner.query(`ALTER TABLE \`requests_items\` ADD \`price\` int NOT NULL`);
    }

}
