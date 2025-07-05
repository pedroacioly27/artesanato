import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Users1751691005856 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = new Table({
      name: "users",
      columns: [
        { name: "id", type: "serial", isPrimary: true },
        { name: "name", type: "text" },
        { name: "email", type: "text", isUnique: true },
        { name: "password", type: "text" },
      ],
    });
    await queryRunner.createTable(table);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("users");
  }
}
