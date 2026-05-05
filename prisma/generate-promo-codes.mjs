import { PrismaClient, PromoCodeStatus } from "@prisma/client";

const prisma = new PrismaClient();

const TOTAL_CODES = 3000;
const WINNER_CODES = new Set([
  "LH-0055",
  "LH-0037",
  "LH-0841",
  "LH-2634",
  "LH-2139"
]);
const DEFAULT_PRIZE = "no_gana";
const DEFAULT_WINNER_PRIZE = "premio_sorpresa";

function buildCode(number) {
  return `LH-${String(number).padStart(4, "0")}`;
}

async function main() {
  const regularCodes = [];

  for (let index = 1; index <= TOTAL_CODES; index += 1) {
    const code = buildCode(index);

    if (WINNER_CODES.has(code)) {
      continue;
    }

    regularCodes.push({
      code,
      prize: DEFAULT_PRIZE,
      status: PromoCodeStatus.AVAILABLE
    });
  }

  const createManyResult = await prisma.promoCode.createMany({
    data: regularCodes,
    skipDuplicates: true
  });

  let createdWinnerCount = 0;

  for (const code of WINNER_CODES) {
    const existingCode = await prisma.promoCode.findUnique({
      where: { code },
      select: { id: true }
    });

    if (existingCode) {
      continue;
    }

    await prisma.promoCode.create({
      data: {
        code,
        prize: DEFAULT_WINNER_PRIZE,
        status: PromoCodeStatus.AVAILABLE
      }
    });

    createdWinnerCount += 1;
  }

  console.log(
    JSON.stringify(
      {
        totalRange: TOTAL_CODES,
        regularCodesCreated: createManyResult.count,
        winnerCodesEnsured: WINNER_CODES.size,
        winnerCodesCreated: createdWinnerCount,
        unchangedExistingCodes: true
      },
      null,
      2
    )
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
