export const site = {
  name: 'Magic Touch art jewellery',
  shortName: 'Magic Touch',
  subName: 'art jewellery',
  category: 'Jewellery Boutique · Mulund West',
  tagline: 'Everyday luxury crafted to keep its shine, year after year.',
  phoneDisplay: '+91 72084 95747',
  phoneTel: '+917208495747',
  whatsapp: '917208495747',
  whatsappMessage: "Hi Magic Touch, I'd like to know more about your jewellery collection.",
  addressLines: [
    'Arihant Darshan, V.P. Road',
    'near Lions Club',
    'Mulund West, Mumbai 400080',
    'Maharashtra',
  ],
  addressSingleLine: 'Arihant Darshan, V.P. Road, near Lions Club, Mulund West, Mumbai 400080',
  neighborhood: 'Mulund West, Mumbai',
  placeId: 'ChIJl-9MShK55zsRa8JRHrc1avM',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Google&query_place_id=ChIJl-9MShK55zsRa8JRHrc1avM',
  mapsEmbedUrl:
    'https://www.google.com/maps?q=Magic+Touch+art+jewellery,+Arihant+Darshan,+V.P.+Road,+near+Lions+Club,+Mulund+West,+Mumbai+400080&output=embed',
  rating: '5.0',
  reviewCount: '8+',
  // index = JS getDay(): 0 Sunday ... 6 Saturday
  hours: [
    { day: 'Sunday', time: '11:00 AM – 7:00 PM', open: 11 * 60, close: 19 * 60 },
    { day: 'Monday', time: 'Closed', open: null, close: null },
    { day: 'Tuesday', time: '11:00 AM – 8:00 PM', open: 11 * 60, close: 20 * 60 },
    { day: 'Wednesday', time: '11:00 AM – 7:30 PM', open: 11 * 60, close: 19 * 60 + 30 },
    { day: 'Thursday', time: '11:00 AM – 7:00 PM', open: 11 * 60, close: 19 * 60 },
    { day: 'Friday', time: '11:00 AM – 7:30 PM', open: 11 * 60, close: 19 * 60 + 30 },
    { day: 'Saturday', time: '11:00 AM – 7:00 PM', open: 11 * 60, close: 19 * 60 },
  ],
  pillars: [
    {
      num: '01',
      title: 'Water-Resistant Finish',
      body: 'Made for daily wear. Our anti-tarnish plating holds its colour and shine without fading.',
    },
    {
      num: '02',
      title: 'Daily & Festive Pieces',
      body: 'Simple chains, rings, and pearl drops for everyday use, alongside traditional jhumkas and bangles.',
    },
    {
      num: '03',
      title: 'Try In-Store in Mulund',
      body: 'Visit us on V.P. Road near Lions Club to see the collection in person or match pieces to your outfit.',
    },
  ],
  reviews: [
    {
      author: 'suffiya khan',
      initial: 's',
      color: '#4a6fa5',
      date: 'April 19, 2025',
      rating: 5,
      text: 'Best shop to get anti tarnish accessories',
    },
    {
      author: 'Rupali Jadhav',
      initial: 'R',
      color: '#5c4d7d',
      date: 'July 22, 2024',
      rating: 5,
      text: 'Absolutely in love with the collection from Magic Touch Art Jewelry!',
    },
    {
      author: 'mansi vora',
      initial: 'm',
      color: '#d81b60',
      date: 'July 22, 2024',
      rating: 5,
      text: "Amazing product.. using from past three years the colour shine is still the same.. have to say thank you to magic touch art jewellery as they promised that it's water resistant and colour n shine remains same.. would recommend every one to go for it without worry..",
    },
  ],
  reviewsUrl:
    'https://www.google.com/maps/search/?api=1&query=Google&query_place_id=ChIJl-9MShK55zsRa8JRHrc1avM',
}

export const waLink = (msg = site.whatsappMessage) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(msg)}`

export function getStoreStatus() {
  try {
    const nowIST = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
    )
    const dayIndex = nowIST.getDay()
    const minutes = nowIST.getHours() * 60 + nowIST.getMinutes()
    const schedule = site.hours[dayIndex]

    if (!schedule || schedule.open === null) {
      return {
        isOpen: false,
        dayIndex,
        label: 'Closed today · Opens Tuesday 11:00 AM',
        todayHours: 'Closed on Mondays',
      }
    }

    const isOpen = minutes >= schedule.open && minutes < schedule.close
    return {
      isOpen,
      dayIndex,
      label: isOpen
        ? `Open now in Mulund West · Until ${schedule.time.split('–')[1].trim()}`
        : `Closed now · Today’s hours: ${schedule.time}`,
      todayHours: schedule.time,
    }
  } catch {
    return {
      isOpen: true,
      dayIndex: new Date().getDay(),
      label: 'Mulund West · Tue–Sun from 11:00 AM',
      todayHours: '11:00 AM – 7:30 PM',
    }
  }
}
