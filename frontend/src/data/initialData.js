export const initialRooms = [
  {
    id: 1,
    number: "101",
    type: "Deluxe",
    price: 3500,
    status: "Available",
  },
  {
    id: 2,
    number: "102",
    type: "Standard",
    price: 2500,
    status: "Occupied",
  },
  {
    id: 3,
    number: "103",
    type: "Suite",
    price: 6000,
    status: "Available",
  },
  {
    id: 4,
    number: "104",
    type: "Deluxe",
    price: 3500,
    status: "Maintenance",
  },
  {
    id: 5,
    number: "105",
    type: "Standard",
    price: 2500,
    status: "Available",
  },
  {
    id: 6,
    number: "106",
    type: "Suite",
    price: 6000,
    status: "Occupied",
  },
];

export const initialGuests = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul@gmail.com",
    phone: "9876543210",
  },
  {
    id: 2,
    name: "Ayesha Khan",
    email: "ayesha@gmail.com",
    phone: "9876501234",
  },
  {
    id: 3,
    name: "John Smith",
    email: "john@gmail.com",
    phone: "9988776655",
  },
];

export const initialBookings = [
  {
    id: 1,
    guest: "Rahul Sharma",
    room: "102",
    checkIn: "2026-08-10",
    checkOut: "2026-08-13",
    amount: 7500,
    status: "Checked In",
  },
  {
    id: 2,
    guest: "Ayesha Khan",
    room: "106",
    checkIn: "2026-08-11",
    checkOut: "2026-08-15",
    amount: 24000,
    status: "Confirmed",
  },
];
