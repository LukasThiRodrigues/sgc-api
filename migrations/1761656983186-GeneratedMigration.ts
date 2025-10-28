import { MigrationInterface, QueryRunner } from "typeorm";

export class GeneratedMigration1761656983186 implements MigrationInterface {
    name = 'GeneratedMigration1761656983186'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`suppliers\` ADD \`creatorId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`items\` ADD \`creatorId\` int NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`items\` DROP COLUMN \`creatorId\``);
        await queryRunner.query(`ALTER TABLE \`suppliers\` DROP COLUMN \`creatorId\``);
    }

}
