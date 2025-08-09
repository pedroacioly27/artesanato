import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class Transactions1754325861618 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = new Table({
      name: "transactions",
      columns: [
        { name: "id", type: "serial", isPrimary: true },
        { name: "user_id", type: "integer" },
        { name: "description", type: "text" },
        { name: "value", type: "numeric" },
        { name: "type", type: "text" },
        { name: "date", type: "timestamptz" },
      ],
    });

    await queryRunner.createTable(table);

    await queryRunner.createForeignKey(
      "transactions",
      new TableForeignKey({
        columnNames: ["user_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("transactions");
  }
}
