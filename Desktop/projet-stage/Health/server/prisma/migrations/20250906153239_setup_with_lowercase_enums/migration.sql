-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('patient', 'doctor', 'admin');

-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('male', 'female', 'other');

-- CreateEnum
CREATE TYPE "public"."AppointmentStatus" AS ENUM ('pending', 'confirmed', 'completed', 'cancelled', 'no_show');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."UserRole" NOT NULL DEFAULT 'patient',
    "profileImage" TEXT,
    "phone" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."doctors" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "specialty" TEXT NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "experienceYears" INTEGER NOT NULL DEFAULT 0,
    "education" JSONB,
    "about" TEXT,
    "consultationFee" DOUBLE PRECISION,
    "address" TEXT,
    "city" TEXT,
    "zipCode" TEXT,
    "phone" TEXT,
    "languages" JSONB,
    "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "acceptsInsurance" BOOLEAN NOT NULL DEFAULT false,
    "isAvailableToday" BOOLEAN NOT NULL DEFAULT false,
    "nextAvailableSlot" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "doctors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."patients" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "gender" "public"."Gender",
    "bloodType" TEXT,
    "allergies" JSONB,
    "medications" JSONB,
    "emergencyContact" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."appointments" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL DEFAULT 30,
    "status" "public"."AppointmentStatus" NOT NULL DEFAULT 'pending',
    "reason" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."specialties" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "specialties_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "doctors_userId_key" ON "public"."doctors"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "doctors_licenseNumber_key" ON "public"."doctors"("licenseNumber");

-- CreateIndex
CREATE UNIQUE INDEX "patients_userId_key" ON "public"."patients"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "specialties_name_key" ON "public"."specialties"("name");

-- AddForeignKey
ALTER TABLE "public"."doctors" ADD CONSTRAINT "doctors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."patients" ADD CONSTRAINT "patients_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
