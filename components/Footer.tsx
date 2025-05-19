// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="dark:bg-dark-background dark:text-dark-text bg-background text-text text-center py-4 mt-8">
      <p>&copy; {new Date().getFullYear()} UNOPS - GPO Compass AI</p>
    </footer>
  ); 
}
