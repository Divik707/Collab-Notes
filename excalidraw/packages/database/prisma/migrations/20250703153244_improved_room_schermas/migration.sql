/*
  Warnings:

  - You are about to drop the column `members` on the `Room` table. All the data in the column will be lost.

*/
-- AlterTable
CREATE SEQUENCE room_roomid_seq;
ALTER TABLE "Room" DROP COLUMN "members",
ALTER COLUMN "roomId" SET DEFAULT nextval('room_roomid_seq');
ALTER SEQUENCE room_roomid_seq OWNED BY "Room"."roomId";
