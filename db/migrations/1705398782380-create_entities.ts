import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEntities1705398782380 implements MigrationInterface {
    name = 'CreateEntities1705398782380'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`qrcode\` (\`id\` int NOT NULL AUTO_INCREMENT, \`code\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`event\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` text NOT NULL, \`description\` text NOT NULL, \`location\` varchar(255) NOT NULL, \`imageUrl\` varchar(255) NOT NULL, \`startDateTime\` varchar(255) NOT NULL, \`endDateTime\` varchar(255) NOT NULL, \`price\` varchar(255) NOT NULL, \`lng\` decimal(17, 14) NOT NULL, \`lat\` decimal(17, 14) NOT NULL, \`isFree\` tinyint NOT NULL, \`userId\` int NULL, \`categoryId\` int NULL, \`qrcodeId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`booth\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`userId\` int NULL, \`eventId\` int NULL, \`qrcodeId\` int NULL, UNIQUE INDEX \`REL_11694c2c94f38364dfad7a5539\` (\`qrcodeId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`image\` (\`id\` int NOT NULL AUTO_INCREMENT, \`url\` varchar(255) NOT NULL, \`eventId\` int NULL, \`boothId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`event\` ADD CONSTRAINT \`FK_01cd2b829e0263917bf570cb672\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`event\` ADD CONSTRAINT \`FK_7812679849c61fb1dde3552e01c\` FOREIGN KEY (\`qrcodeId\`) REFERENCES \`qrcode\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`booth\` ADD CONSTRAINT \`FK_e88ed6d6b44db796d96744485cc\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`booth\` ADD CONSTRAINT \`FK_05bef39408c6c983e85b35ef861\` FOREIGN KEY (\`eventId\`) REFERENCES \`event\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`booth\` ADD CONSTRAINT \`FK_11694c2c94f38364dfad7a55398\` FOREIGN KEY (\`qrcodeId\`) REFERENCES \`qrcode\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`image\` ADD CONSTRAINT \`FK_042895d4be7cf838f0f89949705\` FOREIGN KEY (\`eventId\`) REFERENCES \`event\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`image\` ADD CONSTRAINT \`FK_dfaa32220a55361a99b9352fb8c\` FOREIGN KEY (\`boothId\`) REFERENCES \`booth\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`boothLocation\` DROP FOREIGN KEY \`FK_6af25cabf7184ca1f6d7fed7500\``);
        await queryRunner.query(`ALTER TABLE \`boothLocation\` DROP FOREIGN KEY \`FK_78523cc4fa53616a5e02838ba27\``);
        await queryRunner.query(`ALTER TABLE \`image\` DROP FOREIGN KEY \`FK_dfaa32220a55361a99b9352fb8c\``);
        await queryRunner.query(`ALTER TABLE \`image\` DROP FOREIGN KEY \`FK_042895d4be7cf838f0f89949705\``);
        await queryRunner.query(`ALTER TABLE \`booth\` DROP FOREIGN KEY \`FK_11694c2c94f38364dfad7a55398\``);
        await queryRunner.query(`ALTER TABLE \`booth\` DROP FOREIGN KEY \`FK_05bef39408c6c983e85b35ef861\``);
        await queryRunner.query(`ALTER TABLE \`booth\` DROP FOREIGN KEY \`FK_e88ed6d6b44db796d96744485cc\``);
        await queryRunner.query(`ALTER TABLE \`event\` DROP FOREIGN KEY \`FK_45e8e0655f148c8ae4dd9d0cc88\``);
        await queryRunner.query(`ALTER TABLE \`event\` DROP FOREIGN KEY \`FK_7812679849c61fb1dde3552e01c\``);
        await queryRunner.query(`ALTER TABLE \`event\` DROP FOREIGN KEY \`FK_01cd2b829e0263917bf570cb672\``);
        await queryRunner.query(`DROP INDEX \`REL_78523cc4fa53616a5e02838ba2\` ON \`boothLocation\``);
        await queryRunner.query(`DROP TABLE \`boothLocation\``);
        await queryRunner.query(`DROP TABLE \`image\``);
        await queryRunner.query(`DROP INDEX \`REL_11694c2c94f38364dfad7a5539\` ON \`booth\``);
        await queryRunner.query(`DROP TABLE \`booth\``);
        await queryRunner.query(`DROP INDEX \`REL_45e8e0655f148c8ae4dd9d0cc8\` ON \`event\``);
        await queryRunner.query(`DROP INDEX \`REL_7812679849c61fb1dde3552e01\` ON \`event\``);
        await queryRunner.query(`DROP INDEX \`REL_01cd2b829e0263917bf570cb67\` ON \`event\``);
        await queryRunner.query(`DROP TABLE \`event\``);
        await queryRunner.query(`DROP TABLE \`eventLocation\``);
        await queryRunner.query(`DROP TABLE \`qrcode\``);
    }

}
