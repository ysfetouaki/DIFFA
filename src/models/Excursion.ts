import mongoose, { Document, Schema } from 'mongoose';

export interface IExcursionItem {
  id: string;
  label: string;
  price: number;
  defaultChecked: boolean;
}

export type ExcursionSection = 'marrakech' | 'agadir' | 'taghazout' | 'circuits';

export interface IExcursion extends Document {
  id: string;
  name: string;
  section: ExcursionSection;
  images: string[];
  priceMAD: number;
  location: string;
  duration: string;
  groupSize: string;
  rating: number;
  description: string;
  items: IExcursionItem[];
  ageGroups: boolean;
  highlights: string[];
  included: string[];
  notIncluded: string[];
  createdAt: Date;
  updatedAt: Date;
}

const excursionItemSchema = new Schema<IExcursionItem>({
  id: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  defaultChecked: {
    type: Boolean,
    default: false,
  },
});

const excursionSchema = new Schema<IExcursion>(
  {
    id: {
      type: String,
      required: [true, 'Excursion ID is required'],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    section: {
      type: String,
      required: [true, 'Section is required'],
      enum: ['marrakech', 'agadir', 'taghazout', 'circuits'],
    },
    images: {
      type: [String],
      required: [true, 'At least one image is required'],
      validate: {
        validator: function(v: string[]) {
          return v && v.length > 0;
        },
        message: 'At least one image is required',
      },
    },
    priceMAD: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be positive'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    duration: {
      type: String,
      required: [true, 'Duration is required'],
      trim: true,
    },
    groupSize: {
      type: String,
      required: [true, 'Group size is required'],
      trim: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    items: {
      type: [excursionItemSchema],
      default: [],
    },
    ageGroups: {
      type: Boolean,
      default: true,
    },
    highlights: {
      type: [String],
      default: [],
    },
    included: {
      type: [String],
      default: [],
    },
    notIncluded: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation in development
export const Excursion = mongoose.models.Excursion || mongoose.model<IExcursion>('Excursion', excursionSchema);