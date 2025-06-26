export interface Hotel {
    id: string,
    userId: string,
    title: string,
    description: string,
    image: string,
    country: string,
    state: string,
    city: string,
    locationDescription: string,
    gym: boolean,
    spa: boolean,
    bar: boolean,
    laundry: boolean,
    restaurant: boolean,
    shopping: boolean,
    freeParking: boolean,
    bikeRental: boolean,
    freeWifi: boolean,
    movieNights: boolean,
    swimmingPool: boolean,
    coffeeShop: boolean,
    addedAt: Date,
    updatedAt: Date,
    rooms: Room[],
    bookings: Bookings[]
}

export interface Room {
    id: string,
    title: string,
    description: string,
    bedCount: number,
    guestCount: number,
    bathroomCount: number,
    kingBed: number,
    queenBed: number,
    image: string,
    breakFastPrice: number,
    roomPrice: number,
    roomService: boolean,
    TV: boolean,
    balcony: boolean,
    cityView: boolean,
    oceanView: boolean,
    forestView: boolean,
    moutainView: boolean,
    airCondition: boolean,
    soundProofed: boolean,
    hotelId: string,
    Booking: Bookings[]
}

export interface Bookings {
    id: string,
    userName: string,
    userId: string
    roomId: string,
    hotelId: string,
    hotelOwnerId: string,
    startDate: Date,
    endDate: Date
    breakFastIncluded: boolean,
    currency: string,
    totalPrice: number,
    paymentStatus: boolean,
    paymentIntentId: string,
    bookAt: Date
}