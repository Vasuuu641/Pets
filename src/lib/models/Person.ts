import bcrypt from 'bcrypt';
import type { Pet, Role } from '$lib/types'; // Ensure to import Pet and Role from types.ts

//Base class Person from which the subclasses User and Admin inherit properties
export class Person {
    constructor(
        public id: number,
        public name: string,
        public passwordHash: string, // Protected, only accessible in this class or subclasses
        public adoptedPets: Pet[],
        public role: Role,
        public budget: number,
        public inventory: { food: number; toy: number; treat: number }
    ) {}

    //verifyPassword uses bcrypt.compare to check what the user enters in plaintext and compares it to the hashed password
    async verifyPassword(password: string): Promise<boolean> {

        return bcrypt.compare(password, this.passwordHash);
    }


    static async createUser(
        name: string,
        password: string
    ): Promise<Person> {

        const passwordHash = await bcrypt.hash(password, 10);

        const newId = Date.now();

        const defaultUser = new Person(
            newId,
            name,
            passwordHash,
            [],
            'user',
            100,
            { food: 0, toy: 0, treat: 0 }
        );

        return defaultUser;
    }

}
