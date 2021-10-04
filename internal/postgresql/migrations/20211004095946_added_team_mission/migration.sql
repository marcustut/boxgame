-- CreateTable
CREATE TABLE "TeamMission" (
    "teamId" UUID NOT NULL,
    "missionId" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "UserRole" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TeamMission_teamId_missionId_key" ON "TeamMission"("teamId", "missionId");

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_user_id_role_key" ON "UserRole"("user_id", "role");

-- AddForeignKey
ALTER TABLE "TeamMission" ADD CONSTRAINT "TeamMission_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMission" ADD CONSTRAINT "TeamMission_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "Mission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
