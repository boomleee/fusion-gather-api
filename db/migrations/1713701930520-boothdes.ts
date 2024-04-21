import { MigrationInterface, QueryRunner } from "typeorm";

export class Boothdes1713701930520 implements MigrationInterface {
    name = 'Boothdes1713701930520'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`booth\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`booth\` ADD \`description\` text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`booth\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`booth\` ADD \`description\` varchar(255) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_0900_ai_ci" NOT NULL`);
    }

}
