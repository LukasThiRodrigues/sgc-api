import { MigrationInterface, QueryRunner } from "typeorm";

export class GeneratedMigration1759688440033 implements MigrationInterface {
    name = 'GeneratedMigration1759688440033'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`requests\` CHANGE \`deliveredAt\` \`deliveredAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`requests\` CHANGE \`deliveredAt\` \`deliveredAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
    }

}
