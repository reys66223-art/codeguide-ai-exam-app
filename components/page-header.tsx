import { Button } from "@/components/ui/button"
import Link from "next/link"
import { IconPlus } from "@tabler/icons-react"

interface PageHeaderProps {
  title: string
  description: string
  action?: {
    label: string
    href: string
  }
  children?: React.ReactNode
}

export function PageHeader({ title, description, action, children }: PageHeaderProps) {
  return (
    <div className="px-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center space-x-4">
          {children}
          {action && (
            <Button asChild>
              <Link href={action.href}>
                <IconPlus className="h-4 w-4 mr-2" />
                {action.label}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}