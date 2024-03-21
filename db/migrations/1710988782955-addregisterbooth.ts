import { MigrationInterface, QueryRunner } from "typeorm";

export class Addregisterbooth1710988782955 implements MigrationInterface {
    name = 'Addregisterbooth1710988782955'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`registerbooth\` (\`userId\` int NOT NULL, \`boothId\` int NOT NULL, \`reason\` varchar(255) NOT NULL, PRIMARY KEY (\`userId\`, \`boothId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`registerbooth\` ADD CONSTRAINT \`FK_6cea71ae7e005997ad3a15aa770\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`registerbooth\` ADD CONSTRAINT \`FK_bbd6e985ab10719c6b0c2494ebd\` FOREIGN KEY (\`boothId\`) REFERENCES \`booth\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`registerbooth\` DROP FOREIGN KEY \`FK_bbd6e985ab10719c6b0c2494ebd\``);
        await queryRunner.query(`ALTER TABLE \`registerbooth\` DROP FOREIGN KEY \`FK_6cea71ae7e005997ad3a15aa770\``);
        await queryRunner.query(`DROP TABLE \`registerbooth\``);
    }

}
