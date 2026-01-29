import './globals.css'

export const metadata = {
  title: 'Vada Dashboard',
  description: 'Teacher dashboard for managing Vada AI tutor assignments',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
