import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDatabase1577001975946 implements MigrationInterface {
    public name = 'InitDatabase1577001975946';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `CREATE TABLE "comment" ("id" SERIAL NOT NULL, "createAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "rating" double precision NOT NULL, "content" character varying(100) NOT NULL, "createById" integer, "dishId" integer, CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`,
            undefined
        );
        await queryRunner.query(
            `CREATE TABLE "dish" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "description" character varying, "images" text array NOT NULL, "defaultPrice" double precision NOT NULL DEFAULT 0, CONSTRAINT "PK_59ac7b35af39b231276bfc4c00c" PRIMARY KEY ("id"))`,
            undefined
        );
        await queryRunner.query(
            `CREATE TABLE "bill_dish" ("billHistoryId" integer NOT NULL, "dishId" integer NOT NULL, "note" character varying, "preparedAt" TIMESTAMP WITH TIME ZONE, "deliveryAt" TIMESTAMP WITH TIME ZONE, "quantity" smallint NOT NULL DEFAULT 1, "price" double precision, CONSTRAINT "PK_9180acd08c6924e21d348fd4d17" PRIMARY KEY ("billHistoryId", "dishId"))`,
            undefined
        );
        await queryRunner.query(
            `CREATE TABLE "bill_history" ("id" SERIAL NOT NULL, "billId" integer NOT NULL, "description" character varying, "createAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" integer NOT NULL, CONSTRAINT "PK_9462a962e4171a3a08408d6b268" PRIMARY KEY ("id"))`,
            undefined
        );
        await queryRunner.query(
            `CREATE TABLE "discount_campaign_dish" ("discountCampaignId" integer NOT NULL, "dishId" integer NOT NULL, "discount" integer, CONSTRAINT "PK_7d447a52f5e35335a16a61f7e6e" PRIMARY KEY ("discountCampaignId", "dishId"))`,
            undefined
        );
        await queryRunner.query(
            `CREATE TABLE "discount_campaign" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "description" character varying, "banner" character varying(100), "startAt" TIMESTAMP WITH TIME ZONE NOT NULL, "endAt" TIMESTAMP WITH TIME ZONE NOT NULL, "defaultDiscount" integer NOT NULL, CONSTRAINT "PK_430da5eeb2fa9e30b0e022daabb" PRIMARY KEY ("id"))`,
            undefined
        );
        await queryRunner.query(
            `CREATE TABLE "discount_code" ("code" character varying(10) NOT NULL, "isActive" boolean NOT NULL DEFAULT false, "name" character varying(100) NOT NULL, "description" character varying, "startAt" TIMESTAMP WITH TIME ZONE NOT NULL, "endAt" TIMESTAMP WITH TIME ZONE NOT NULL, "minBillPrice" double precision, "maxPriceDiscount" double precision, "maxNumber" integer, "discount" integer NOT NULL, CONSTRAINT "PK_9f3bda83ef88511179d386a6b15" PRIMARY KEY ("code"))`,
            undefined
        );
        await queryRunner.query(
            `CREATE TABLE "store_dish" ("storeId" integer NOT NULL, "dishId" integer NOT NULL, "price" double precision, CONSTRAINT "PK_2672bf15a6f38568ba90a257e2b" PRIMARY KEY ("storeId", "dishId"))`,
            undefined
        );
        await queryRunner.query(
            `CREATE TABLE "voucher_code" ("code" character varying(10) NOT NULL, "isActive" boolean NOT NULL DEFAULT false, "isPercent" boolean NOT NULL DEFAULT true, "name" character varying(100) NOT NULL, "description" character varying, "image" character varying(100), "startAt" TIMESTAMP WITH TIME ZONE NOT NULL, "endAt" TIMESTAMP WITH TIME ZONE NOT NULL, "minBillPrice" double precision, "maxPriceDiscount" double precision, "value" integer NOT NULL, "customerId" integer, CONSTRAINT "PK_7c8b99834e64faa38f7927070cf" PRIMARY KEY ("code"))`,
            undefined
        );
        await queryRunner.query(
            `CREATE TABLE "stock" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "price" double precision NOT NULL, "unit" character varying(20) NOT NULL, "image" text, CONSTRAINT "PK_092bc1fc7d860426a1dec5aa8e9" PRIMARY KEY ("id"))`,
            undefined
        );
        await queryRunner.query(
            `CREATE TABLE "daily_report_stock" ("dailyReportId" integer NOT NULL, "stockId" integer NOT NULL, "note" character varying, "quantity" smallint NOT NULL DEFAULT 1, CONSTRAINT "PK_ea42bfbfe745f0a95eb6a087fe0" PRIMARY KEY ("dailyReportId", "stockId"))`,
            undefined
        );
        await queryRunner.query(
            `CREATE TABLE "daily_report" ("id" SERIAL NOT NULL, "note" character varying, "createAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updateAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "warehouseId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_6f51b9eb292151755dc3ade12b1" PRIMARY KEY ("id"))`,
            undefined
        );
        await queryRunner.query(
            `CREATE TABLE "import_bill_stock" ("importBillId" integer NOT NULL, "stockId" integer NOT NULL, "note" character varying, "quantity" smallint NOT NULL DEFAULT 1, "price" double precision, CONSTRAINT "PK_8c7f29ff9c62d016272e6471bcd" PRIMARY KEY ("importBillId", "stockId"))`,
            undefined
        );
        await queryRunner.query(
            `CREATE TABLE "import_bill" ("id" SERIAL NOT NULL, "note" character varying, "createAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updateAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "warehouseId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_5805308b3811de7fa78c527506d" PRIMARY KEY ("id"))`,
            undefined
        );
        await queryRunner.query(
            `CREATE TABLE "warehouse_stock" ("warehouseId" integer NOT NULL, "stockId" integer NOT NULL, "quantity" integer NOT NULL DEFAULT 0, CONSTRAINT "PK_cc337fd27009da7b73c18ed9657" PRIMARY KEY ("warehouseId", "stockId"))`,
            undefined
        );
        await queryRunner.query(
            `CREATE TABLE "warehouse" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "description" character varying, "address" character varying(200) NOT NULL, "hotline" character varying(20) NOT NULL, "storeId" integer, CONSTRAINT "PK_965abf9f99ae8c5983ae74ebde8" PRIMARY KEY ("id"))`,
            undefined
        );
        await queryRunner.query(
            `CREATE TABLE "store" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "description" character varying, "logo" character varying, "address" character varying(200) NOT NULL, "hotline" character varying(20) NOT NULL, "rating" double precision NOT NULL DEFAULT 0, "openTime" TIME, "closeTime" TIME, CONSTRAINT "PK_f3172007d4de5ae8e7692759d79" PRIMARY KEY ("id"))`,
            undefined
        );
        await queryRunner.query(
            `CREATE TYPE "daily_dish_session_enum" AS ENUM('none', 'morning', 'noon', 'afternoon', 'evening')`,
            undefined
        );
        await queryRunner.query(
            `CREATE TABLE "daily_dish" ("day" date NOT NULL, "session" "daily_dish_session_enum" NOT NULL DEFAULT 'none', "storeId" integer NOT NULL, "dishId" integer NOT NULL, "confirmAt" TIMESTAMP WITH TIME ZONE, "confirmById" integer, CONSTRAINT "PK_7da51f529f98b4432048f2d6af7" PRIMARY KEY ("day", "session", "storeId", "dishId"))`,
            undefined
        );
        await queryRunner.query(
            `CREATE TABLE "role" ("id" SERIAL NOT NULL, "slug" character varying(20) NOT NULL, "name" character varying(100) NOT NULL, "description" character varying, "level" integer NOT NULL, "permissions" text array, CONSTRAINT "UQ_35c9b140caaf6da09cfabb0d675" UNIQUE ("slug"), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`,
            undefined
        );
        await queryRunner.query(
            `CREATE TABLE "user" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "fullName" character varying(100), "email" character varying NOT NULL, "password" character varying NOT NULL, "avatar" character varying, "birthday" date, "phoneNumber" character varying(20) NOT NULL, "address" character varying(200) NOT NULL, "settings" json NOT NULL DEFAULT '{}', CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_f2578043e491921209f5dadd080" UNIQUE ("phoneNumber"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
            undefined
        );
        await queryRunner.query(
            `CREATE TABLE "bill" ("deleteAt" TIMESTAMP WITH TIME ZONE, "id" SERIAL NOT NULL, "tableNumber" integer NOT NULL, "insertAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createAt" TIMESTAMP WITH TIME ZONE NOT NULL, "prepareAt" TIMESTAMP WITH TIME ZONE, "collectAt" TIMESTAMP WITH TIME ZONE, "collectValue" double precision, "voucherCode" character varying(20), "voucherValue" integer, "voucherIsPercent" boolean, "discountCode" character varying(20), "discountValue" integer, "rating" double precision, "note" character varying, "deleteById" integer, "storeId" integer NOT NULL, "createById" integer NOT NULL, "prepareById" integer, "collectById" integer, "customerId" integer, CONSTRAINT "PK_683b47912b8b30fe71d1fa22199" PRIMARY KEY ("id"))`,
            undefined
        );
        await queryRunner.query(
            `CREATE TABLE "delivery_bill_dish" ("dishId" integer NOT NULL, "deliveryBillId" integer NOT NULL, "name" character varying(100) NOT NULL, "note" character varying, "quantity" smallint NOT NULL DEFAULT 1, "price" double precision, CONSTRAINT "PK_1e8c2502eae5aab3f81fd7ee383" PRIMARY KEY ("dishId", "deliveryBillId"))`,
            undefined
        );
        await queryRunner.query(
            `CREATE TABLE "delivery_bill" ("deleteAt" TIMESTAMP WITH TIME ZONE, "id" SERIAL NOT NULL, "insertAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createAt" TIMESTAMP WITH TIME ZONE NOT NULL, "prepareAt" TIMESTAMP WITH TIME ZONE, "preparedAt" TIMESTAMP WITH TIME ZONE, "shipAt" TIMESTAMP WITH TIME ZONE, "collectAt" TIMESTAMP WITH TIME ZONE, "collectValue" double precision, "address" text NOT NULL, "longitude" double precision, "latitude" double precision, "voucherCode" character varying(20), "voucherValue" integer, "voucherIsPercent" boolean, "discountCode" character varying(20), "discountValue" integer, "rating" double precision, "note" character varying, "customerId" integer NOT NULL, "deleteById" integer, "storeId" integer NOT NULL, "prepareById" integer, "shipById" integer, CONSTRAINT "PK_89ebb4d80c2b15dffe5cabba308" PRIMARY KEY ("id"))`,
            undefined
        );
        await queryRunner.query(
            `CREATE TABLE "customer" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "fullName" character varying(100), "email" character varying NOT NULL, "password" character varying NOT NULL, "avatar" character varying, "birthday" date, "phoneNumber" character varying(20), "settings" json NOT NULL DEFAULT '{}', CONSTRAINT "UQ_cb485a32c0e8b9819c08c1b1a1b" UNIQUE ("username"), CONSTRAINT "UQ_fdb2f3ad8115da4c7718109a6eb" UNIQUE ("email"), CONSTRAINT "UQ_2e64383bae8871598afb8b73f0d" UNIQUE ("phoneNumber"), CONSTRAINT "PK_a7a13f4cacb744524e44dfdad32" PRIMARY KEY ("id"))`,
            undefined
        );
        await queryRunner.query(
            `CREATE TABLE "address" ("id" SERIAL NOT NULL, "address" character varying NOT NULL, "longitude" double precision, "latitude" double precision, "customerId" integer NOT NULL, CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`,
            undefined
        );
        await queryRunner.query(
            `CREATE TABLE "discount_campaign_stores_store" ("discountCampaignId" integer NOT NULL, "storeId" integer NOT NULL, CONSTRAINT "PK_5c5983d32fd0160abd86e03815d" PRIMARY KEY ("discountCampaignId", "storeId"))`,
            undefined
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_cd7dffdd7dca839b5cdb792540" ON "discount_campaign_stores_store" ("discountCampaignId") `,
            undefined
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_ceabacefb4b82d2d3bc310a04b" ON "discount_campaign_stores_store" ("storeId") `,
            undefined
        );
        await queryRunner.query(
            `CREATE TABLE "discount_code_stores_store" ("discountCodeCode" character varying(10) NOT NULL, "storeId" integer NOT NULL, CONSTRAINT "PK_3e78670db5d58780fae1af53c11" PRIMARY KEY ("discountCodeCode", "storeId"))`,
            undefined
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_4e7287f3511d31e37caaf17119" ON "discount_code_stores_store" ("discountCodeCode") `,
            undefined
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_7f6fcefc07b8ee5d0da3341d4b" ON "discount_code_stores_store" ("storeId") `,
            undefined
        );
        await queryRunner.query(
            `CREATE TABLE "voucher_code_stores_store" ("voucherCodeCode" character varying(10) NOT NULL, "storeId" integer NOT NULL, CONSTRAINT "PK_11cf58bfd7a040c4db9eb02642d" PRIMARY KEY ("voucherCodeCode", "storeId"))`,
            undefined
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_a99fff5e661542482a4ac46e68" ON "voucher_code_stores_store" ("voucherCodeCode") `,
            undefined
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_66db0bb650dbafd9569861f48d" ON "voucher_code_stores_store" ("storeId") `,
            undefined
        );
        await queryRunner.query(
            `CREATE TABLE "user_roles_role" ("userId" integer NOT NULL, "roleId" integer NOT NULL, CONSTRAINT "PK_b47cd6c84ee205ac5a713718292" PRIMARY KEY ("userId", "roleId"))`,
            undefined
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_5f9286e6c25594c6b88c108db7" ON "user_roles_role" ("userId") `,
            undefined
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_4be2f7adf862634f5f803d246b" ON "user_roles_role" ("roleId") `,
            undefined
        );
        await queryRunner.query(
            `CREATE TABLE "user_stores_store" ("userId" integer NOT NULL, "storeId" integer NOT NULL, CONSTRAINT "PK_7c7887b134e38c34df9c18f70e9" PRIMARY KEY ("userId", "storeId"))`,
            undefined
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_73e020cc20f89de2d53b62965b" ON "user_stores_store" ("userId") `,
            undefined
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_69e5e7682212a28bb9fd8f5503" ON "user_stores_store" ("storeId") `,
            undefined
        );
        await queryRunner.query(
            `CREATE TABLE "user_warehouses_warehouse" ("userId" integer NOT NULL, "warehouseId" integer NOT NULL, CONSTRAINT "PK_9a1c96593cfa51b45d5f49db006" PRIMARY KEY ("userId", "warehouseId"))`,
            undefined
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_4a1c07017d4c85d84de4521208" ON "user_warehouses_warehouse" ("userId") `,
            undefined
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_645be942211a40ef95001fdf85" ON "user_warehouses_warehouse" ("warehouseId") `,
            undefined
        );
        await queryRunner.query(
            `CREATE TABLE "customer_favourite_dishes_dish" ("customerId" integer NOT NULL, "dishId" integer NOT NULL, CONSTRAINT "PK_6e5a29655d412b317c1ea32c255" PRIMARY KEY ("customerId", "dishId"))`,
            undefined
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_f40ed7f85caebc229efacb4e61" ON "customer_favourite_dishes_dish" ("customerId") `,
            undefined
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_5d9967083c1b4a411512dd6358" ON "customer_favourite_dishes_dish" ("dishId") `,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "comment" ADD CONSTRAINT "FK_4dec51468e269f2c2ba75817c30" FOREIGN KEY ("createById") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "comment" ADD CONSTRAINT "FK_53a21422a1a8ab475cd5b23711e" FOREIGN KEY ("dishId") REFERENCES "dish"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "bill_dish" ADD CONSTRAINT "FK_300ed2db55edd0dce6c76d49ec1" FOREIGN KEY ("billHistoryId") REFERENCES "bill_history"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "bill_dish" ADD CONSTRAINT "FK_c17c4be1d7277409e8654c0081b" FOREIGN KEY ("dishId") REFERENCES "dish"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "bill_history" ADD CONSTRAINT "FK_860ffb38bae97a975bf900337e1" FOREIGN KEY ("billId") REFERENCES "bill"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "bill_history" ADD CONSTRAINT "FK_70e29f4c371aca376acce6a8aba" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "discount_campaign_dish" ADD CONSTRAINT "FK_e281b1918995852a5f6b05bb166" FOREIGN KEY ("discountCampaignId") REFERENCES "discount_campaign"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "discount_campaign_dish" ADD CONSTRAINT "FK_02bf41f474a81bcefab5cacee63" FOREIGN KEY ("dishId") REFERENCES "dish"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "store_dish" ADD CONSTRAINT "FK_e9f26e3962237327623bee671a7" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "store_dish" ADD CONSTRAINT "FK_98e19349f1624152f441c90a8c5" FOREIGN KEY ("dishId") REFERENCES "dish"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "voucher_code" ADD CONSTRAINT "FK_6d3f8d22bc51b731012ed2d8b3e" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "daily_report_stock" ADD CONSTRAINT "FK_21db09499716659b7a348bd2307" FOREIGN KEY ("dailyReportId") REFERENCES "daily_report"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "daily_report_stock" ADD CONSTRAINT "FK_a9a1953c0a8c843cd6bafc09c89" FOREIGN KEY ("stockId") REFERENCES "stock"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "daily_report" ADD CONSTRAINT "FK_7f666a00910141664d3df9c3802" FOREIGN KEY ("warehouseId") REFERENCES "warehouse"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "daily_report" ADD CONSTRAINT "FK_da963943fdf6842283d8647e7dd" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "import_bill_stock" ADD CONSTRAINT "FK_d843f320ebf7469266f08114b69" FOREIGN KEY ("importBillId") REFERENCES "import_bill"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "import_bill_stock" ADD CONSTRAINT "FK_3427fdfd2711bf5140de2135ff9" FOREIGN KEY ("stockId") REFERENCES "stock"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "import_bill" ADD CONSTRAINT "FK_97e39e90090d7d6cc96856af88a" FOREIGN KEY ("warehouseId") REFERENCES "warehouse"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "import_bill" ADD CONSTRAINT "FK_66874c8c1223f779a0db28e16c3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "warehouse_stock" ADD CONSTRAINT "FK_3b428dd94da788ba06938ccd063" FOREIGN KEY ("warehouseId") REFERENCES "warehouse"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "warehouse_stock" ADD CONSTRAINT "FK_5f9244b1207d9b026b5dc7c66d8" FOREIGN KEY ("stockId") REFERENCES "stock"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "warehouse" ADD CONSTRAINT "FK_f5aff4026a81fc0b35219edf512" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "daily_dish" ADD CONSTRAINT "FK_102e572218e858d780152ae1380" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "daily_dish" ADD CONSTRAINT "FK_32d547d12f4279faa717fcf92a2" FOREIGN KEY ("dishId") REFERENCES "dish"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "daily_dish" ADD CONSTRAINT "FK_4d45442667cf93044071251ba5a" FOREIGN KEY ("confirmById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "bill" ADD CONSTRAINT "FK_4b7ea9227da39b823151c637c12" FOREIGN KEY ("deleteById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "bill" ADD CONSTRAINT "FK_c9667f0df772f3b70f2d73ec108" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "bill" ADD CONSTRAINT "FK_8d997583348b7738ec6fdde9df5" FOREIGN KEY ("createById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "bill" ADD CONSTRAINT "FK_08dabdc8b9b48ebf8e4c836120c" FOREIGN KEY ("prepareById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "bill" ADD CONSTRAINT "FK_d7eb554c93806f88f71935b2cac" FOREIGN KEY ("collectById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "bill" ADD CONSTRAINT "FK_8283ffb2d90b494882adece3f3c" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "delivery_bill_dish" ADD CONSTRAINT "FK_5491d59b2676ab12b32c9a063db" FOREIGN KEY ("dishId") REFERENCES "dish"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "delivery_bill_dish" ADD CONSTRAINT "FK_696ace5e52edfd5ed2b02f9cf5b" FOREIGN KEY ("deliveryBillId") REFERENCES "delivery_bill"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "delivery_bill" ADD CONSTRAINT "FK_8e44b6f68f3b9b698447458d4e5" FOREIGN KEY ("deleteById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "delivery_bill" ADD CONSTRAINT "FK_7b3a7b12544a7a55a4d082c8451" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "delivery_bill" ADD CONSTRAINT "FK_dc51a1528dc34436ff1306b5701" FOREIGN KEY ("prepareById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "delivery_bill" ADD CONSTRAINT "FK_7811f4e047d3575abc3c006788d" FOREIGN KEY ("shipById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "delivery_bill" ADD CONSTRAINT "FK_c0f5f08e275a3b87efdfbd3081e" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "address" ADD CONSTRAINT "FK_dc34d382b493ade1f70e834c4d3" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "discount_campaign_stores_store" ADD CONSTRAINT "FK_cd7dffdd7dca839b5cdb792540c" FOREIGN KEY ("discountCampaignId") REFERENCES "discount_campaign"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "discount_campaign_stores_store" ADD CONSTRAINT "FK_ceabacefb4b82d2d3bc310a04b8" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "discount_code_stores_store" ADD CONSTRAINT "FK_4e7287f3511d31e37caaf171198" FOREIGN KEY ("discountCodeCode") REFERENCES "discount_code"("code") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "discount_code_stores_store" ADD CONSTRAINT "FK_7f6fcefc07b8ee5d0da3341d4bc" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "voucher_code_stores_store" ADD CONSTRAINT "FK_a99fff5e661542482a4ac46e682" FOREIGN KEY ("voucherCodeCode") REFERENCES "voucher_code"("code") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "voucher_code_stores_store" ADD CONSTRAINT "FK_66db0bb650dbafd9569861f48df" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "user_roles_role" ADD CONSTRAINT "FK_5f9286e6c25594c6b88c108db77" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "user_roles_role" ADD CONSTRAINT "FK_4be2f7adf862634f5f803d246b8" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "user_stores_store" ADD CONSTRAINT "FK_73e020cc20f89de2d53b62965b9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "user_stores_store" ADD CONSTRAINT "FK_69e5e7682212a28bb9fd8f55038" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "user_warehouses_warehouse" ADD CONSTRAINT "FK_4a1c07017d4c85d84de45212084" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "user_warehouses_warehouse" ADD CONSTRAINT "FK_645be942211a40ef95001fdf85b" FOREIGN KEY ("warehouseId") REFERENCES "warehouse"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "customer_favourite_dishes_dish" ADD CONSTRAINT "FK_f40ed7f85caebc229efacb4e61b" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "customer_favourite_dishes_dish" ADD CONSTRAINT "FK_5d9967083c1b4a411512dd63583" FOREIGN KEY ("dishId") REFERENCES "dish"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `ALTER TABLE "customer_favourite_dishes_dish" DROP CONSTRAINT "FK_5d9967083c1b4a411512dd63583"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "customer_favourite_dishes_dish" DROP CONSTRAINT "FK_f40ed7f85caebc229efacb4e61b"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "user_warehouses_warehouse" DROP CONSTRAINT "FK_645be942211a40ef95001fdf85b"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "user_warehouses_warehouse" DROP CONSTRAINT "FK_4a1c07017d4c85d84de45212084"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "user_stores_store" DROP CONSTRAINT "FK_69e5e7682212a28bb9fd8f55038"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "user_stores_store" DROP CONSTRAINT "FK_73e020cc20f89de2d53b62965b9"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "user_roles_role" DROP CONSTRAINT "FK_4be2f7adf862634f5f803d246b8"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "user_roles_role" DROP CONSTRAINT "FK_5f9286e6c25594c6b88c108db77"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "voucher_code_stores_store" DROP CONSTRAINT "FK_66db0bb650dbafd9569861f48df"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "voucher_code_stores_store" DROP CONSTRAINT "FK_a99fff5e661542482a4ac46e682"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "discount_code_stores_store" DROP CONSTRAINT "FK_7f6fcefc07b8ee5d0da3341d4bc"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "discount_code_stores_store" DROP CONSTRAINT "FK_4e7287f3511d31e37caaf171198"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "discount_campaign_stores_store" DROP CONSTRAINT "FK_ceabacefb4b82d2d3bc310a04b8"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "discount_campaign_stores_store" DROP CONSTRAINT "FK_cd7dffdd7dca839b5cdb792540c"`,
            undefined
        );
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_dc34d382b493ade1f70e834c4d3"`, undefined);
        await queryRunner.query(
            `ALTER TABLE "delivery_bill" DROP CONSTRAINT "FK_c0f5f08e275a3b87efdfbd3081e"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "delivery_bill" DROP CONSTRAINT "FK_7811f4e047d3575abc3c006788d"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "delivery_bill" DROP CONSTRAINT "FK_dc51a1528dc34436ff1306b5701"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "delivery_bill" DROP CONSTRAINT "FK_7b3a7b12544a7a55a4d082c8451"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "delivery_bill" DROP CONSTRAINT "FK_8e44b6f68f3b9b698447458d4e5"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "delivery_bill_dish" DROP CONSTRAINT "FK_696ace5e52edfd5ed2b02f9cf5b"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "delivery_bill_dish" DROP CONSTRAINT "FK_5491d59b2676ab12b32c9a063db"`,
            undefined
        );
        await queryRunner.query(`ALTER TABLE "bill" DROP CONSTRAINT "FK_8283ffb2d90b494882adece3f3c"`, undefined);
        await queryRunner.query(`ALTER TABLE "bill" DROP CONSTRAINT "FK_d7eb554c93806f88f71935b2cac"`, undefined);
        await queryRunner.query(`ALTER TABLE "bill" DROP CONSTRAINT "FK_08dabdc8b9b48ebf8e4c836120c"`, undefined);
        await queryRunner.query(`ALTER TABLE "bill" DROP CONSTRAINT "FK_8d997583348b7738ec6fdde9df5"`, undefined);
        await queryRunner.query(`ALTER TABLE "bill" DROP CONSTRAINT "FK_c9667f0df772f3b70f2d73ec108"`, undefined);
        await queryRunner.query(`ALTER TABLE "bill" DROP CONSTRAINT "FK_4b7ea9227da39b823151c637c12"`, undefined);
        await queryRunner.query(`ALTER TABLE "daily_dish" DROP CONSTRAINT "FK_4d45442667cf93044071251ba5a"`, undefined);
        await queryRunner.query(`ALTER TABLE "daily_dish" DROP CONSTRAINT "FK_32d547d12f4279faa717fcf92a2"`, undefined);
        await queryRunner.query(`ALTER TABLE "daily_dish" DROP CONSTRAINT "FK_102e572218e858d780152ae1380"`, undefined);
        await queryRunner.query(`ALTER TABLE "warehouse" DROP CONSTRAINT "FK_f5aff4026a81fc0b35219edf512"`, undefined);
        await queryRunner.query(
            `ALTER TABLE "warehouse_stock" DROP CONSTRAINT "FK_5f9244b1207d9b026b5dc7c66d8"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "warehouse_stock" DROP CONSTRAINT "FK_3b428dd94da788ba06938ccd063"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "import_bill" DROP CONSTRAINT "FK_66874c8c1223f779a0db28e16c3"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "import_bill" DROP CONSTRAINT "FK_97e39e90090d7d6cc96856af88a"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "import_bill_stock" DROP CONSTRAINT "FK_3427fdfd2711bf5140de2135ff9"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "import_bill_stock" DROP CONSTRAINT "FK_d843f320ebf7469266f08114b69"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "daily_report" DROP CONSTRAINT "FK_da963943fdf6842283d8647e7dd"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "daily_report" DROP CONSTRAINT "FK_7f666a00910141664d3df9c3802"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "daily_report_stock" DROP CONSTRAINT "FK_a9a1953c0a8c843cd6bafc09c89"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "daily_report_stock" DROP CONSTRAINT "FK_21db09499716659b7a348bd2307"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "voucher_code" DROP CONSTRAINT "FK_6d3f8d22bc51b731012ed2d8b3e"`,
            undefined
        );
        await queryRunner.query(`ALTER TABLE "store_dish" DROP CONSTRAINT "FK_98e19349f1624152f441c90a8c5"`, undefined);
        await queryRunner.query(`ALTER TABLE "store_dish" DROP CONSTRAINT "FK_e9f26e3962237327623bee671a7"`, undefined);
        await queryRunner.query(
            `ALTER TABLE "discount_campaign_dish" DROP CONSTRAINT "FK_02bf41f474a81bcefab5cacee63"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "discount_campaign_dish" DROP CONSTRAINT "FK_e281b1918995852a5f6b05bb166"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "bill_history" DROP CONSTRAINT "FK_70e29f4c371aca376acce6a8aba"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "bill_history" DROP CONSTRAINT "FK_860ffb38bae97a975bf900337e1"`,
            undefined
        );
        await queryRunner.query(`ALTER TABLE "bill_dish" DROP CONSTRAINT "FK_c17c4be1d7277409e8654c0081b"`, undefined);
        await queryRunner.query(`ALTER TABLE "bill_dish" DROP CONSTRAINT "FK_300ed2db55edd0dce6c76d49ec1"`, undefined);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_53a21422a1a8ab475cd5b23711e"`, undefined);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_4dec51468e269f2c2ba75817c30"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_5d9967083c1b4a411512dd6358"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_f40ed7f85caebc229efacb4e61"`, undefined);
        await queryRunner.query(`DROP TABLE "customer_favourite_dishes_dish"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_645be942211a40ef95001fdf85"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_4a1c07017d4c85d84de4521208"`, undefined);
        await queryRunner.query(`DROP TABLE "user_warehouses_warehouse"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_69e5e7682212a28bb9fd8f5503"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_73e020cc20f89de2d53b62965b"`, undefined);
        await queryRunner.query(`DROP TABLE "user_stores_store"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_4be2f7adf862634f5f803d246b"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_5f9286e6c25594c6b88c108db7"`, undefined);
        await queryRunner.query(`DROP TABLE "user_roles_role"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_66db0bb650dbafd9569861f48d"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_a99fff5e661542482a4ac46e68"`, undefined);
        await queryRunner.query(`DROP TABLE "voucher_code_stores_store"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_7f6fcefc07b8ee5d0da3341d4b"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_4e7287f3511d31e37caaf17119"`, undefined);
        await queryRunner.query(`DROP TABLE "discount_code_stores_store"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_ceabacefb4b82d2d3bc310a04b"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_cd7dffdd7dca839b5cdb792540"`, undefined);
        await queryRunner.query(`DROP TABLE "discount_campaign_stores_store"`, undefined);
        await queryRunner.query(`DROP TABLE "address"`, undefined);
        await queryRunner.query(`DROP TABLE "customer"`, undefined);
        await queryRunner.query(`DROP TABLE "delivery_bill"`, undefined);
        await queryRunner.query(`DROP TABLE "delivery_bill_dish"`, undefined);
        await queryRunner.query(`DROP TABLE "bill"`, undefined);
        await queryRunner.query(`DROP TABLE "user"`, undefined);
        await queryRunner.query(`DROP TABLE "role"`, undefined);
        await queryRunner.query(`DROP TABLE "daily_dish"`, undefined);
        await queryRunner.query(`DROP TYPE "daily_dish_session_enum"`, undefined);
        await queryRunner.query(`DROP TABLE "store"`, undefined);
        await queryRunner.query(`DROP TABLE "warehouse"`, undefined);
        await queryRunner.query(`DROP TABLE "warehouse_stock"`, undefined);
        await queryRunner.query(`DROP TABLE "import_bill"`, undefined);
        await queryRunner.query(`DROP TABLE "import_bill_stock"`, undefined);
        await queryRunner.query(`DROP TABLE "daily_report"`, undefined);
        await queryRunner.query(`DROP TABLE "daily_report_stock"`, undefined);
        await queryRunner.query(`DROP TABLE "stock"`, undefined);
        await queryRunner.query(`DROP TABLE "voucher_code"`, undefined);
        await queryRunner.query(`DROP TABLE "store_dish"`, undefined);
        await queryRunner.query(`DROP TABLE "discount_code"`, undefined);
        await queryRunner.query(`DROP TABLE "discount_campaign"`, undefined);
        await queryRunner.query(`DROP TABLE "discount_campaign_dish"`, undefined);
        await queryRunner.query(`DROP TABLE "bill_history"`, undefined);
        await queryRunner.query(`DROP TABLE "bill_dish"`, undefined);
        await queryRunner.query(`DROP TABLE "dish"`, undefined);
        await queryRunner.query(`DROP TABLE "comment"`, undefined);
    }
}
