import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient(); // PrismaClient({ log: ["query"]});

async function main() {
    await prisma.user.deleteMany();
    // const user = await prisma.user.create({
    //     data: {
    //         name: "capper",
    //         email: "capper@test.com",
    //         age: 27,
    //         userPreference: {
    //             create: {
    //                 emailUpdates: true,
    //             },
    //         },
    //     },
    //     // include: { // can only do a select or include
    //     //     userPreference: true,
    //     // },
    //     select: {
    //         name: true,
    //         userPreference: {select: {id: true}},
    //     }
    // });
    const users = await prisma.user.createMany({
        data: [{
            name: "capper",
            email: "capper@test.com",
            age: 27,

        }, 
        {
            name: "cappi",
            email: "cappi@test.com",
            age: 20,
        }, 
        {
            name: "ryan",
            email: "ryan@test.com",
            age: 19,
        },
        {
            name: "cappi",
            email: "johno@test.com",
            age: 21,
        }
        ],
    });
    // const user = await prisma.user.findUnique({
    //     where: {
    //         age_name: {
    //             age: 27,
    //             name: "capper",
    //         }
    //     }
    // });
    // const user = await prisma.user.findMany({
    //     where: {
    //         name: {in: ["cappi", "capper"]}, // {not: "cappi"} // {equal: "cappi"}
    //         age: {gt: 20},
    //         email: { contains: "@test.com"},
    //     }
    // })

    const user = await prisma.user.findMany({
        where: {
            AND: [
                {OR: [
                    {email: {endsWith: "test.com"}},
                    {age: {gt: 20}},
                ]},
                {name: {endsWith: "pi"}},
            ],
        }
    })

    // const user = await prisma.user.findFirst({
    //     where: {
    //         name: "cappi"
    //     }
    // });

    // const user = await prisma.user.findMany();
    console.log(users);
    console.log(user);
    // await prisma.user.deleteMany();
}

main()
    .catch(e => {
        console.error(e.message)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })