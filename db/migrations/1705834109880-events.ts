import { MigrationInterface, QueryRunner } from 'typeorm';

export class Events1705834109880 implements MigrationInterface {
  name = 'Events1705834109880';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_60328bf27019ff5498c4b97742\` ON \`account\``,
    );
    await queryRunner.query(
      `CREATE TABLE \`event\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` text NOT NULL, \`description\` text NOT NULL, \`location\` varchar(255) NOT NULL, \`imageUrl\` varchar(255) NOT NULL, \`startDateTime\` varchar(255) NOT NULL, \`endDateTime\` varchar(255) NOT NULL, \`price\` varchar(255) NOT NULL, \`lng\` decimal(17, 14) NOT NULL, \`lat\` decimal(17, 14) NOT NULL, \`isFree\` tinyint NOT NULL, \`userId\` int NULL, \`categoryId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`event\``);
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_60328bf27019ff5498c4b97742\` ON \`account\` (\`userId\`)`,
    );
  }
}