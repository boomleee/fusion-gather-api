import { MigrationInterface, QueryRunner } from 'typeorm';

export class Category1706099031853 implements MigrationInterface {
  name = 'Category1706099031853';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`category\` (\`id\` int NOT NULL AUTO_INCREMENT, \`categoryName\` text NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );

    await queryRunner.query(
      `ALTER TABLE \`event\` ADD CONSTRAINT \`FK_d44e52c4ca04619ef9b61a11982\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`event\` DROP FOREIGN KEY \`FK_d44e52c4ca04619ef9b61a11982\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`event\` DROP FOREIGN KEY \`FK_01cd2b829e0263917bf570cb672\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`account\` DROP FOREIGN KEY \`FK_60328bf27019ff5498c4b977421\``,
    );
    await queryRunner.query(`DROP TABLE \`event\``);
    await queryRunner.query(`DROP TABLE \`dummy\``);
    await queryRunner.query(`DROP TABLE \`category\``);
    await queryRunner.query(
      `DROP INDEX \`REL_60328bf27019ff5498c4b97742\` ON \`account\``,
    );
    await queryRunner.query(`DROP TABLE \`account\``);
    await queryRunner.query(`DROP TABLE \`user\``);
  }
}
