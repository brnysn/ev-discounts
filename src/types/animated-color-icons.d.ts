declare module "@animated-color-icons/lucide-react" {
  import type { ForwardRefExoticComponent, RefAttributes, SVGProps } from "react"

  export type AnimatedLucideIcon = ForwardRefExoticComponent<
    SVGProps<SVGSVGElement> & {
      size?: number
      color?: string
      primaryColor?: string
      secondaryColor?: string
      strokeWidth?: number
      label?: string
    } & RefAttributes<SVGSVGElement>
  >

  export const ChevronRight: AnimatedLucideIcon
  export const Filter: AnimatedLucideIcon
  export const LocateFixed: AnimatedLucideIcon
  export const LocateOff: AnimatedLucideIcon
  export const MapPin: AnimatedLucideIcon
  export const Menu: AnimatedLucideIcon
  export const Navigation: AnimatedLucideIcon
  export const Search: AnimatedLucideIcon
  export const X: AnimatedLucideIcon
  export const Zap: AnimatedLucideIcon
}
