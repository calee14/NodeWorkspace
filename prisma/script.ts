import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient(); // PrismaClient({ log: ["query"]});

async function main() {
    await prisma.user.deleteMany();
    // creates single user and makes a user preference object in seperate table
    const singleCreate = await prisma.user.create({
        data: {
            name: "kk",
            email: "ck2@test.com",
            age: 21,
            userPreference: {
                create: {
                    emailUpdates: true,
                },
            },
        },
        // include: { // can only do a select or include
        //     userPreference: true,
        // },
        select: {
            name: true,
            userPreference: {select: {id: true}},
        }
    });
    // make many users
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
    // find a unqiue user based on the unique attributes in the user schema
    const query1 = await prisma.user.findUnique({
        where: {
            age_name: {
                age: 27,
                name: "capper",
            }
        }
    });
    // find many users based on the following properties
    const query2 = await prisma.user.findMany({
        where: {
            name: {in: ["cappi", "capper"]}, // {not: "cappi"} // {equal: "cappi"}
            age: {gt: 20},
            email: { contains: "@test.com"},
        }
    })


    // find many users with AND/OR clauses
    const query3 = await prisma.user.findMany({
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

    // find many users based on list properties 'writtenPosts'
    const query4 = await prisma.user.findMany({
        where: {
            writtenPosts: {
                some: {
                    title: {equals: 'test'}
                }
            }
        }
    });


    // find first user with name
    const query5 = await prisma.user.findFirst({
        where: {
            name: "cappi"
        }
    });
    
    // update many based on name field
    const query6 = await prisma.user.updateMany({
        where: {
            name: "cappi"
        },
        data: {
            name: "cappi2"
        },
        // can't use select or include
    });
    // update user based on unique field
    const query7 = await prisma.user.update({ // field must be unique
        where: {
            email: "capper@test.com"
        },
        data: {
            age: {
                increment: 1,
            },
        },
        // can't use select or include
    });

    // update user's user preference by connecting/making reference to existing userpreference obj
    const query8 = await prisma.user.update({ // field must be unique
        where: {
            email: "capper@test.com"
        },
        data: {
            userPreference: {
                connect: {
                    id: "d7bcdc8d-8caf-404c-99ab-abe221e993f3"
                }
            }
        },
        // can't use select or include
    });
    
    // delete many users
    const query9 = await prisma.user.deleteMany({
        where: {
            age: { gt: 23 }
        }
    })
    
    //creates a user preference entry in the table
    const preference = await prisma.userPreference.create({
        data: {
            emailUpdates: true
        }
    })
    

    const post = await prisma.post.findMany({
        where: {
            author: {
                is: {
                    age: { gt: 20 },
                }
            }
        }
    })

    console.log(users);
    console.log(query1);
    console.log(preference);
}

main()
    .catch(e => {
        console.error(e.message)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })