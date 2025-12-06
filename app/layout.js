// app/layout.js

<head>
  <title>My App</title>
  <meta name="description" content="My Next.js App" />
</head>

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
