//Created a Pet class by using the same properties as that in types.ts
export class Pet {
    constructor(
        public id: number,
        public name: string,
        public type: string,
        public adopted: boolean,
        public adoptedBy: number | null,
        public hunger: number,
        public happiness: number,
        public imageUrl: string
    ) {}

    //Adopt method used by the frontend to enable the pet to be adopted. Updates only the frontend for UI
    adopt(userId: number) {
        this.adopted = true;
        this.adoptedBy = userId;
    }


}
