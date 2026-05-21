import type { Metadata, Viewport } from "next"
import { Outfit, DM_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { QueryProvider } from "@/components/providers/query-provider"

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
})

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://master-arhan-my-site-with-code.vercel.app"),
  title: {
    default: "StudyAI Pro V2 | #1 AI-Powered Study Hub by Master Arhan",
    template: "%s | StudyAI Pro V2",
  },
  description:
    "Learn Smart. Grow Limitless. Achieve Legendary. The #1 AI-powered study hub for Indian board exams (CBSE, ICSE, State Boards). Built by Master Arhan with advanced AI tutoring, flashcards, quizzes, and more.",
  applicationName: "StudyAI Pro V2",
  authors: [{ name: "Master Arhan", url: "https://master-arhan-my-site-with-code.vercel.app" }],
  generator: "Next.js",
  keywords: [
    "StudyAI Pro",
    "AI Study App",
    "CBSE Study",
    "ICSE Study",
    "Board Exam Preparation",
    "AI Tutor",
    "Flashcards",
    "Quiz Generator",
    "Mind Maps",
    "Master Arhan",
    "Indian Education",
    "Class 10",
    "Class 12",
    "JEE",
    "NEET",
  ],
  creator: "Master Arhan",
  publisher: "Master Arhan",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://master-arhan-my-site-with-code.vercel.app",
    siteName: "StudyAI Pro V2",
    title: "StudyAI Pro V2 | #1 AI-Powered Study Hub by Master Arhan",
    description:
      "Learn Smart. Grow Limitless. Achieve Legendary. The #1 AI-powered study hub for Indian board exams.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "StudyAI Pro V2 - AI-Powered Study Hub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StudyAI Pro V2 | #1 AI-Powered Study Hub",
    description: "Learn Smart. Grow Limitless. Achieve Legendary. Built by Master Arhan.",
    images: ["/og-image.jpg"],
    creator: "@MasterArhan",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-dark-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.json",
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f4fb" },
    { media: "(prefers-color-scheme: dark)", color: "#07071a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
}

// JSON-LD Structured Data for Google Search
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://master-arhan-my-site-with-code.vercel.app/#website",
      url: "https://master-arhan-my-site-with-code.vercel.app",
      name: "StudyAI Pro V2",
      description: "The #1 AI-powered study hub for Indian board exams",
      publisher: {
        "@id": "https://master-arhan-my-site-with-code.vercel.app/#organization",
      },
      potentialAction: [
        {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate:
              "https://master-arhan-my-site-with-code.vercel.app/search?q={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      ],
      inLanguage: "en-IN",
    },
    {
      "@type": "Organization",
      "@id": "https://master-arhan-my-site-with-code.vercel.app/#organization",
      name: "StudyAI Pro V2",
      url: "https://master-arhan-my-site-with-code.vercel.app",
      logo: {
        "@type": "ImageObject",
        inLanguage: "en-IN",
        "@id": "https://master-arhan-my-site-with-code.vercel.app/#logo",
        url: "https://master-arhan-my-site-with-code.vercel.app/logo.png",
        contentUrl: "https://master-arhan-my-site-with-code.vercel.app/logo.png",
        width: 512,
        height: 512,
        caption: "StudyAI Pro V2",
      },
      image: {
        "@id": "https://master-arhan-my-site-with-code.vercel.app/#logo",
      },
      founder: {
        "@type": "Person",
        name: "Master Arhan",
      },
      sameAs: [],
    },
    {
      "@type": "WebApplication",
      "@id": "https://master-arhan-my-site-with-code.vercel.app/#webapp",
      name: "StudyAI Pro V2",
      url: "https://master-arhan-my-site-with-code.vercel.app",
      applicationCategory: "EducationalApplication",
      operatingSystem: "All",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "INR",
      },
      featureList: [
        "AI-Powered Tutoring",
        "Flashcard System",
        "Quiz Generator",
        "Mind Map Creator",
        "Study Timer",
        "Board Exam Preparation",
      ],
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${outfit.variable} ${dmMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange={false}
          >
            {children}
            <Toaster position="bottom-right" richColors closeButton />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
