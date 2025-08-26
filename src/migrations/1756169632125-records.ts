import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class Record1756169632125 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = new Table({
      name: "records",
      columns: [
        { name: "id", type: "serial", isPrimary: true },
        { name: "user_id", type: "integer" },
        { name: "description", type: "text" },
        { name: "total", type: "numeric" },
      ],
    });
    await queryRunner.createTable(table);

    await queryRunner.createForeignKey(
      "records",
      new TableForeignKey({
        columnNames: ["user_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('records')
  }}
