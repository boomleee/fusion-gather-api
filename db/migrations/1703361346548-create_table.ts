import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTable1703361346548 implements MigrationInterface {
    name = 'CreateTable1703361346548'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`account\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`isVerified\` tinyint NOT NULL DEFAULT 0, \`isActivated\` tinyint NOT NULL DEFAULT 1, \`verificationCode\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`dummy\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, \`dob\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`dummy\``);
        await queryRunner.query(`DROP TABLE \`account\``);
    }

}
