// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-dark-background text-dark-text text-center py-4 mt-8">
      <p>&copy; {new Date().getFullYear()} UNOPS - Portfolio outils internes</p>
    </footer>
  );
}
