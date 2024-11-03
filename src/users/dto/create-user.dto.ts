
export class CreateUserDto {
    _id: string
    username: string
    password?: string
    gmail?: string
    imgUrl?: string
    weight: number
    workouts: {
        sets: number
        weight: number
        reps: number
        date: Date
    }
}
