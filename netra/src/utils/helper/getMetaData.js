export function getMetaData({title, description}) {
  return {
    title,
    description,

    generator: "Next.js",
    applicationName: "NETRA",
    keywords: [
      "NETRA",
      "SIEM",
      "Security Information and Event Management",
      "Cybersecurity",
      "Monitoring Dashboard",
      "AI-powered SIEM",
      "Web-based SIEM"
    ],

    authors: "Satpam Daring",
    creator: "Satpam Daring",
    publisher: "Satpam Daring",

    category: "Education",
    applicationCategory: "education",
    classification: "Education",
    referrer: "origin-when-cross-origin",

    formatDetection: {
      email: false,
      address: false,
      telephone: false
    },

    // Robots meta tag
    robots: {
      index: true, // Allow indexing
      follow: true, // Allow link-following
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1
      }
    },

    // Favicon and icon definitions
    icons: {
      icon: [
        {
          url: `assets/favicon/android-chrome-192x192.png`,
          sizes: "192x192",
          type: "image/png"
        },
        {
          url: `assets/favicon/android-chrome-512x512.png`,
          sizes: "512x512",
          type: "image/png"
        },
        {url: `assets/favicon/favicon.ico`}
      ],
      apple: [
        {
          url: `assets/favicon/apple-touch-icon.png`,
          sizes: "180x180",
          type: "image/png"
        }
      ],
      shortcut: [{url: `assets/favicon/favicon.ico`}],
      other: [
        {
          rel: "android-chrome-192x192",
          url: `assets/favicon/android-chrome-192x192.png`,
          sizes: "192x192"
        },
        {
          rel: "android-chrome-512x512",
          url: `assets/favicon/android-chrome-512x512.png`,
          sizes: "512x512"
        }
      ]
    },

    manifest: `assets/favicon/site.webmanifest`,
    other: {
      "mobile-web-app-capable": "yes"
    }
  };
}
