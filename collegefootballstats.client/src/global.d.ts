declare module 'lucide-react' {
    import { FC, SVGProps } from 'react'
    export interface LucideProps extends SVGProps<SVGSVGElement> {
      size?: number | string
      color?: string
      strokeWidth?: number | string
    }
    export type LucideIcon = FC<LucideProps>
    export const Menu: LucideIcon
    // Add other icons you plan to use
  }