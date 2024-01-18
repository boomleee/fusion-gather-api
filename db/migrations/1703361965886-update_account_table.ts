import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateAccountTable1703361965886 implements MigrationInterface {
    name = 'UpdateAccountTable1703361965886'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`dob\` varchar(255) NOT NULL, \`phoneNumber\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`account\` ADD \`userId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`account\` ADD UNIQUE INDEX \`IDX_60328bf27019ff5498c4b97742\` (\`userId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_60328bf27019ff5498c4b97742\` ON \`account\` (\`userId\`)`);
        await queryRunner.query(`ALTER TABLE \`account\` ADD CONSTRAINT \`FK_60328bf27019ff5498c4b977421\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`account\` DROP FOREIGN KEY \`FK_60328bf27019ff5498c4b977421\``);
        await queryRunner.query(`DROP INDEX \`REL_60328bf27019ff5498c4b97742\` ON \`account\``);
        await queryRunner.query(`ALTER TABLE \`account\` DROP INDEX \`IDX_60328bf27019ff5498c4b97742\``);
        await queryRunner.query(`ALTER TABLE \`account\` DROP COLUMN \`userId\``);
        await queryRunner.query(`DROP TABLE \`user\``);
    }

}
