import { MigrationInterface, QueryRunner } from "typeorm";

export class Deleteimageurl1710921743537 implements MigrationInterface {
    name = 'Deleteimageurl1710921743537'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`event\` DROP COLUMN \`imageUrl\``);
        await queryRunner.query(`ALTER TABLE \`image\` ADD CONSTRAINT \`FK_042895d4be7cf838f0f89949705\` FOREIGN KEY (\`eventId\`) REFERENCES \`event\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`image\` ADD CONSTRAINT \`FK_dfaa32220a55361a99b9352fb8c\` FOREIGN KEY (\`boothId\`) REFERENCES \`booth\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`image\` DROP FOREIGN KEY \`FK_dfaa32220a55361a99b9352fb8c\``);
        await queryRunner.query(`ALTER TABLE \`image\` DROP FOREIGN KEY \`FK_042895d4be7cf838f0f89949705\``);
        await queryRunner.query(`ALTER TABLE \`event\` ADD \`imageUrl\` varchar(255) NOT NULL`);
    }

}
