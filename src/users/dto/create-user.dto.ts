
export class CreateUserDto {
    _id: string
    username: string
    password: string
    gmail: string
    weight: {
        weight: number
        date: Date
    }[]
    workouts: {
        _id: string
        name: string
        type: string
        exercise: {
            sets: number
            weight: number
            reps: number
            name: string
        }[]
    }[]
}
