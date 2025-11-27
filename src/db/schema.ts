import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

export const contactSubmissions = sqliteTable('contact_submissions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  createdAt: text('created_at').notNull(),
});

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  clerkId: text('clerk_id').notNull().unique(),
  email: text('email').notNull(),
  name: text('name'),
  phone: text('phone'),
  role: text('role').notNull().default('user'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at'),
});

export const reservations = sqliteTable('reservations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id),
  excursionSlug: text('excursion_slug').notNull(),
  excursionName: text('excursion_name').notNull(),
  destination: text('destination').notNull(),
  reservationDate: text('reservation_date').notNull(),
  reservationTime: text('reservation_time').notNull(),
  bookingDate: text('booking_date').notNull(),
  adults: integer('adults').notNull().default(1),
  children: integer('children').default(0),
  totalPriceMad: real('total_price_mad').notNull(),
  selectedItems: text('selected_items'),
  status: text('status').notNull().default('pending'),
  paymentStatus: text('payment_status').default('pending'),
  notes: text('notes'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at'),
});

export const reviews = sqliteTable('reviews', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id),
  reservationId: integer('reservation_id').references(() => reservations.id),
  excursionSlug: text('excursion_slug').notNull(),
  excursionName: text('excursion_name').notNull(),
  rating: integer('rating').notNull(),
  title: text('title'),
  comment: text('comment').notNull(),
  images: text('images'),
  isVerified: integer('is_verified', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at'),
});

export const services = sqliteTable('services', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title', { mode: 'json' }).notNull(),
  description: text('description', { mode: 'json' }).notNull(),
  icon: text('icon').notNull(),
  order: integer('order').notNull().default(0),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const orders = sqliteTable('orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  orderNumber: text('order_number').notNull().unique(),
  userClerkId: text('user_clerk_id'),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  passport: text('passport').notNull(),
  city: text('city').notNull(),
  accommodationType: text('accommodation_type').notNull(),
  hotelName: text('hotel_name'),
  address: text('address'),
  paymentMethod: text('payment_method').notNull(),
  cartItems: text('cart_items').notNull(),
  totalMad: real('total_mad').notNull(),
  status: text('status').notNull().default('pending'),
  paymentStatus: text('payment_status').notNull().default('pending'),
  transactionId: text('transaction_id'),
  authCode: text('auth_code'),
  paymentResponse: text('payment_response'),
  paidAt: integer('paid_at'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at'),
});

export const excursionSettings = sqliteTable('excursion_settings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  section: text('section').notNull().unique(),
  showPrice: integer('show_price', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});