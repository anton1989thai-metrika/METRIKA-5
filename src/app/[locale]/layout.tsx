import Providers from '@/components/Providers'

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({
  children,
  params
}: LocaleLayoutProps) {
  const { locale } = await params

  return (
    <html lang={locale}>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
