import { DataSource, DataSourceOptions } from 'typeorm';

// export const dataSourceOptions: DataSourceOptions = {
//   type: 'mysql',
//   host: 'localhost',
//   port: 3306,
//   username: 'root',
//   password: '123456',
//   database: 'fusiongather',
//   entities: ['dist/**/*.entity{.ts,.js}'],
//   migrations: ['dist/db/migrations/*.js'],
//   synchronize: false,
// };

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: '34.81.139.152',
  port: 3306,
  username: 'root',
  password: 'fusiongathernewgen4346134243',
  database: 'fusiongather',
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/db/migrations/*.js'],
  synchronize: false,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
