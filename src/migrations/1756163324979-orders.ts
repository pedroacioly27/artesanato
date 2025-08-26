import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class Orders1756163324979 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = new Table({
      name: "orders",
      columns: [
        { name: "id", type: "serial", isPrimary: true },
        { name: "user_id", type: "integer" },
        { name: "description", type: "text" },
        { name: "received", type: "numeric" },
        { name: "total", type: "numeric" },
        { name: "date", type: "timestamptz" },
      ],
    });
    await queryRunner.createTable(table);

    await queryRunner.createForeignKey(
      "orders",
      new TableForeignKey({
        columnNames: ["user_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("orders");
  }
}
