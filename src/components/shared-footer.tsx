import { Link } from "@tanstack/react-router";

export function SharedFooter() {
  return (
    <footer className="border-t border-border bg-[#faf8f3]">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-8 px-6 py-12 text-sm md:grid-cols-4">
        <div>
          <h4 className="font-serif text-xl mb-4">Impressions</h4>
          <p className="text-muted-foreground">
            Wedding cards, made for you.
          </p>
        </div>
        <div>
          <h5 className="mb-3 font-semibold">Shop</h5>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <Link to="/shop" className="hover:text-foreground">
                All cards
              </Link>
            </li>
            <li>
              <Link to="/customize" className="hover:text-foreground">
                Customize
              </Link>
            </li>
            <li>
              <Link to="/customize" className="hover:text-foreground">
                Design your own
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h5 className="mb-3 font-semibold">Support</h5>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <a href="#" className="hover:text-foreground">
                Contact us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-foreground">
                Shipping
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-foreground">
                Returns
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h5 className="mb-3 font-semibold">Company</h5>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <Link to="/" className="hover:text-foreground">
                About
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-[1400px] px-6 py-6 text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Impressions. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
