import { MigrationInterface, QueryRunner } from "typeorm";

export class Deleteimageurl1710921743537 implements MigrationInterface {
    name = 'Deleteimageurl1710921743537'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`event\` DROP COLUMN \`imageUrl\``);
        }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`image\` DROP FOREIGN KEY \`FK_dfaa32220a55361a99b9352fb8c\``);
        await queryRunner.query(`ALTER TABLE \`image\` DROP FOREIGN KEY \`FK_042895d4be7cf838f0f89949705\``);
        await queryRunner.query(`ALTER TABLE \`event\` ADD \`imageUrl\` varchar(255) NOT NULL`);
    }

}
