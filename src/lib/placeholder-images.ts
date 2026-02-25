export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

// Moving data here to fix Turbopack JSON HMR error
export const PlaceHolderImages: ImagePlaceholder[] = [
  {
    "id": "clear-day",
    "description": "Clear bright blue sky with sun",
    "imageUrl": "https://images.unsplash.com/photo-1541734091135-d4a3c6235ed8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxjbGVhciUyMHNreXxlbnwwfHx8fDE3NzIwMjQ1Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "imageHint": "clear sky"
  },
  {
    "id": "clear-night",
    "description": "Starry night sky with stars",
    "imageUrl": "https://images.unsplash.com/photo-1506318137071-a8e063b4b477?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "imageHint": "starry night"
  },
  {
    "id": "cloudy-day",
    "description": "Dramatic clouds in the sky",
    "imageUrl": "https://images.unsplash.com/photo-1612297728955-a0ad12a75df9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "imageHint": "cloudy sky"
  },
  {
    "id": "cloudy-night",
    "description": "Dark cloudy night sky",
    "imageUrl": "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "imageHint": "cloudy night"
  },
  {
    "id": "rainy-day",
    "description": "Rainy day city landscape",
    "imageUrl": "https://images.unsplash.com/photo-1534088568595-a066f410bcda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "imageHint": "rainy day"
  },
  {
    "id": "rainy-night",
    "description": "Rainy street at night with lights",
    "imageUrl": "https://images.unsplash.com/photo-1428592953211-077101b2021b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "imageHint": "rainy night"
  },
  {
    "id": "snowy-day",
    "description": "Snowy mountain landscape in day",
    "imageUrl": "https://images.unsplash.com/photo-1542213598-338d614544f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "imageHint": "snowy day"
  },
  {
    "id": "snowy-night",
    "description": "Snowy landscape at night",
    "imageUrl": "https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "imageHint": "snowy night"
  }
];
