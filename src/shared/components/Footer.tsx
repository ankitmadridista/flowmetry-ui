export default function Footer() {
  return (
    <footer className="border-t border-border mt-20 py-8 bg-background">
      <div className="px-4 max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-foreground/60">
          © {new Date().getFullYear()} Flowmetry
        </p>
        <div className="flex gap-6 text-sm text-foreground/60">
          {/* <a href="#" className="hover:text-heading transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-heading transition-colors">Terms of Service</a> */}
          {/* <a href="mailto:support@flowmetry.com" className="hover:text-heading transition-colors">Contact</a> */}
        </div>
      </div>
    </footer>
  );
}