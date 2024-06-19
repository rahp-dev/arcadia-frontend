export type Client = {
    id: string
    name: string
    lastName: string
    birthDate: Date
    identityCard: string
    passport: string
    frequentTraveler: boolean
    email: string
    phone: string
    instagram: string
    createdAt: Date
    updatedAt: Date
    address: {
        country: string
        state: string
        street: string
    }
}

export type CreateClientBody = {
    name: string
    lastName: string
    birthDate: Date | null
    identityCard: string
    passport: string
    frequentTraveler: boolean
    email: string
    phone: string
    instagram: string
    address: {
        country: string
        state: string
        street: string
    }
}

export type CreateClientFormModel = {
    name: string
    lastName: string
    birthDate: Date | null
    identityCard: string
    passport: string
    frequentTraveler: boolean
    email: string
    phone: string
    instagram: string
    country: string
    state: string
    street: string
}
