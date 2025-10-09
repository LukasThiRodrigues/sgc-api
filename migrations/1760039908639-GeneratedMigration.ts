import { MigrationInterface, QueryRunner } from "typeorm";

export class GeneratedMigration1760039908639 implements MigrationInterface {
    name = 'GeneratedMigration1760039908639'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`requests\` CHANGE \`description\` \`description\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`requests\` CHANGE \`description\` \`description\` varchar(255) NOT NULL`);
    }

}
