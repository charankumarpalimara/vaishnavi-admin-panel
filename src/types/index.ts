export interface ServiceItem {
  id: string;
  title: string;
  categoryId: string;
  categoryName: string;
  price: number;
  originalPrice?: number;
  durationMinutes: number;
  rating: number;
  reviewsCount: number;
  description: string;
  inclusions: string[];
  image: string;
  isPopular?: boolean;
  tag?: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  iconName?: string;
  image?: string;
  badge?: string;
  description: string;
}

export interface CartItem {
  service: ServiceItem;
  quantity: number;
}

export interface BookingDetails {
  fullName: string;
  phone: string;
  altPhone?: string;
  address: string;
  flatNo: string;
  landmark: string;
  bookingDate: string;
  timeSlot: string;
  serviceType: "home" | "studio";
  specialNotes?: string;
}

