export const petImages: Record<'puppy' | 'kitten', string[]> = {
  puppy: [
  '/images/puppy1.jpeg',
  '/images/puppy2.jpeg',
  '/images/puppy3.jpeg',
  '/images/puppy4.jpeg',
  '/images/puppy5.jpeg',
  '/images/puppy6.jpeg',
  '/images/puppy7.jpeg',
  '/images/puppy8.jpeg'
  ],
  kitten: [
  '/images/kitten1.jpeg',
  '/images/kitten2.jpeg',
  '/images/kitten3.jpeg',
  '/images/kitten4.jpeg',
  '/images/kitten5.jpeg',
  '/images/kitten6.jpeg',
  '/images/kitten7.jpeg',
  '/images/kitten8.jpeg'
    
  ]
};

export function getRandomPetImage(type: 'puppy' | 'kitten') {
  const images = petImages[type];
  return images[Math.floor(Math.random() * images.length)];
}
