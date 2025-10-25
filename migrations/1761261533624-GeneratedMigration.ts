import { MigrationInterface, QueryRunner } from "typeorm";

export class GeneratedMigration1761261533624 implements MigrationInterface {
    name = 'GeneratedMigration1761261533624'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`requests\` ADD \`quotationId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`requests\` ADD \`proposalId\` int NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`requests\` DROP COLUMN \`proposalId\``);
        await queryRunner.query(`ALTER TABLE \`requests\` DROP COLUMN \`quotationId\``);
    }

}
