"use client"

import Image from "next/image"
import Link from "next/link"
import { Menu } from "lucide-react"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface CustomNavbarProps {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  menu?: MenuItem[];
  scrollFunctions?: {
    campaigns?: () => void;
    prices?: () => void;
    faq?: () => void;
  };
  activeSection?: string;
}

export function CustomNavbar({
  logo = {
    url: "/",
    src: "/images/logo.png",
    alt: "EV Şarj Kampanyaları Logo",
    title: "Şarj Kampanya",
  },
  menu = [
    { title: "Kampanyalar", url: "#kampanyalar" },
    { title: "Fiyatlar", url: "#fiyatlar" },
    { title: "Blog", url: "/blog" },
    { title: "SSS", url: "#sss" }
  ],
  scrollFunctions,
  activeSection
}: CustomNavbarProps) {
  const pathname = usePathname();
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  
  // Update current section based on prop or scroll position
  useEffect(() => {
    if (activeSection) {
      setCurrentSection(activeSection);
      return;
    }

    // Observer for detecting visible sections
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (id === "kampanyalar") {
              setCurrentSection("kampanyalar");
            } else if (id === "fiyatlar") {
              setCurrentSection("fiyatlar");
            } else if (id === "sss") {
              setCurrentSection("sss");
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    // Observe sections
    const campaignsSection = document.getElementById("kampanyalar");
    const pricesSection = document.getElementById("fiyatlar");
    const faqSection = document.getElementById("sss");

    if (campaignsSection) observer.observe(campaignsSection);
    if (pricesSection) observer.observe(pricesSection);
    if (faqSection) observer.observe(faqSection);

    return () => {
      if (campaignsSection) observer.unobserve(campaignsSection);
      if (pricesSection) observer.unobserve(pricesSection);
      if (faqSection) observer.unobserve(faqSection);
    };
  }, [activeSection]);
  
  const handleNavClick = (menuItem: MenuItem, event?: React.MouseEvent) => {
    event?.preventDefault();
    
    if (menuItem.url === "#kampanyalar" && scrollFunctions?.campaigns) {
      scrollFunctions.campaigns();
    } else if (menuItem.url === "#fiyatlar" && scrollFunctions?.prices) {
      scrollFunctions.prices();
    } else if (menuItem.url === "#sss" && scrollFunctions?.faq) {
      scrollFunctions.faq();
    } else if (menuItem.url.startsWith('#')) {
      const element = document.getElementById(menuItem.url.substring(1));
      if (element) {
        const yOffset = -80; // header height plus padding
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    } else if (!menuItem.url.startsWith('#')) {
      window.location.href = menuItem.url;
    }
  };

  // Check if a menu item is active
  const isActive = (item: MenuItem) => {
    if (item.url === "/blog" && pathname.startsWith("/blog")) {
      return true;
    }
    
    if (item.url === "#kampanyalar" && currentSection === "kampanyalar") {
      return true;
    }
    
    if (item.url === "#fiyatlar" && currentSection === "fiyatlar") {
      return true;
    }
    
    if (item.url === "#sss" && currentSection === "sss") {
      return true;
    }
    
    return false;
  };

  return (
    <div className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto py-4">
        <nav className="hidden justify-between lg:flex">
          <div className="flex items-center">
            <Link href={logo.url} className="flex items-center gap-2">
              <Image 
                src={logo.src}
                alt={logo.alt}
                width={115}
                height={50}
                className="mr-1"
                priority
                unoptimized
              />
            </Link>
          </div>
          <div className="flex items-center">
            <NavigationMenu>
              <NavigationMenuList>
                {menu.map((item) => {
                  const active = isActive(item);
                  
                  if (item.items) {
                    return (
                      <NavigationMenuItem key={item.title} className="text-muted-foreground">
                        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="w-80 p-3">
                            <NavigationMenuLink>
                              {item.items.map((subItem) => (
                                <li key={subItem.title}>
                                  <a
                                    className="flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted hover:text-accent-foreground"
                                    href={subItem.url}
                                    onClick={(e) => handleNavClick(subItem, e)}
                                  >
                                    {subItem.icon}
                                    <div>
                                      <div className="text-sm font-semibold">
                                        {subItem.title}
                                      </div>
                                      {subItem.description && (
                                        <p className="text-sm leading-snug text-muted-foreground">
                                          {subItem.description}
                                        </p>
                                      )}
                                    </div>
                                  </a>
                                </li>
                              ))}
                            </NavigationMenuLink>
                          </ul>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    );
                  }

                  return (
                    <a
                      key={item.title}
                      className={`group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground ${
                        active
                          ? "bg-muted text-accent-foreground"
                          : "text-muted-foreground"
                      }`}
                      href={item.url}
                      onClick={(e) => handleNavClick(item, e)}
                    >
                      {item.title}
                    </a>
                  );
                })}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </nav>
        
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <Link href={logo.url} className="flex items-center gap-2 ml-2">
              <Image 
                src={logo.src}
                alt={logo.alt}
                width={115}
                height={50}
                className="mr-1"
                priority
                unoptimized
              />
            </Link>
            <Sheet>
              <SheetTrigger asChild className="mr-2">
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <Link href={logo.url} className="flex items-center gap-2">
                      <Image 
                        src={logo.src}
                        alt={logo.alt}
                        width={40}
                        height={40}
                        className="mr-1"
                        priority
                        unoptimized
                      />
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="my-6 flex flex-col gap-6">
                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-4"
                  >
                    {menu.map((item) => renderMobileMenuItem(item, handleNavClick, isActive(item)))}
                  </Accordion>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  );
}

function renderMobileMenuItem(
  item: MenuItem, 
  handleNavClick: (item: MenuItem, event?: React.MouseEvent) => void,
  isActive: boolean
) {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <a
              key={subItem.title}
              className="flex select-none gap-4 rounded-md p-3 leading-none outline-none transition-colors hover:bg-muted hover:text-accent-foreground"
              href={subItem.url}
              onClick={(e) => handleNavClick(subItem, e)}
            >
              {subItem.icon}
              <div>
                <div className="text-sm font-semibold">{subItem.title}</div>
                {subItem.description && (
                  <p className="text-sm leading-snug text-muted-foreground">
                    {subItem.description}
                  </p>
                )}
              </div>
            </a>
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <a 
      key={item.title} 
      href={item.url} 
      className={`font-semibold py-2 block ${isActive ? "text-accent-foreground" : ""}`}
      onClick={(e) => handleNavClick(item, e)}
    >
      {item.title}
    </a>
  );
} 