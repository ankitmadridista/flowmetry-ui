export default function Footer() {
  return (
    <footer className="border-t border-border mt-auto py-5 bg-background w-full shrink-0 relative z-10">
      <div className="px-6 max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
        <p className="text-[13px] text-foreground/50 m-0 tracking-wide">
          © {new Date().getFullYear()} Flowmetry
        </p>
        <div className="flex gap-6 text-[13px] text-foreground/50">
          {/* <a href="#" className="hover:text-heading transition-colors no-underline">Privacy Policy</a>
          <a href="#" className="hover:text-heading transition-colors no-underline">Terms of Service</a>
          <a href="mailto:support@flowmetry.com" className="hover:text-heading transition-colors no-underline">Contact</a> */}
        </div>
      </div>
    </footer>
  );
}
