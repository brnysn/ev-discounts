import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert } from "@/components/ui/alert"
import Image from "next/image"
import { Calendar, TriangleAlert } from "lucide-react"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import campaigns from "@/app/data/campaigns.json"
import data from "@/app/data/data.json"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function BankCampaigns() {
  // Function to get company data by ID
  const getCompanyById = (id: string) => {
    return data.find(company => 
      company.name.toLowerCase().replace(/\s+/g, '-') === id.toLowerCase()
    );
  };

  // Function to get compatible companies
  const getCompatibleCompanies = (compatibleWith: string[]) => {
    if (compatibleWith.includes("all")) {
      return data;
    }
    return compatibleWith
      .map(id => getCompanyById(id))
      .filter(company => company !== undefined);
  };

  // Function to determine campaign status
  const getCampaignStatus = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return "soon";
    if (now > end) return "passed";
    return "current";
  };

  // Function to get badge variant based on status
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "current":
        return "default";
      case "passed":
        return "destructive";
      case "soon":
        return "secondary";
      default:
        return "outline";
    }
  };

  // Filter active campaigns
  const activeCampaigns = campaigns.filter(item => {
    const status = getCampaignStatus(item.campaign.startDate, item.campaign.endDate);
    return status === "current";
  });

  return (
    <section className="container mx-auto">
      <div className="mb-8 pt-4">
        <h2 className="text-2xl font-bold mb-2">Aktif Kampanyalar</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeCampaigns.map((item, index) => {
          const status = getCampaignStatus(item.campaign.startDate, item.campaign.endDate);
          
          return (
            <Card key={index} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="h-12 w-32 relative">
                    <Image
                      src={item.company.logo}
                      alt={item.company.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={item.campaign.combinable ? "default" : "secondary"}>
                      {item.campaign.combinable ? "Birleştirilebilir" : "Birleştirilemez"}
                    </Badge>
                    <Badge 
                      variant={getBadgeVariant(status)}
                      className={cn(
                        status === "current" && "bg-green-400 hover:bg-green-400/90",
                        status === "soon" && "bg-yellow-400 hover:bg-yellow-400/90",
                        status === "passed" && "bg-gray-400 hover:bg-gray-400/90",
                      )}
                    >
                      {status === "current" ? "Aktif" : status === "soon" ? "Yakında" : "Süresi Doldu"}
                    </Badge>
                  </div>
                </div>
                <CardTitle>{item.campaign.title}</CardTitle>
                <CardDescription>{item.campaign.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {format(new Date(item.campaign.startDate), "d MMMM yyyy", { locale: tr })} -{" "}
                    {format(new Date(item.campaign.endDate), "d MMMM yyyy", { locale: tr })}
                  </span>
                </div>
                <div className="space-y-4">
                  <Alert
                    className="mb-3"
                    variant="warning"
                    icon={<TriangleAlert className="opacity-60" size={16} strokeWidth={2} />}
                  >
                    <ScrollArea className="h-24 w-full rounded-md">
                      <ul className="text-sm space-y-2">
                        {item.campaign.conditions.map((condition, idx) => (
                          <li key={idx}>{condition}</li>
                        ))}
                      </ul>
                    </ScrollArea>
                  </Alert>
                  
                  {/* Compatible EV Charger Companies */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Geçerli Şarj İstasyonları</h4>
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                      {getCompatibleCompanies(item.campaign.compatibleWith).map((company, idx) => (
                        company && (
                          <TooltipProvider key={idx}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="relative h-8 w-full bg-gray-50 rounded-md p-1">
                                  <Image
                                    src={company.logo}
                                    alt={company.name}
                                    fill
                                    className="object-contain p-1"
                                  />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{company.name}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge variant="outline" className="text-green-600 bg-green-100">
                        {item.campaign.calculateCombinedPrice.value}% İndirim
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Maksimum indirim oranı</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Button asChild variant="outline">
                  <a href={item.campaign.links.details} target="_blank" rel="noopener noreferrer">
                    Detaylar
                  </a>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </section>
  )
} 