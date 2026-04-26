import 'dotenv/config'
import { PrismaClient } from '../dist/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL!

const adapter = new PrismaPg({ connectionString })

export const prisma = new PrismaClient({ adapter })

const userId = 'cmoe5dz1o00014wfmmh9z7ayk'

const movies = [
  {
    title: "Inception",
    overview: "A thief who steals corporate secrets through dream-sharing technology",
    releaseYear: 2010,
    genres: ["Action", "Sci-Fi", "Thriller"],
    runtime: 148,
    posterUrl: "https://example.com/inception.jpg",
    createdBy: userId,
  },
  {
    title: "Interstellar",
    overview: "A team of explorers travel through a wormhole in space to save humanity",
    releaseYear: 2014,
    genres: ["Adventure", "Drama", "Sci-Fi"],
    runtime: 169,
    posterUrl: "https://example.com/interstellar.jpg",
    createdBy: userId,
  },
  {
    title: "The Dark Knight",
    overview: "Batman faces the Joker, a criminal mastermind causing chaos in Gotham",
    releaseYear: 2008,
    genres: ["Action", "Crime", "Drama"],
    runtime: 152,
    posterUrl: "https://example.com/dark-knight.jpg",
    createdBy: userId,
  },
  {
    title: "Avengers: Endgame",
    overview: "The Avengers assemble to reverse the damage caused by Thanos",
    releaseYear: 2019,
    genres: ["Action", "Adventure", "Sci-Fi"],
    runtime: 181,
    posterUrl: "https://example.com/endgame.jpg",
    createdBy: userId,
  },
  {
    title: "Gladiator",
    overview: "A Roman general seeks revenge after being betrayed",
    releaseYear: 2000,
    genres: ["Action", "Drama", "Adventure"],
    runtime: 155,
    posterUrl: "https://example.com/gladiator.jpg",
    createdBy: userId,
  }
]

const main = async () =>{
    console.log("Seeding Movie")
    for (const movie of movies){
        await prisma.movie.create({
            data: movie
        });
        console.log(`Created Movie: ${movie.title}`)
    }
    console.log("Seeding Completed!")
}

main().catch(err =>{
    console.error(err)
    process.exit(1)
}).finally(async()=>{
  await prisma.$disconnect();
})