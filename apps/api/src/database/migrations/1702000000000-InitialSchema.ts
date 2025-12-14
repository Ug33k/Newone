import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1702000000000 implements MigrationInterface {
  name = 'InitialSchema1702000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create permissions table
    await queryRunner.query(`
      CREATE TABLE "permissions" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" varchar NOT NULL UNIQUE,
        "description" text,
        "created_at" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    // Create users table
    await queryRunner.query(`
      CREATE TYPE "user_role_enum" AS ENUM ('admin', 'user', 'guest')
    `);

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "email" varchar NOT NULL UNIQUE,
        "name" varchar NOT NULL,
        "role" "user_role_enum" NOT NULL DEFAULT 'user',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    // Create user_permissions junction table
    await queryRunner.query(`
      CREATE TABLE "user_permissions" (
        "user_id" uuid NOT NULL,
        "permission_id" uuid NOT NULL,
        CONSTRAINT "FK_user_permissions_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_user_permissions_permission" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE,
        PRIMARY KEY ("user_id", "permission_id")
      )
    `);

    // Create boards table
    await queryRunner.query(`
      CREATE TABLE "boards" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" varchar NOT NULL,
        "user_id" uuid NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "FK_boards_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    // Create columns table
    await queryRunner.query(`
      CREATE TABLE "columns" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "board_id" uuid NOT NULL,
        "name" varchar NOT NULL,
        "order" integer NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "FK_columns_board" FOREIGN KEY ("board_id") REFERENCES "boards"("id") ON DELETE CASCADE
      )
    `);

    // Create swimlanes table
    await queryRunner.query(`
      CREATE TABLE "swimlanes" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "board_id" uuid NOT NULL,
        "name" varchar NOT NULL,
        "order" integer NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "FK_swimlanes_board" FOREIGN KEY ("board_id") REFERENCES "boards"("id") ON DELETE CASCADE
      )
    `);

    // Create class_services table
    await queryRunner.query(`
      CREATE TABLE "class_services" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "board_id" uuid NOT NULL,
        "name" varchar NOT NULL,
        "color" varchar,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "FK_class_services_board" FOREIGN KEY ("board_id") REFERENCES "boards"("id") ON DELETE CASCADE
      )
    `);

    // Create cards table
    await queryRunner.query(`
      CREATE TABLE "cards" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "column_id" uuid NOT NULL,
        "swimlane_id" uuid,
        "class_service_id" uuid,
        "title" varchar NOT NULL,
        "description" text,
        "position" integer NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "FK_cards_column" FOREIGN KEY ("column_id") REFERENCES "columns"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_cards_swimlane" FOREIGN KEY ("swimlane_id") REFERENCES "swimlanes"("id") ON DELETE SET NULL,
        CONSTRAINT "FK_cards_class_service" FOREIGN KEY ("class_service_id") REFERENCES "class_services"("id") ON DELETE SET NULL
      )
    `);

    // Create column_history table
    await queryRunner.query(`
      CREATE TABLE "column_history" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "card_id" uuid NOT NULL,
        "from_column_id" uuid,
        "to_column_id" uuid NOT NULL,
        "moved_by" uuid,
        "moved_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "FK_column_history_card" FOREIGN KEY ("card_id") REFERENCES "cards"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_column_history_from_column" FOREIGN KEY ("from_column_id") REFERENCES "columns"("id") ON DELETE SET NULL,
        CONSTRAINT "FK_column_history_to_column" FOREIGN KEY ("to_column_id") REFERENCES "columns"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_column_history_moved_by" FOREIGN KEY ("moved_by") REFERENCES "users"("id") ON DELETE SET NULL
      )
    `);

    // Create metrics table
    await queryRunner.query(`
      CREATE TABLE "metrics" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "card_id" uuid NOT NULL,
        "name" varchar NOT NULL,
        "value" decimal(10, 2) NOT NULL,
        "recorded_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "FK_metrics_card" FOREIGN KEY ("card_id") REFERENCES "cards"("id") ON DELETE CASCADE
      )
    `);

    // Create indexes for better query performance
    await queryRunner.query(
      `CREATE INDEX "IDX_boards_user_id" ON "boards" ("user_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_columns_board_id" ON "columns" ("board_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_swimlanes_board_id" ON "swimlanes" ("board_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_class_services_board_id" ON "class_services" ("board_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cards_column_id" ON "cards" ("column_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cards_swimlane_id" ON "cards" ("swimlane_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cards_class_service_id" ON "cards" ("class_service_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_column_history_card_id" ON "column_history" ("card_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_metrics_card_id" ON "metrics" ("card_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX "IDX_metrics_card_id"`);
    await queryRunner.query(`DROP INDEX "IDX_column_history_card_id"`);
    await queryRunner.query(`DROP INDEX "IDX_cards_class_service_id"`);
    await queryRunner.query(`DROP INDEX "IDX_cards_swimlane_id"`);
    await queryRunner.query(`DROP INDEX "IDX_cards_column_id"`);
    await queryRunner.query(`DROP INDEX "IDX_class_services_board_id"`);
    await queryRunner.query(`DROP INDEX "IDX_swimlanes_board_id"`);
    await queryRunner.query(`DROP INDEX "IDX_columns_board_id"`);
    await queryRunner.query(`DROP INDEX "IDX_boards_user_id"`);

    // Drop tables in reverse order
    await queryRunner.query(`DROP TABLE "metrics"`);
    await queryRunner.query(`DROP TABLE "column_history"`);
    await queryRunner.query(`DROP TABLE "cards"`);
    await queryRunner.query(`DROP TABLE "class_services"`);
    await queryRunner.query(`DROP TABLE "swimlanes"`);
    await queryRunner.query(`DROP TABLE "columns"`);
    await queryRunner.query(`DROP TABLE "boards"`);
    await queryRunner.query(`DROP TABLE "user_permissions"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "user_role_enum"`);
    await queryRunner.query(`DROP TABLE "permissions"`);
  }
}
