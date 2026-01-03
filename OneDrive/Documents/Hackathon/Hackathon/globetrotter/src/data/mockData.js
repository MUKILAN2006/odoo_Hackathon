export const trips = [
  {
    id: "1",
    name: "Italian Adventure",
    startDate: "Mar 15, 2025",
    endDate: "Mar 28, 2025",
    destinations: 4,
    imageUrl: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&q=80",
    description: "Exploring the beautiful cities of Italy",
    activities: [
      { day: 1, city: "Rome", activities: [
        { name: "Colosseum Tour", time: "9:00 AM", cost: 25 },
        { name: "Vatican Museums", time: "2:00 PM", cost: 20 },
        { name: "Dinner at Trastevere", time: "7:00 PM", cost: 45 },
      ]},
      { day: 2, city: "Rome", activities: [
        { name: "Roman Forum", time: "10:00 AM", cost: 15 },
        { name: "Trevi Fountain", time: "3:00 PM", cost: 0 },
      ]},
      { day: 3, city: "Florence", activities: [
        { name: "Uffizi Gallery", time: "10:00 AM", cost: 30 },
        { name: "Ponte Vecchio Walk", time: "4:00 PM", cost: 0 },
      ]},
    ]
  },
  {
    id: "2",
    name: "Tokyo Explorer",
    startDate: "Apr 5, 2025",
    endDate: "Apr 15, 2025",
    destinations: 3,
    imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
    description: "Discovering the wonders of Japan",
    activities: []
  },
  {
    id: "3",
    name: "Greek Islands Escape",
    startDate: "Jun 1, 2025",
    endDate: "Jun 12, 2025",
    destinations: 5,
    imageUrl: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80",
    description: "Island hopping in the Aegean Sea",
    activities: []
  },
];

export const destinations = [
  {
    name: "Paris",
    country: "France",
    imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
    rating: 4.9,
    priceRange: "$$$",
    attractions: 15,
    bestTime: "Apr-Jun, Sep-Oct",
    description: "City of lights with iconic landmarks and world-class cuisine"
  },
  {
    name: "Bali",
    country: "Indonesia",
    imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    rating: 4.8,
    priceRange: "$$",
    attractions: 12,
    bestTime: "Apr-Oct",
    description: "Tropical paradise with stunning beaches and ancient temples"
  },
  {
    name: "Santorini",
    country: "Greece",
    imageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80",
    rating: 4.9,
    priceRange: "$$$$",
    attractions: 8,
    bestTime: "Apr-Nov",
    description: "Iconic island with white-washed buildings and spectacular sunsets"
  },
  {
    name: "New York",
    country: "United States",
    imageUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80",
    rating: 4.7,
    priceRange: "$$$$",
    attractions: 20,
    bestTime: "Apr-Jun, Sep-Nov",
    description: "The city that never sleeps with endless attractions and entertainment"
  },
];

export const user = {
  name: "Alex",
  email: "alex@example.com",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
};
