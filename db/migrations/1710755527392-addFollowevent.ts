import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFollowevent1710755527392 implements MigrationInterface {
    name = 'AddFollowevent1710755527392'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`followevent\` (\`userId\` int NOT NULL, \`eventId\` int NOT NULL, PRIMARY KEY (\`userId\`, \`eventId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`followevent\` ADD CONSTRAINT \`FK_a68983feac684ef157ebc788f4f\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`followevent\` ADD CONSTRAINT \`FK_5521b3b019a8a25f5e6db36d528\` FOREIGN KEY (\`eventId\`) REFERENCES \`event\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`followevent\` DROP FOREIGN KEY \`FK_5521b3b019a8a25f5e6db36d528\``);
        await queryRunner.query(`ALTER TABLE \`followevent\` DROP FOREIGN KEY \`FK_a68983feac684ef157ebc788f4f\``);
        await queryRunner.query(`DROP TABLE \`followevent\``);
    }

}
