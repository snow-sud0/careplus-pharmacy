import { useEffect, useState, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Baby,
  Clock3,
  HeartPulse,
  MapPin,
  Menu,
  MessageCircle,
  Pill,
  Phone,
  ShieldCheck,
  X,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import pharmacyCare from "@/assets/careplus-pharmacy-care.webp";
import pharmacyInterior from "@/assets/careplus-pharmacy-interior.webp";
import pharmacyLogo from "@/assets/careplus-pharmacy-logo.png";
import pharmacyEnquiry from "@/assets/pharmacy-enquiry-unsplash.jpg";
import pharmacyDelivery from "@/assets/pharmacy-delivery-pexels.jpg";

const ENQUIRY_FORM_URL = "https://example.com/replace-with-customer-enquiry-form";
const PHARMACY_ADDRESS =
  "1, Lucky Street, opposite UBTH, Ugbowo, Lagos Road, Benin City, Edo State, Nigeria";
const OPENING_HOURS = "Monday – Sunday, 7:30 AM – 10:00 PM.";
const PHARMACY_PHONE_DISPLAY = "08189612315";
const PHARMACY_PHONE_HREF = "tel:+2348189612315";
const DIRECTIONS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(PHARMACY_ADDRESS)}`;

const navigationLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

const services: Service[] = [
  {
    icon: Pill,
    title: "Medications",
    description: "Enquire about medication availability.",
  },
  {
    icon: Baby,
    title: "Baby Products",
    description: "Explore everyday baby-care essentials.",
  },
  {
    icon: HeartPulse,
    title: "Healthcare Products",
    description: "Find everyday healthcare essentials.",
  },
  {
    icon: MessageCircle,
    title: "Pharmacy Support",
    description: "Get help with general pharmacy enquiries.",
  },
];

type Service = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CarePlus Pharmacy | Your Community Pharmacy in Benin City" },
      {
        name: "description",
        content: `Visit CarePlus Pharmacy at ${PHARMACY_ADDRESS}, for medications, baby products, healthcare essentials and friendly pharmacy support.`,
      },
      { property: "og:title", content: "CarePlus Pharmacy | Your Health. Our Priority." },
      {
        property: "og:description",
        content:
          "Your trusted community pharmacy for medications, baby products and everyday healthcare needs in Benin City.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    document.documentElement.classList.add("has-reveal-observer");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -36px 0px" },
    );

    revealItems.forEach((item) => observer.observe(item));

    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("has-reveal-observer");
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <div className="careplus-root">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <header className="site-header">
        <div className="page-container site-header__inner">
          <a
            className="brand-lockup"
            href="#home"
            aria-label="CarePlus Pharmacy home"
            onClick={() => setMenuOpen(false)}
          >
            <img
              className="brand-logo-image"
              src={pharmacyLogo}
              alt="CarePlus Pharmacy logo"
              width="1156"
              height="367"
            />
          </a>

          <nav
            id="primary-navigation"
            className={`site-navigation${menuOpen ? " is-open" : ""}`}
            aria-label="Main navigation"
          >
            {navigationLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
                {link.label}
              </a>
            ))}
          </nav>

          <div className="site-header__actions">
            <EnquiryButton className="care-button--compact">
              Enquire <ArrowUpRight aria-hidden="true" />
            </EnquiryButton>
            <Button
              variant="ghost"
              size="icon"
              className="mobile-menu-toggle"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              aria-controls="primary-navigation"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </Button>
          </div>
        </div>
      </header>

      <main id="main-content">
        <section className="hero-section hero-section--immersive" id="home" aria-labelledby="hero-title">
          <img
            className="hero-background-image"
            src={pharmacyInterior}
            alt=""
            aria-hidden="true"
            width="1536"
            height="1024"
            fetchPriority="high"
          />
          <div className="hero-image-overlay" aria-hidden="true" />
          <div className="page-container hero-grid">
            <div className="hero-copy" data-reveal>
              <p className="eyebrow">
                <span className="eyebrow__line" aria-hidden="true" />
                Community pharmacy · Benin City
              </p>
              <h1 id="hero-title">
                Your Health.
                <br />
                <span>Our Priority.</span>
              </h1>
              <p className="hero-lede">
                Your trusted community pharmacy for medications, baby products and everyday
                healthcare needs.
              </p>
              <div className="hero-actions">
                <EnquiryButton className="care-button--large">
                  Enquire Now <ArrowUpRight aria-hidden="true" />
                </EnquiryButton>
                <a className="text-link" href="#services">
                  Explore Services <ArrowRight aria-hidden="true" />
                </a>
              </div>
              <div className="hero-reassurance">
                <ShieldCheck aria-hidden="true" />
                <span>Everyday care, close to home</span>
              </div>
            </div>
            <div className="hero-location-pill" data-reveal>
              <MapPin aria-hidden="true" />
              <span>Serving the Benin City community</span>
            </div>
          </div>
        </section>

        <section className="about-section section-space" id="about" aria-labelledby="about-title">
          <div className="page-container about-grid">
            <figure className="about-photo reveal--image" data-reveal>
              <img
                src={pharmacyCare}
                alt="A pharmacist speaking with a customer in a community pharmacy"
                width="1536"
                height="1024"
                loading="lazy"
                decoding="async"
              />
              <figcaption className="about-photo__caption">
                <span className="about-photo__icon" aria-hidden="true">
                  <HeartPulse />
                </span>
                <span>Here for your everyday health needs</span>
              </figcaption>
            </figure>

            <div className="about-copy" data-reveal>
              <p className="eyebrow">
                <span className="eyebrow__line" aria-hidden="true" />A little closer to care
              </p>
              <h2 id="about-title">Your Community Pharmacy, Here for You.</h2>
              <p>
                At CarePlus Pharmacy, we are committed to helping our community access medications,
                healthcare products and everyday pharmacy essentials. We aim to make it easier for
                customers to get information and make enquiries about the products and services they
                need.
              </p>
              <a className="text-link" href="#contact">
                Find CarePlus <ArrowRight aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        <section
          className="services-section section-space"
          id="services"
          aria-labelledby="services-title"
        >
          <div className="page-container">
            <div className="section-heading" data-reveal>
              <div>
                <p className="eyebrow">
                  <span className="eyebrow__line" aria-hidden="true" />
                  Here when you need us
                </p>
                <h2 id="services-title">What We Offer</h2>
              </div>
              <p>
                From everyday essentials to helpful product enquiries, our pharmacy is here for the
                community.
              </p>
            </div>

            <div className="service-grid">
              {services.map((service) => (
                <ServiceCard key={service.title} service={service} />
              ))}
            </div>
          </div>
        </section>

        <section className="enquiry-section" aria-labelledby="enquiry-title">
          <div className="page-container enquiry-inner" data-reveal>
            <div className="enquiry-mark" aria-hidden="true">
              <Pill />
            </div>
            <div className="enquiry-copy">
              <p className="eyebrow eyebrow--light">Here to help</p>
              <h2 id="enquiry-title">Looking for a Specific Product?</h2>
              <p>
                Let us help you check whether the product you need is available. Send us an enquiry
                and our team can assist you.
              </p>
              <p className="form-note">Customer enquiry form link to be added.</p>
            </div>
            <figure className="enquiry-photo reveal--image" data-reveal>
              <img
                src={pharmacyEnquiry}
                alt="Medication blister packs shown as an example of products customers can ask about"
                width="1800"
                height="1800"
                loading="lazy"
                decoding="async"
              />
            </figure>
            <EnquiryButton className="care-button--light care-button--large">
              Enquire About a Product <ArrowUpRight aria-hidden="true" />
            </EnquiryButton>
          </div>
        </section>

        <section className="delivery-section section-space" aria-labelledby="delivery-title">
          <div className="page-container delivery-inner">
            <figure className="delivery-photo reveal--image" data-reveal>
              <img
                src={pharmacyDelivery}
                alt="A Black delivery courier holding a parcel beside a motorcycle"
                width="1600"
                height="1000"
                loading="lazy"
                decoding="async"
              />
            </figure>
            <div className="delivery-copy" data-reveal>
              <p className="eyebrow">
                <span className="eyebrow__line" aria-hidden="true" />
                Delivery enquiries
              </p>
              <h2 id="delivery-title">Need delivery information?</h2>
              <p>
                We offer delivery services across Benin City. Contact CarePlus Pharmacy to enquire
                about product availability and delivery arrangements.
              </p>
            </div>
            <a className="text-link delivery-link" href="#contact" data-reveal>
              Get in touch <ArrowRight aria-hidden="true" />
            </a>
          </div>
        </section>

        <section
          className="contact-section section-space"
          id="contact"
          aria-labelledby="contact-title"
        >
          <div className="page-container contact-grid">
            <div className="contact-copy" data-reveal>
              <p className="eyebrow">
                <span className="eyebrow__line" aria-hidden="true" />
                Come say hello
              </p>
              <h2 id="contact-title">Find CarePlus Pharmacy.</h2>
              <p className="contact-intro">
                We’re here to help with product availability and general pharmacy enquiries.
              </p>
              <dl className="contact-list">
                <div>
                  <dt>
                    <MapPin aria-hidden="true" /> Location
                  </dt>
                  <dd>{PHARMACY_ADDRESS}</dd>
                </div>
                <div>
                  <dt>
                    <Phone aria-hidden="true" /> Contact
                  </dt>
                  <dd>
                    <a className="contact-phone" href={PHARMACY_PHONE_HREF}>
                      {PHARMACY_PHONE_DISPLAY}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt>
                    <Clock3 aria-hidden="true" /> Opening hours
                  </dt>
                  <dd>{OPENING_HOURS}</dd>
                </div>
              </dl>
              <EnquiryButton className="care-button--large">
                Enquire Now <ArrowUpRight aria-hidden="true" />
              </EnquiryButton>
            </div>

            <a
              className="directions-card care-lift"
              href={DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-reveal
            >
              <span className="directions-card__art" aria-hidden="true">
                <span className="directions-card__ring directions-card__ring--one" />
                <span className="directions-card__ring directions-card__ring--two" />
                <MapPin />
              </span>
              <span className="directions-card__label">Visit us in Benin City</span>
              <strong>{PHARMACY_ADDRESS}</strong>
              <span className="directions-card__action">
                Get directions <ArrowUpRight aria-hidden="true" />
              </span>
            </a>
          </div>
        </section>

        {/* CHATBASE INTEGRATION POINT: add the approved embed here when the account is ready.
            Limit answers to general pharmacy information; never diagnose, recommend medicines,
            suggest dosages, or replace a qualified pharmacist. */}
        <div id="chatbase-integration" data-integration-status="pending" aria-hidden="true" />
      </main>

      <footer className="site-footer">
        <div className="page-container footer-main">
          <a className="brand-lockup brand-lockup--footer" href="#home">
            <img
              className="brand-logo-image"
              src={pharmacyLogo}
              alt="CarePlus Pharmacy logo"
              width="1156"
              height="367"
            />
          </a>
          <nav className="footer-navigation" aria-label="Footer navigation">
            {navigationLinks.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="page-container footer-bottom">
          <span>© {new Date().getFullYear()} CarePlus Pharmacy</span>
          <span>Everyday care, close to home.</span>
        </div>
      </footer>
    </div>
  );
}

function EnquiryButton({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <Button asChild className={`care-button ${className}`}>
      <a href={ENQUIRY_FORM_URL} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    </Button>
  );
}

function ServiceCard({ service }: { service: Service }) {
  const Icon = service.icon;

  return (
    <a
      className={`service-card service-card--${service.title.toLowerCase().replaceAll(" ", "-")} care-lift`}
      href={ENQUIRY_FORM_URL}
      target="_blank"
      rel="noopener noreferrer"
      data-reveal
    >
      <span className="service-card__visual" aria-hidden="true">
        <span className="service-card__icon">
          <Icon />
        </span>
      </span>
      <span className="service-card__copy">
        <strong>{service.title}</strong>
        <span>{service.description}</span>
      </span>
      <span className="service-card__action">
        Enquire <ArrowUpRight aria-hidden="true" />
      </span>
    </a>
  );
}
