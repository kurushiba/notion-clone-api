import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNote1762322419326 implements MigrationInterface {
    name = 'AddNote1762322419326'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "notes" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "userId" varchar NOT NULL, "title" varchar, "content" text, "parentId" integer, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE INDEX "IDX_829532ff766505ad7c71592c6a" ON "notes" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a6d728a29941461d789c7c98f3" ON "notes" ("parentId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a515a13f03ef7ad02efeedc071" ON "notes" ("createdAt") `);
        await queryRunner.query(`DROP INDEX "IDX_829532ff766505ad7c71592c6a"`);
        await queryRunner.query(`DROP INDEX "IDX_a6d728a29941461d789c7c98f3"`);
        await queryRunner.query(`DROP INDEX "IDX_a515a13f03ef7ad02efeedc071"`);
        await queryRunner.query(`CREATE TABLE "temporary_notes" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "userId" varchar NOT NULL, "title" varchar, "content" text, "parentId" integer, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_829532ff766505ad7c71592c6a5" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_a6d728a29941461d789c7c98f3d" FOREIGN KEY ("parentId") REFERENCES "notes" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_notes"("id", "userId", "title", "content", "parentId", "createdAt", "updatedAt") SELECT "id", "userId", "title", "content", "parentId", "createdAt", "updatedAt" FROM "notes"`);
        await queryRunner.query(`DROP TABLE "notes"`);
        await queryRunner.query(`ALTER TABLE "temporary_notes" RENAME TO "notes"`);
        await queryRunner.query(`CREATE INDEX "IDX_829532ff766505ad7c71592c6a" ON "notes" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a6d728a29941461d789c7c98f3" ON "notes" ("parentId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a515a13f03ef7ad02efeedc071" ON "notes" ("createdAt") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_a515a13f03ef7ad02efeedc071"`);
        await queryRunner.query(`DROP INDEX "IDX_a6d728a29941461d789c7c98f3"`);
        await queryRunner.query(`DROP INDEX "IDX_829532ff766505ad7c71592c6a"`);
        await queryRunner.query(`ALTER TABLE "notes" RENAME TO "temporary_notes"`);
        await queryRunner.query(`CREATE TABLE "notes" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "userId" varchar NOT NULL, "title" varchar, "content" text, "parentId" integer, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "notes"("id", "userId", "title", "content", "parentId", "createdAt", "updatedAt") SELECT "id", "userId", "title", "content", "parentId", "createdAt", "updatedAt" FROM "temporary_notes"`);
        await queryRunner.query(`DROP TABLE "temporary_notes"`);
        await queryRunner.query(`CREATE INDEX "IDX_a515a13f03ef7ad02efeedc071" ON "notes" ("createdAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_a6d728a29941461d789c7c98f3" ON "notes" ("parentId") `);
        await queryRunner.query(`CREATE INDEX "IDX_829532ff766505ad7c71592c6a" ON "notes" ("userId") `);
        await queryRunner.query(`DROP INDEX "IDX_a515a13f03ef7ad02efeedc071"`);
        await queryRunner.query(`DROP INDEX "IDX_a6d728a29941461d789c7c98f3"`);
        await queryRunner.query(`DROP INDEX "IDX_829532ff766505ad7c71592c6a"`);
        await queryRunner.query(`DROP TABLE "notes"`);
    }

}
