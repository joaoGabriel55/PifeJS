import { RoomsRepository } from "../../repositories/roomsRepository.js";
import UsersRepository from "../../repositories/usersRepository.js";
import { generateId } from "../../shared/entityId.js";
import { makeDatabase } from "./database.js";

const database = makeDatabase();

async function main() {
    const usersRepository = new UsersRepository();

    const user1 = await usersRepository.create({
        id: generateId(),
        email: "test1@exmple.com",
        name: "Daniel",
    })

    const user2 = await usersRepository.create({
        id: generateId(),
        email: "test2@exmple.com",
        name: "Joao",
    })

    if (!user1 || !user2) throw new Error('failed to create users')

    const roomsRepository = new RoomsRepository();

    const room = await roomsRepository.create({
        id: generateId(),
        owner: user1,
        players: [user1, user2],
        createdAt: new Date(),
    })

    if (!room) throw new Error('failed to create room')

    // const matchesRepository = new MatchesRepository();

    // const match = await matchesRepository.create({
    //     id: generateId(),
    //     createdAt: new Date(),
    //     state: "ONGOING",
    //     room,
    //     rounds: [],
    // })
}

database.connect().then(() => {
    main();
}).catch((error) => {
    console.error("error", error);
    process.exit(1);
})
