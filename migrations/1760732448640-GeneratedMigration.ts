import { MigrationInterface, QueryRunner } from "typeorm";

export class GeneratedMigration1760732448640 implements MigrationInterface {
    name = 'GeneratedMigration1760732448640'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`requests\` ADD \`reason\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`requests\` DROP COLUMN \`reason\``);
    }

}
