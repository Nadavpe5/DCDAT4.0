import localFont from 'next/font/local'

// Intel One Display font family
export const intelOneDisplay = localFont({
  src: [
    {
      path: '../public/fonts/intelone-display-light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/intelone-display-regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/intelone-display-medium.ttf',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-intel-one-display',
  display: 'swap',
})

// Export individual font weights for specific use cases
export const intelOneDisplayLight = localFont({
  src: '../public/fonts/intelone-display-light.ttf',
  weight: '300',
  style: 'normal',
  variable: '--font-intel-one-display-light',
  display: 'swap',
})

export const intelOneDisplayRegular = localFont({
  src: '../public/fonts/intelone-display-regular.ttf',
  weight: '400',
  style: 'normal',
  variable: '--font-intel-one-display-regular',
  display: 'swap',
})

export const intelOneDisplayMedium = localFont({
  src: '../public/fonts/intelone-display-medium.ttf',
  weight: '500',
  style: 'normal',
  variable: '--font-intel-one-display-medium',
  display: 'swap',
}) 