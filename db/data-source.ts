import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'trantnhatvy2',
  database: 'fusiongather',
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/db/migrations/*.js'],
  synchronize: false,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
