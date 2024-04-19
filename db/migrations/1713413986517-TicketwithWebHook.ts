import { MigrationInterface, QueryRunner } from "typeorm";

export class TicketwithWebHook1713413986517 implements MigrationInterface {
    name = 'TicketwithWebHook1713413986517'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_49b4a839e33590d1f711489597\` ON \`payment\``);
        await queryRunner.query(`ALTER TABLE \`ticket\` ADD \`paidStatus\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`ticket\` DROP COLUMN \`paidStatus\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_49b4a839e33590d1f711489597\` ON \`payment\` (\`ticketId\`)`);
    }

}
